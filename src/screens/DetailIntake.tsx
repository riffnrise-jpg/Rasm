import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, CalendarDays, MapPin, Heart } from 'lucide-react';
import { type EventConfig, type InvitationDetails } from '@/data/events';
import Motif from '@/components/Motif';
import OrnateDivider from '@/components/OrnateDivider';

interface DetailIntakeProps {
  event: EventConfig;
  onSubmit: (details: InvitationDetails) => void;
  onBack: () => void;
}

type FieldKey = keyof InvitationDetails;

const FIELDS: { key: FieldKey; label: string; prompt: string; placeholder: string; type: 'text' | 'textarea' | 'datetime-local'; icon: typeof Heart }[] = [
  { key: 'brideName', label: "Bride's name", prompt: 'Who is the bride whose story we begin with?', placeholder: 'e.g. Ananya', type: 'text', icon: Heart },
  { key: 'groomName', label: "Groom's name", prompt: 'And the groom who walks beside her?', placeholder: 'e.g. Vihaan', type: 'text', icon: Heart },
  { key: 'venue', label: 'Venue name', prompt: 'Where will the celebration unfold?', placeholder: 'e.g. The Leela Palace, Udaipur', type: 'text', icon: MapPin },
  { key: 'address', label: 'Full address', prompt: 'So your guests can find their way…', placeholder: 'Full postal address', type: 'textarea', icon: MapPin },
  { key: 'eventDateTime', label: 'Date & time', prompt: 'The exact moment it all begins.', placeholder: '', type: 'datetime-local', icon: CalendarDays },
];

const TOTAL = FIELDS.length;

export default function DetailIntake({ event, onSubmit, onBack }: DetailIntakeProps) {
  const [step, setStep] = useState(0); // 0..FIELDS-1 ; TOTAL = review
  const [details, setDetails] = useState<InvitationDetails>({
    brideName: '',
    groomName: '',
    venue: '',
    address: '',
    eventDateTime: '',
  });
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

  const isReview = step >= TOTAL;
  const current = FIELDS[step];
  const progress = Math.min(step, TOTAL) / TOTAL;

  const validate = (key: FieldKey, value: string): string => {
    if (!value.trim()) return 'This field is part of the story — please fill it in.';
    if (key === 'eventDateTime') {
      const d = new Date(value);
      if (isNaN(d.getTime())) return 'Please choose a valid date and time.';
      if (d.getTime() < Date.now() - 1000 * 60 * 60) return 'The moment should be in the future.';
    }
    return '';
  };

  const handleNext = () => {
    if (!current) return;
    setTouched(true);
    const err = validate(current.key, details[current.key]);
    if (err) {
      setError(err);
      return;
    }
    setError('');
    setTouched(false);
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    if (step === 0) {
      onBack();
      return;
    }
    setError('');
    setTouched(false);
    setStep((s) => s - 1);
  };

  const handleChange = (val: string) => {
    setDetails((d) => ({ ...d, [current.key]: val }));
    if (touched) {
      setError(validate(current.key, val));
    }
  };

  return (
    <section className="relative mx-auto flex min-h-[100svh] max-w-2xl flex-col px-6 py-16 sm:py-20">
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        onClick={handleBack}
        className="mb-10 inline-flex items-center gap-2 font-sans text-sm text-ivory-300/60 transition-colors hover:text-gold-200"
      >
        <ArrowLeft className="h-4 w-4" />
        {step === 0 ? 'Change ceremony' : 'Back'}
      </motion.button>

      {/* Event badge */}
      <div className="mb-8 flex flex-col items-center text-center">
        <div
          className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border"
          style={{ borderColor: `${event.hex}66`, background: `${event.hex}1a` }}
        >
          <Motif motif={event.motif} className="h-8 w-8" color={event.hexLight} />
        </div>
        <p className="font-sans text-xs uppercase tracking-[0.3em]" style={{ color: event.hexLight }}>
          {event.name} · {event.tagline}
        </p>
      </div>

      {/* Progress vine */}
      <ProgressVine progress={progress} accent={event.hex} total={TOTAL} step={step} />

      <div className="relative mt-12 flex flex-1 flex-col">
        <AnimatePresence mode="wait">
          {!isReview ? (
            <motion.div
              key={`step-${step}`}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-1 flex-col"
            >
              <div className="mb-2 flex items-center gap-2">
                <current.icon className="h-4 w-4" style={{ color: event.hexLight }} />
                <span className="font-sans text-xs uppercase tracking-[0.3em] text-ivory-300/50">
                  Step {step + 1} of {TOTAL}
                </span>
              </div>
              <h2 className="font-display text-3xl text-ivory-50 sm:text-4xl">
                {current.prompt}
              </h2>

              <div className="mt-8 field-underline">
                {current.type === 'textarea' ? (
                  <textarea
                    autoFocus
                    rows={3}
                    value={details[current.key]}
                    onChange={(e) => handleChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleNext();
                      }
                    }}
                    placeholder={current.placeholder}
                    className="resize-none font-serif text-lg"
                  />
                ) : (
                  <input
                    autoFocus
                    type={current.type}
                    value={details[current.key]}
                    onChange={(e) => handleChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleNext();
                    }}
                    placeholder={current.placeholder}
                    className="font-serif text-lg [color-scheme:dark]"
                  />
                )}
                <span className="underline-bar" />
                <motion.span
                  className="underline-fill"
                  animate={{ width: details[current.key] ? '100%' : '0%' }}
                  transition={{ duration: 0.4 }}
                  style={{ background: event.hex }}
                />
              </div>

              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="mt-3 font-sans text-sm text-gold-300"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <div className="mt-auto flex justify-end pt-12">
                <button
                  onClick={handleNext}
                  className="btn-gold group"
                  style={{ backgroundImage: `linear-gradient(120deg, ${event.hexLight}, ${event.hex} 50%, ${event.hexDeep})` }}
                >
                  Continue
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </motion.div>
          ) : (
            <ReviewCard
              key="review"
              event={event}
              details={details}
              onGenerate={() => onSubmit(details)}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function ProgressVine({
  progress,
  accent,
  total,
  step,
}: {
  progress: number;
  accent: string;
  total: number;
  step: number;
}) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: total }).map((_, i) => {
        const filled = i < step;
        const active = i === step;
        return (
          <div key={i} className="flex items-center">
            <motion.div
              animate={{
                scale: active ? 1.3 : 1,
                backgroundColor: filled || active ? accent : 'rgba(247,241,230,0.2)',
              }}
              transition={{ duration: 0.4 }}
              className="h-2 w-2 rounded-full"
            />
            {i < total - 1 && (
              <div className="mx-1 h-px w-8 bg-ivory-300/15">
                <motion.div
                  className="h-px"
                  style={{ background: accent }}
                  animate={{ width: i < step ? '100%' : '0%' }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ReviewCard({
  event,
  details,
  onGenerate,
}: {
  event: EventConfig;
  details: InvitationDetails;
  onGenerate: () => void;
}) {
  const formatDateTime = (dt: string) => {
    try {
      const d = new Date(dt);
      return d.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return dt;
    }
  };

  const rows: { label: string; value: string; delay: number }[] = [
    { label: 'Venue', value: details.venue, delay: 0.2 },
    { label: 'Address', value: details.address, delay: 0.3 },
    { label: 'Date & Time', value: formatDateTime(details.eventDateTime), delay: 0.4 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-1 flex-col items-center"
    >
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-2 text-center font-display text-3xl text-ivory-50 sm:text-4xl"
      >
        Your invitation, previewed
      </motion.h2>
      <p className="mb-8 text-center font-serif text-ivory-300/70">
        Everything in its place. Ready to become a film.
      </p>

      {/* Invitation card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="ornate-border relative w-full max-w-md overflow-hidden bg-gradient-to-b from-ink-700/80 to-ink-900/90 px-8 py-10 text-center shadow-glow-lg"
        style={{ borderColor: `${event.hex}55` }}
      >
        <div
          className="pointer-events-none absolute -right-10 -top-10 opacity-10"
          style={{ color: event.hex }}
        >
          <Motif motif={event.motif} className="h-36 w-36" color={event.hex} />
        </div>
        <div
          className="pointer-events-none absolute -bottom-10 -left-10 rotate-180 opacity-10"
          style={{ color: event.hex }}
        >
          <Motif motif={event.motif} className="h-36 w-36" color={event.hex} />
        </div>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-sans text-xs uppercase tracking-[0.4em]"
          style={{ color: event.hexLight }}
        >
          {event.name} Ceremony
        </motion.p>

        <OrnateDivider className="my-6" color={event.hex} />

        <motion.h3
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="font-display text-4xl text-ivory-50 sm:text-5xl"
        >
          {details.brideName}
          <span className="mx-3 font-serif text-2xl italic text-gold-300">&</span>
          {details.groomName}
        </motion.h3>

        <div className="mt-6 space-y-3">
          {rows.map((r) => (
            <motion.div
              key={r.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: r.delay, duration: 0.5 }}
            >
              <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-ivory-300/50">
                {r.label}
              </p>
              <p className="font-serif text-base text-ivory-100">{r.value}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-10"
      >
        <button
          onClick={onGenerate}
          className="btn-gold animate-glowPulse group"
          style={{ backgroundImage: `linear-gradient(120deg, ${event.hexLight}, ${event.hex} 50%, ${event.hexDeep})` }}
        >
          <Check className="h-4 w-4" />
          Generate My Film
        </button>
      </motion.div>
    </motion.div>
  );
}
