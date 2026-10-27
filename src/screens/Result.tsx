import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, RotateCcw, Volume2, VolumeX, AlertCircle, Sparkles } from 'lucide-react';
import { type EventConfig } from '@/data/events';
import Motif from '@/components/Motif';
import OrnateDivider from '@/components/OrnateDivider';

export type ResultState =
  | { status: 'success'; videoUrl: string }
  | { status: 'error'; message: string };

interface ResultProps {
  event: EventConfig;
  result: ResultState;
  onRetry: () => void;
  onReset: () => void;
}

export default function Result({ event, result, onRetry, onReset }: ResultProps) {
  if (result.status === 'error') {
    return <ErrorState event={event} message={result.message} onRetry={onRetry} onReset={onReset} />;
  }
  return <SuccessState event={event} videoUrl={result.videoUrl} onReset={onReset} />;
}

function SuccessState({
  event,
  videoUrl,
  onReset,
}: {
  event: EventConfig;
  videoUrl: string;
  onReset: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    const playPromise = v.play();
    if (playPromise && typeof playPromise.catch === 'function') playPromise.catch(() => {});
  }, []);

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = `rasm-${event.name.toLowerCase()}-invitation.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <section className="relative mx-auto flex min-h-[100svh] max-w-3xl flex-col items-center justify-center px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="text-center"
      >
        <p
          className="font-sans text-xs uppercase tracking-[0.4em]"
          style={{ color: event.hexLight }}
        >
          Your film is ready
        </p>
        <h2 className="mt-3 font-display text-4xl text-ivory-50 sm:text-5xl">
          The premiere awaits
        </h2>
        <OrnateDivider className="mt-5" color={event.hex} />
      </motion.div>

      {/* Clapboard / ornate video frame */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="ornate-border relative mt-10 w-full overflow-hidden bg-ink-900 shadow-glow-lg"
        style={{ borderColor: `${event.hex}66` }}
      >
        {/* clapboard top bar */}
        <div
          className="flex items-center justify-between px-4 py-2"
          style={{ background: `linear-gradient(90deg, ${event.hexDeep}, ${event.hex}, ${event.hexDeep})` }}
        >
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-ink-900/60" />
            <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-ink-900">
              Rasm · {event.name}
            </span>
          </div>
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-ink-900/80">
            Scene 01 · Take 01
          </span>
        </div>

        {/* video */}
        <div className="relative aspect-video w-full bg-ink-900">
          <video
            ref={videoRef}
            src={videoUrl}
            className="h-full w-full object-cover"
            loop
            playsInline
            controls={false}
          />
          {/* unmute control */}
          <button
            onClick={toggleMute}
            className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border border-ivory-300/30 bg-ink-900/70 text-ivory-100 backdrop-blur-sm transition-all hover:border-gold-300/60 hover:text-gold-200"
            aria-label={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </button>
          {/* corner motifs */}
          <div className="pointer-events-none absolute left-3 top-3 opacity-30" style={{ color: event.hexLight }}>
            <Motif motif={event.motif} className="h-7 w-7" color={event.hexLight} />
          </div>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
      >
        <button onClick={handleDownload} className="btn-gold group">
          <Download className="h-4 w-4" />
          Download Video
        </button>
        <button onClick={onReset} className="btn-ghost group">
          <RotateCcw className="h-4 w-4" />
          Create Another Invitation
        </button>
      </motion.div>

      <p className="mt-6 max-w-sm text-center font-serif text-sm italic text-ivory-300/50">
        Your film lives only in this moment — download it to keep it forever.
      </p>
    </section>
  );
}

function ErrorState({
  event,
  message,
  onRetry,
  onReset,
}: {
  event: EventConfig;
  message: string;
  onRetry: () => void;
  onReset: () => void;
}) {
  return (
    <section className="relative mx-auto flex min-h-[100svh] max-w-lg flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex h-20 w-20 items-center justify-center rounded-full border"
        style={{ borderColor: `${event.hex}55`, background: `${event.hex}1a` }}
      >
        <AlertCircle className="h-9 w-9" style={{ color: event.hexLight }} strokeWidth={1.4} />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-8 font-display text-3xl text-ivory-50 sm:text-4xl"
      >
        Something interrupted the shoot
      </motion.h2>
      <OrnateDivider className="my-5" color={event.hex} />
      <p className="font-serif text-lg text-ivory-300/70">
        Let's try again — the best scenes often take a second take.
      </p>

      <p className="mt-4 max-w-sm font-sans text-xs text-ivory-300/40">{message}</p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
      >
        <button onClick={onRetry} className="btn-gold group">
          <Sparkles className="h-4 w-4" />
          Try Again
        </button>
        <button onClick={onReset} className="btn-ghost group">
          <RotateCcw className="h-4 w-4" />
          Start Over
        </button>
      </motion.div>
    </section>
  );
}
