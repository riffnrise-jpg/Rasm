import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { type EventConfig } from '@/data/events';
import Motif from '@/components/Motif';
import OrnateDivider from '@/components/OrnateDivider';

interface GeneratingProps {
  event: EventConfig;
}

/**
 * Cinematic loading sequence — rotating storytelling messages over a
 * golden light sweep + film-reel animation. No percentage number.
 */
export default function Generating({ event }: GeneratingProps) {
  const [msgIndex, setMsgIndex] = useState(0);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    timer.current = window.setInterval(() => {
      setMsgIndex((i) => (i + 1) % event.loadingMessages.length);
    }, 3200);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [event.loadingMessages.length]);

  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6">
      {/* sweeping golden light */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="absolute -inset-y-10 w-1/3 bg-gold-sheen blur-2xl"
          animate={{ x: ['-20vw', '120vw'] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }}
        />
      </motion.div>

      <div className="relative flex flex-col items-center text-center">
        {/* Film reel / clapperboard animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative mb-10"
        >
          <div
            className="relative flex h-32 w-32 items-center justify-center rounded-full border-2"
            style={{ borderColor: `${event.hex}55`, background: `${event.hex}10` }}
          >
            {/* rotating reel */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            >
              <Motif motif={event.motif} className="h-16 w-16" color={event.hexLight} />
            </motion.div>

            {/* progress ring */}
            <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 128 128">
              <circle
                cx="64"
                cy="64"
                r="58"
                fill="none"
                stroke="rgba(247,241,230,0.08)"
                strokeWidth="2"
              />
              <motion.circle
                cx="64"
                cy="64"
                r="58"
                fill="none"
                stroke={event.hex}
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 58}
                initial={{ strokeDashoffset: 2 * Math.PI * 58 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 90, ease: 'linear' }}
              />
            </svg>

            {/* pulsing glow */}
            <motion.div
              className="absolute inset-0 rounded-full blur-xl"
              style={{ background: event.hex, opacity: 0.15 }}
              animate={{ opacity: [0.1, 0.25, 0.1] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="font-sans text-xs uppercase tracking-[0.4em] text-ivory-300/50"
        >
          {event.name} · In production
        </motion.p>

        <OrnateDivider className="my-6" color={event.hex} />

        {/* Rotating storytelling messages */}
        <div className="relative h-16 w-full max-w-md">
          <AnimatePresence mode="wait">
            <motion.h2
              key={msgIndex}
              initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -14, filter: 'blur(4px)' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 font-display text-2xl text-ivory-50 sm:text-3xl"
            >
              {event.loadingMessages[msgIndex]}
            </motion.h2>
          </AnimatePresence>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 font-serif text-sm italic text-ivory-300/50"
        >
          Your film is being crafted — frame by frame.
        </motion.p>

        {/* film perforation strip */}
        <div className="mt-12 flex w-64 justify-between">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="h-3 w-2 rounded-sm bg-ivory-300/20"
              animate={{ opacity: [0.2, 0.7, 0.2] }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                delay: i * 0.18,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
