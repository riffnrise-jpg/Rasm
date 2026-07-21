import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { EVENT_LIST, type EventConfig, type EventKey } from '@/data/events';
import Motif from '@/components/Motif';
import OrnateDivider from '@/components/OrnateDivider';

interface EventSelectionProps {
  onSelect: (key: EventKey) => void;
  onBack: () => void;
}

export default function EventSelection({ onSelect, onBack }: EventSelectionProps) {
  return (
    <section className="relative mx-auto min-h-[100svh] max-w-6xl px-6 py-16 sm:py-24">
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        onClick={onBack}
        className="mb-10 inline-flex items-center gap-2 font-sans text-sm text-ivory-300/60 transition-colors hover:text-gold-200"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="text-center"
      >
        <p className="font-sans text-xs uppercase tracking-[0.4em] text-gold-300/70">
          Choose your ceremony
        </p>
        <h2 className="mt-4 font-display text-4xl text-ivory-50 sm:text-5xl">
          Which moment shall we film?
        </h2>
        <OrnateDivider className="mt-6" />
        <p className="mx-auto mt-6 max-w-lg font-serif text-lg text-ivory-300/70">
          Each ceremony carries its own colour, its own rhythm, its own light. Select the one
          that opens your celebration.
        </p>
      </motion.div>

      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {EVENT_LIST.map((event, i) => (
          <EventCard key={event.key} event={event} index={i} onSelect={() => onSelect(event.key)} />
        ))}
      </div>
    </section>
  );
}

function EventCard({
  event,
  index,
  onSelect,
}: {
  event: EventConfig;
  index: number;
  onSelect: () => void;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.7,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.99 }}
      onClick={onSelect}
      className="group relative overflow-hidden rounded-2xl border border-ivory-300/10 bg-ink-800/50 p-8 text-left backdrop-blur-sm transition-colors duration-500 hover:border-[color:var(--accent)]/50"
      style={
        {
          ['--accent' as string]: event.hex,
        } as React.CSSProperties
      }
    >
      {/* glow halo */}
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-20 blur-3xl transition-opacity duration-500 group-hover:opacity-50"
        style={{ background: event.hex }}
      />

      {/* motif watermark */}
      <div
        className="pointer-events-none absolute -bottom-6 -right-6 opacity-[0.08] transition-opacity duration-500 group-hover:opacity-[0.16]"
        style={{ color: event.hex }}
      >
        <Motif motif={event.motif} className="h-40 w-40" color={event.hex} />
      </div>

      <div className="relative">
        <div
          className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border transition-all duration-500 group-hover:scale-110"
          style={{ borderColor: `${event.hex}66`, background: `${event.hex}1a` }}
        >
          <Motif motif={event.motif} className="h-9 w-9" color={event.hexLight} />
        </div>

        <p
          className="font-sans text-xs uppercase tracking-[0.3em]"
          style={{ color: event.hexLight }}
        >
          {event.tagline}
        </p>
        <h3 className="mt-2 font-display text-3xl text-ivory-50">{event.name}</h3>
        <p className="mt-4 max-w-xs font-serif text-base leading-relaxed text-ivory-300/70">
          {event.description}
        </p>

        <div className="mt-8 flex items-center gap-2 font-sans text-sm text-ivory-300/60 transition-colors duration-300 group-hover:text-[color:var(--accent)]">
          <span>Craft this film</span>
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </div>
      </div>

      {/* bottom accent line */}
      <div
        className="absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-500 group-hover:w-full"
        style={{ background: `linear-gradient(90deg, ${event.hex}, ${event.hexLight})` }}
      />
    </motion.button>
  );
}
