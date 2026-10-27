import { useEffect, useState } from 'react';
import { ArrowLeft, CalendarDays, Download, Loader2 } from 'lucide-react';
import type { InvitationDetails } from '@/data/events';
import type { TemplateData } from '@/templates/types';
import { TEMPLATE_MAP } from '@/templates';
import TemplatePlayer from '@/components/TemplatePlayer';
import PaymentGate from '@/components/PaymentGate';
import { exportVideo } from '@/engine/exportVideo';

interface Props { slug: string; details: InvitationDetails; onBack: () => void; onEditAnother: () => void; }
export default function TemplateEditor({ slug, details, onBack, onEditAnother }: Props) {
  const template = TEMPLATE_MAP[slug];
  const initial = Object.fromEntries(template.fields.map((field) => [field.key, field.default])) as TemplateData;
  const intakeValues: TemplateData = {
    groom: details.groomName,
    bride: details.brideName,
    date: details.eventDateTime.slice(0, 10),
    extra: details.venue,
    extraEnabled: Boolean(details.venue),
  };
  const [data, setData] = useState<TemplateData>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(`rasm:${slug}`) ?? '{}') as TemplateData;
      return { ...initial, ...saved, ...intakeValues };
    } catch {
      return { ...initial, ...intakeValues };
    }
  });
  const [time, setTime] = useState(0); const [modal, setModal] = useState(false); const [rendering, setRendering] = useState(false); const [progress, setProgress] = useState(0); const [download, setDownload] = useState<Blob | null>(null); const [error, setError] = useState('');
  useEffect(() => { localStorage.setItem(`rasm:${slug}`, JSON.stringify(data)); }, [data, slug]);
  const set = (key: string, value: string | boolean) => { setData((current) => ({ ...current, [key]: value })); setTime(template.posterTime); };
  const triggerDownload = (blob: Blob) => {
    const anchor = document.createElement('a');
    anchor.href = URL.createObjectURL(blob);
    anchor.download = `${String(data.groom).trim().replace(/\s+/g, '-')}-weds-${String(data.bride).trim().replace(/\s+/g, '-')}.${blob.type.includes('webm') ? 'webm' : 'mp4'}`;
    anchor.click();
  };
  const render = async () => {
    setModal(false);
    setRendering(true);
    setError('');
    try {
      const blob = await exportVideo(template, data, String(data.theme ?? 'teal'), { onProgress: setProgress });
      setDownload(blob);
      triggerDownload(blob);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Rendering failed.');
    } finally {
      setRendering(false);
    }
  };
  const saveDownload = () => { if (download) triggerDownload(download); };
  if (rendering || download || error) return <section className="mx-auto flex min-h-[100svh] max-w-xl flex-col items-center justify-center px-6 text-center"><div className="ornate-border w-full bg-ink-800/80 p-10">{rendering ? <><Loader2 className="mx-auto h-9 w-9 animate-spin text-gold-300" /><h2 className="mt-5 font-display text-3xl text-ivory-50">Rendering your invitation... {Math.round(progress * 100)}%</h2><p className="mt-3 font-serif text-ivory-300/70">Keep this tab open while rendering.</p><div className="mt-7 h-2 overflow-hidden rounded-full bg-ivory-100/10"><div className="h-full bg-gold-300 transition-all" style={{ width: `${progress * 100}%` }} /></div></> : error ? <><h2 className="font-display text-3xl text-ivory-50">We could not finish that render</h2><p className="mt-3 text-sm text-gold-200">{error}</p><button className="btn-gold mt-7" onClick={() => setModal(true)}>Try again</button></> : <><Download className="mx-auto h-10 w-10 text-gold-300" /><h2 className="mt-5 font-display text-3xl text-ivory-50">Your invitation is ready</h2><button className="btn-gold mt-7" onClick={saveDownload}>Download again</button><button className="btn-ghost mt-3" onClick={onEditAnother}>Edit another</button></>}</div></section>;
  return <section className="mx-auto min-h-[100svh] max-w-7xl px-5 py-16 sm:px-8"><button onClick={onBack} className="mb-8 inline-flex items-center gap-2 font-sans text-sm text-ivory-300/60 hover:text-gold-200"><ArrowLeft className="h-4 w-4" /> Back to templates</button><div className="grid gap-10 lg:grid-cols-[minmax(280px,430px)_1fr] lg:items-start"><div className="lg:sticky lg:top-8"><TemplatePlayer template={template} data={data} themeId={String(data.theme ?? 'teal')} onTimeUpdate={(current) => setTime(current)} /><p className="mt-2 text-center font-sans text-xs text-ivory-300/40">Preview at {time.toFixed(1)}s</p></div><div className="ornate-border bg-ink-800/70 p-6 sm:p-8"><p className="font-sans text-xs uppercase tracking-[.35em] text-gold-300/70">{template.category} template</p><h1 className="mt-3 font-display text-4xl text-ivory-50">{template.name}</h1><div className="mt-8 space-y-6">{template.fields.map((field) => <label key={field.key} className="block"><span className="mb-2 block font-sans text-xs uppercase tracking-[.2em] text-ivory-300/60">{field.label}</span>{field.type === 'toggle' ? <span className="flex items-center gap-3 font-serif text-ivory-100"><input type="checkbox" checked={Boolean(data[field.key])} onChange={(event) => set(field.key, event.target.checked)} className="h-4 w-4 accent-gold-400" /> Include this line</span> : field.type === 'select' ? <div className="flex gap-3">{field.options?.map((option) => <button type="button" key={option.value} onClick={() => set(field.key, option.value)} className={`h-9 w-9 rounded-full border-2 ${data[field.key] === option.value ? 'border-ivory-50' : 'border-transparent'}`} style={{ background: template.themes.find((theme) => theme.id === option.value)?.colors.primary }} aria-label={option.label} title={option.label} />)}</div> : <div className="field-underline">{field.type === 'date' ? <span className="relative block"><CalendarDays className="pointer-events-none absolute right-1 top-3 h-4 w-4 text-gold-300" /><input type="date" value={String(data[field.key] ?? '')} onChange={(event) => set(field.key, event.target.value)} className="[color-scheme:dark]" /></span> : <input value={String(data[field.key] ?? '')} maxLength={field.maxLength} onChange={(event) => set(field.key, event.target.value)} />}</div>}</label>)}</div><div className="mt-10 border-t border-ivory-100/10 pt-6"><button disabled={!data.groom || !data.bride} onClick={() => setModal(true)} className="btn-gold w-full">Pay & Download · ₹{template.price}</button></div></div></div>{modal && <PaymentGate name={template.name} price={template.price} onClose={() => setModal(false)} onSuccess={() => void render()} />}</section>;
}
