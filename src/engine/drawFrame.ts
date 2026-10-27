import type { Layer, Template, TemplateData, Theme, Animation } from '@/templates/types';

const imageCache = new Map<string, HTMLImageElement>();

function ease(value: number, kind: Animation['easing']): number {
  const t = Math.max(0, Math.min(1, value));
  if (kind === 'linear') return t;
  if (kind === 'easeInOutCubic') return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  return 1 - Math.pow(1 - t, 3);
}

function progress(t: number, animation?: Animation) {
  if (!animation || animation.kind === 'none') return 1;
  return ease((t - animation.start) / animation.duration, animation.easing);
}

function seeded(seed: number) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let next = Math.imul(value ^ (value >>> 15), 1 | value);
    next ^= next + Math.imul(next ^ (next >>> 7), 61 | next);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function formatDate(value: string) {
  if (!value) return '';
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  const day = date.getDate();
  const suffix = day % 100 >= 11 && day % 100 <= 13 ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' } as Record<number, string>)[day % 10] || 'th';
  return `${day}${suffix} ${date.toLocaleString('en-US', { month: 'long' })}, ${date.getFullYear()}`;
}

function resolveContent(content: string, data: TemplateData) {
  return content.replace(/\{(.*?)\}/g, (_, key: string) => String(data[key.trim()] ?? ''));
}

function color(value: string, theme: Theme) {
  if (value === 'primary') return theme.colors.primary;
  if (value === 'secondary') return theme.colors.secondary;
  if (value === 'accent') return theme.colors.accent;
  return value;
}

function state(animation: Animation | undefined, time: number) {
  if (!animation || animation.kind === 'none') return { opacity: 1, y: 0, scale: 1, scaleX: 1, rotation: 0, blur: 0 };
  if (time < animation.start) return { opacity: 0, y: animation.rise ?? 16, scale: animation.kind === 'scaleIn' ? 0.85 : 1, scaleX: animation.kind === 'drawOn' ? 0.7 : 1, rotation: 0, blur: animation.blur ?? 0 };
  const phase = progress(time, animation);
  if (animation.kind === 'fadeUp') return { opacity: phase, y: (animation.rise ?? 16) * (1 - phase), scale: 1, scaleX: 1, rotation: 0, blur: (1 - phase) * 4 };
  if (animation.kind === 'scaleIn') return { opacity: phase, y: 0, scale: 0.85 + phase * 0.15, scaleX: 1, rotation: 0, blur: (1 - phase) * 6 };
  if (animation.kind === 'sway') return { opacity: 1, y: 0, scale: 1, scaleX: 1, rotation: Math.sin(time * 1.8) * 0.035, blur: 0 };
  if (animation.kind === 'pulse') return { opacity: 0.82 + Math.sin(time * 3) * 0.18, y: 0, scale: 1, scaleX: 1, rotation: 0, blur: 0 };
  if (animation.kind === 'drawOn') return { opacity: Math.min(1, phase * 1.5), y: 0, scale: 1, scaleX: 0.7 + phase * 0.3, rotation: 0, blur: 0 };
  return { opacity: phase, y: 0, scale: 1, scaleX: 1, rotation: 0, blur: 0 };
}

function fitText(ctx: CanvasRenderingContext2D, text: string, font: string, maxWidth: number, baseSize: number, spacing = 0) {
  let size = baseSize;
  while (size > baseSize * 0.55) {
    ctx.font = font.replace(`${baseSize}px`, `${size}px`);
    const width = Math.max(...text.split('\n').map((line) => ctx.measureText(line).width + Math.max(0, line.length - 1) * spacing));
    if (width <= maxWidth) break;
    size -= 1;
  }
  return size;
}

function drawText(ctx: CanvasRenderingContext2D, layer: Extract<Layer, { type: 'text' }>, data: TemplateData, theme: Theme, time: number) {
  const text = layer.id === 'date' ? formatDate(String(data.date ?? '')) : resolveContent(layer.content, data);
  if (!text || (layer.id === 'extra' && !data.extraEnabled)) return;
  const animation = state(layer.animation, time);
  const baseSize = layer.sizeRatio * ctx.canvas.width;
  const font = `${layer.weight} ${baseSize}px "${layer.fontFamily}"`;
  const size = fitText(ctx, text, font, (layer.maxWidthRatio ?? 1) * ctx.canvas.width, baseSize, layer.letterSpacing ?? 0);
  ctx.save(); ctx.globalAlpha = animation.opacity; ctx.translate(layer.x * ctx.canvas.width, layer.y * ctx.canvas.height + animation.y); ctx.scale(animation.scale, animation.scale); if (animation.blur && 'filter' in ctx) ctx.filter = `blur(${animation.blur}px)`; ctx.textAlign = layer.align; ctx.textBaseline = 'middle'; ctx.font = `${layer.weight} ${size}px "${layer.fontFamily}"`;
  if (layer.shadow) { ctx.shadowColor = layer.shadow.color; ctx.shadowBlur = layer.shadow.blur; }
  if (typeof layer.fill === 'object') { const gradient = ctx.createLinearGradient(0, -size, 0, size); gradient.addColorStop(0, color(layer.fill.from, theme)); gradient.addColorStop(1, color(layer.fill.to, theme)); ctx.fillStyle = gradient; } else ctx.fillStyle = color(layer.fill, theme);
  const lines = text.split('\n');
  ctx.lineJoin = 'round';
  ctx.strokeStyle = '#241108cc';
  ctx.lineWidth = Math.max(2, size * 0.035);
  lines.forEach((line, index) => {
    const y = (index - (lines.length - 1) / 2) * size * (layer.lineHeight ?? 1.1);
    if (layer.animation?.kind === 'letterStagger') {
      const random = seeded(layer.animation.seed ?? 1);
      let x = layer.align === 'center' ? -ctx.measureText(line).width / 2 : 0;
      [...line].forEach((character) => { const delay = random() * (layer.animation?.spread ?? 1); const opacity = Math.max(0, Math.min(1, (time - (layer.animation?.start ?? 0) - delay) / (layer.animation?.duration ?? 0.7))); ctx.save(); ctx.globalAlpha *= opacity; if ('filter' in ctx && opacity < 0.8) ctx.filter = `blur(${(1 - opacity) * (layer.animation?.blur ?? 8)}px)`; ctx.strokeText(character, x, y + (1 - opacity) * (layer.animation?.rise ?? 14)); ctx.fillText(character, x, y + (1 - opacity) * (layer.animation?.rise ?? 14)); ctx.restore(); x += ctx.measureText(character).width + (layer.letterSpacing ?? 0); });
    } else { ctx.strokeText(line, 0, y); ctx.fillText(line, 0, y); }
  });
  ctx.restore();
}

export async function loadTemplateFonts(template: Template) {
  await Promise.all(template.fonts.map((font) => document.fonts.load(`${font.weights[0]} 32px "${font.family}"`)));
  await document.fonts.ready;
}

export interface DrawFrameOptions {
  showWatermark?: boolean;
  clear?: boolean;
}

export function drawFrame(ctx: CanvasRenderingContext2D, template: Template, data: TemplateData, theme: Theme, time: number, opts: DrawFrameOptions = {}) {
  if (opts.clear !== false) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }
  ctx.save();
  if (template.camera && time >= template.camera.start) { const amount = ease((time - template.camera.start) / (template.camera.end - template.camera.start), template.camera.easing); const scale = template.camera.from + (template.camera.to - template.camera.from) * amount; const ox = template.camera.origin[0] * ctx.canvas.width; const oy = template.camera.origin[1] * ctx.canvas.height; ctx.translate(ox, oy); ctx.scale(scale, scale); ctx.translate(-ox, -oy); }
  template.layers.forEach((layer) => {
    if (layer.type === 'text') drawText(ctx, layer, data, theme, time);
    if (layer.type === 'ornament') { const item = state(layer.animation, time); const path = new Path2D(layer.svgPath); const width = layer.widthRatio * ctx.canvas.width; ctx.save(); ctx.globalAlpha = item.opacity; ctx.translate(layer.x * ctx.canvas.width - width / 2, layer.y * ctx.canvas.height); ctx.scale(item.scaleX * width / 360, width / 360); ctx.strokeStyle = color(layer.color, theme); ctx.shadowColor = '#ffd76a'; ctx.shadowBlur = 12; ctx.lineWidth = 2.5; ctx.stroke(path); ctx.restore(); }
    if (layer.type === 'image') { const item = state(layer.animation, time); let image = imageCache.get(layer.src); if (!image) { image = new Image(); image.src = layer.src; imageCache.set(layer.src, image); } if (image.complete && image.naturalWidth) { ctx.save(); ctx.globalAlpha = item.opacity; ctx.translate(layer.x * ctx.canvas.width, layer.y * ctx.canvas.height); ctx.rotate(item.rotation); ctx.drawImage(image, -layer.widthRatio * ctx.canvas.width / 2, 0, layer.widthRatio * ctx.canvas.width, layer.widthRatio * ctx.canvas.width); ctx.restore(); } }
  });
  ctx.restore();
  if (opts.showWatermark) drawWatermark(ctx);
}

export function drawWatermark(ctx: CanvasRenderingContext2D) {
  ctx.save(); ctx.globalAlpha = 0.14; ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2); ctx.rotate(-0.45); ctx.font = '600 30px Poppins'; ctx.fillStyle = '#fff'; for (let y = -ctx.canvas.height; y < ctx.canvas.height; y += 140) for (let x = -ctx.canvas.width; x < ctx.canvas.width; x += 300) ctx.fillText('RASM PREVIEW', x, y); ctx.restore();
  ctx.save(); ctx.globalAlpha = 0.9; ctx.fillStyle = '#14090acc'; ctx.roundRect(32, 32, 310, 52, 26); ctx.fill(); ctx.fillStyle = '#fdfaf4'; ctx.font = '600 18px Poppins'; ctx.fillText('PREVIEW: LOW QUALITY', 55, 66); ctx.restore();
}
