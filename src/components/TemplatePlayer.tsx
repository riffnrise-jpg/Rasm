import { useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { drawFrame, loadTemplateFonts } from '@/engine/drawFrame';
import type { Template, TemplateData } from '@/templates/types';

interface Props { template: Template; data: TemplateData; themeId: string; showWatermark?: boolean; onTimeUpdate?: (time: number, duration: number) => void; }

export default function TemplatePlayer({ template, data, themeId, showWatermark = true, onTimeUpdate }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>();
  const currentTimeRef = useRef(0);
  const onTimeUpdateRef = useRef(onTimeUpdate);
  const lastUiUpdateRef = useRef(0);
  const [playing, setPlaying] = useState(true);
  const [ready, setReady] = useState(false);
  const [hasVideo, setHasVideo] = useState(true);
  const [duration, setDuration] = useState(template.duration ?? 10);
  const [currentTime, setCurrentTime] = useState(0);
  const theme = template.themes.find((item) => item.id === themeId) ?? template.themes[0];

  useEffect(() => { onTimeUpdateRef.current = onTimeUpdate; }, [onTimeUpdate]);

  useEffect(() => { let active = true; void loadTemplateFonts(template).then(() => { if (active) setReady(true); }); return () => { active = false; }; }, [template]);
  useEffect(() => {
    const canvas = canvasRef.current; const video = videoRef.current; if (!canvas || !ready) return;
    // Preview at half resolution; exports still use the template's full 1080x1920 canvas.
    canvas.width = Math.round(template.width * 0.5); canvas.height = Math.round(template.height * 0.5);
    const draw = (time: number) => { const ctx = canvas.getContext('2d'); if (ctx) drawFrame(ctx, template, data, theme, time, { showWatermark }); currentTimeRef.current = time; if (performance.now() - lastUiUpdateRef.current > 120) { lastUiUpdateRef.current = performance.now(); setCurrentTime(time); onTimeUpdateRef.current?.(time, duration); } };
    const videoWithCallback = video as HTMLVideoElement & { requestVideoFrameCallback?: (callback: (now: number, metadata: { mediaTime: number }) => void) => number; cancelVideoFrameCallback?: (handle: number) => void };
    let videoFrameHandle: number | undefined;
    const tick = () => { const time = video && hasVideo && Number.isFinite(video.currentTime) ? video.currentTime : playing ? (performance.now() / 1000) % duration : currentTimeRef.current; draw(time); frameRef.current = requestAnimationFrame(tick); };
    const drawVideoFrame = (_now: number, metadata: { mediaTime: number }) => { draw(metadata.mediaTime); if (playing) videoFrameHandle = videoWithCallback.requestVideoFrameCallback?.(drawVideoFrame); };
    if (video && hasVideo && videoWithCallback.requestVideoFrameCallback) videoFrameHandle = videoWithCallback.requestVideoFrameCallback(drawVideoFrame); else tick();
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); if (videoFrameHandle !== undefined) videoWithCallback.cancelVideoFrameCallback?.(videoFrameHandle); };
  }, [data, duration, hasVideo, playing, ready, showWatermark, template, theme]);

  useEffect(() => { const video = videoRef.current; if (!video) return; if (playing) void video.play().catch(() => undefined); else video.pause(); }, [playing]);
  const replay = () => { currentTimeRef.current = 0; setCurrentTime(0); if (videoRef.current && hasVideo) { videoRef.current.currentTime = 0; void videoRef.current.play(); } };
  return <div className="space-y-3">
    <div className="relative mx-auto aspect-[9/16] w-full max-w-[390px] overflow-hidden rounded-[2rem] border border-gold-300/30 bg-[#83c8ce] shadow-glow-lg">
      <div className="absolute inset-0 bg-[linear-gradient(160deg,#8ed9df_0%,#5eb7bd_45%,#1f727e_100%)]"><div className="absolute inset-0 animate-pulse bg-[radial-gradient(ellipse_at_25%_20%,rgba(255,255,255,.45),transparent_35%)]" /></div>
      <video ref={videoRef} src={template.videoSrc} muted playsInline loop className={`absolute inset-0 h-full w-full object-cover ${hasVideo ? 'opacity-100' : 'opacity-0'}`} onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || duration)} onError={() => setHasVideo(false)} />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      {!ready && <div className="absolute inset-0 grid place-items-center bg-ink-900/60 font-sans text-xs uppercase tracking-[.25em] text-gold-200">Loading type</div>}
    </div>
    <div className="flex items-center gap-3 text-ivory-300/70">
      <button aria-label={playing ? 'Pause preview' : 'Play preview'} onClick={() => setPlaying((value) => !value)} className="btn-ghost !rounded-full !p-3">{playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}</button>
      <button aria-label="Replay preview" onClick={replay} className="btn-ghost !rounded-full !p-3"><RotateCcw className="h-4 w-4" /></button>
      <input aria-label="Preview timeline" type="range" min="0" max={duration} step="0.01" value={currentTime} onChange={(event) => { const value = Number(event.target.value); currentTimeRef.current = value; setCurrentTime(value); if (videoRef.current && hasVideo) videoRef.current.currentTime = value; }} className="h-1 flex-1 accent-gold-300" />
      <span className="whitespace-nowrap font-sans text-xs">{currentTime.toFixed(1)}s / {duration.toFixed(1)}s</span>
    </div>
  </div>;
}
