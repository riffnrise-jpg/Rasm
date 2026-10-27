import { drawFrame, loadTemplateFonts } from './drawFrame';
import type { Template, TemplateData } from '@/templates/types';

export interface ExportOptions {
  onProgress?: (progress: number) => void;
  signal?: AbortSignal;
}

export async function exportVideo(
  template: Template,
  data: TemplateData,
  themeId: string,
  options: ExportOptions = {}
) {
  await loadTemplateFonts(template);
  const theme = template.themes.find((item) => item.id === themeId) ?? template.themes[0];

  const source = document.createElement('video');
  source.src = template.videoSrc;
  source.muted = true;
  source.playsInline = true;
  source.preload = 'auto';
  // Keep element in the DOM and active so browser hardware decoders process video frames reliably
  source.style.position = 'fixed';
  source.style.left = '0';
  source.style.top = '0';
  source.style.width = '160px';
  source.style.height = '90px';
  source.style.opacity = '0.01';
  source.style.pointerEvents = 'none';
  source.style.zIndex = '-9999';
  document.body.appendChild(source);

  await new Promise<void>((resolve) => {
    let doneCalled = false;
    const done = () => {
      if (!doneCalled) {
        doneCalled = true;
        resolve();
      }
    };
    source.onloadedmetadata = done;
    source.onloadeddata = done;
    source.oncanplay = done;
    source.onerror = done;
    setTimeout(done, 3000);
    source.load();
  });

  if (source.videoWidth > 0 && source.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
    await new Promise<void>((resolve) => {
      const done = () => resolve();
      source.oncanplay = done;
      setTimeout(done, 2000);
    });
  }

  const duration = source.duration || template.duration || 10;
  try {
    // Real-time capture is intentionally the production path: it preserves the decoded
    // background video and avoids browser-specific WebCodecs finalization stalls.
    return await exportRealtimeWebm(source, template, data, theme, duration, options);
  } finally {
    source.pause();
    source.remove();
  }
}

async function exportRealtimeWebm(
  source: HTMLVideoElement,
  template: Template,
  data: TemplateData,
  theme: typeof template.themes[number],
  duration: number,
  options: ExportOptions
) {
  const canvas = document.createElement('canvas');
  canvas.width = template.width;
  canvas.height = template.height;
  const ctx = canvas.getContext('2d')!;

  const stream = canvas.captureStream(template.fps);
  const mimeType =
    ['video/mp4;codecs=avc1', 'video/mp4', 'video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'].find(
      (candidate) => typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(candidate)
    ) ?? 'video/webm';

  const recorder = new MediaRecorder(stream, { mimeType });
  const chunks: BlobPart[] = [];
  recorder.ondataavailable = (event) => {
    if (event.data.size > 0) chunks.push(event.data);
  };
  const stopped = new Promise<void>((resolve) => {
    recorder.onstop = () => resolve();
  });

  if (source.currentTime !== 0) {
    source.currentTime = 0;
    await new Promise<void>((resolve) => {
      const onSeeked = () => {
        source.removeEventListener('seeked', onSeeked);
        resolve();
      };
      source.addEventListener('seeked', onSeeked);
      setTimeout(resolve, 500);
    });
  }

  // Draw initial opening frame before starting recorder so recorder never captures a blank canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground(ctx, source);
  drawFrame(ctx, template, data, theme, 0, { clear: false });

  source.loop = false;
  await source.play().catch(() => undefined);
  recorder.start(250);

  const startedAt = performance.now();
  await new Promise<void>((resolve, reject) => {
    let frameHandle = 0;
    const render = () => {
      if (options.signal?.aborted) {
        cancelAnimationFrame(frameHandle);
        source.pause();
        recorder.stop();
        reject(new DOMException('Export cancelled', 'AbortError'));
        return;
      }

      const time = Math.min(source.currentTime, duration);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBackground(ctx, source);
      drawFrame(ctx, template, data, theme, time, { clear: false });

      options.onProgress?.(Math.min(0.99, time / duration));

      if (source.ended || time >= duration - 0.02 || (performance.now() - startedAt) / 1000 >= duration + 1) {
        source.pause();
        recorder.stop();
        resolve();
        return;
      }
      frameHandle = requestAnimationFrame(render);
    };
    frameHandle = requestAnimationFrame(render);
  });

  await stopped;
  options.onProgress?.(1);
  stream.getTracks().forEach((track) => track.stop());
  return new Blob(chunks, { type: mimeType });
}

function drawBackground(ctx: CanvasRenderingContext2D, video: HTMLVideoElement) {
  const cw = ctx.canvas.width;
  const ch = ctx.canvas.height;

  if (video.videoWidth > 0 && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
    const vw = video.videoWidth;
    const vh = video.videoHeight;
    const canvasRatio = cw / ch;
    const videoRatio = vw / vh;
    let sx = 0;
    let sy = 0;
    let sw = vw;
    let sh = vh;
    if (videoRatio > canvasRatio) {
      sw = vh * canvasRatio;
      sx = (vw - sw) / 2;
    } else {
      sh = vw / canvasRatio;
      sy = (vh - sh) / 2;
    }
    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, cw, ch);
    return;
  }

  const gradient = ctx.createLinearGradient(0, 0, cw, ch);
  gradient.addColorStop(0, '#8ed9df');
  gradient.addColorStop(0.5, '#5eb7bd');
  gradient.addColorStop(1, '#1f727e');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, cw, ch);
}
