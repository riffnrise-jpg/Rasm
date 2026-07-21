import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Film, PenLine, Clapperboard } from 'lucide-react';
import OrnateDivider from '@/components/OrnateDivider';

interface HeroProps {
  onStart: () => void;
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const STEPS = [
  {
    icon: Clapperboard,
    title: 'Choose your ceremony',
    body: 'Haldi, Sangeet, Mehandi, Baraat or Reception — each with its own cinematic mood.',
  },
  {
    icon: PenLine,
    title: 'Add your details',
    body: 'Names, venue, address and date — woven into an elegant conversational flow.',
  },
  {
    icon: Film,
    title: 'Receive your film',
    body: 'A personalized invitation video, crafted frame by frame — ready to share.',
  },
];

export default function Hero({ onStart }: HeroProps) {
  return (
    <div className="relative">
      {/* HERO */}
      <section className="relative flex min-h-[100svh] flex-col items-center justify-center px-6 text-center">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mb-6 font-sans text-xs uppercase tracking-[0.4em] text-gold-300/80"
        >
          Rasm · रस्म
        </motion.p>

        <motion.h1
          variants={fadeUp}
          custom={1}
          initial="hidden"
          animate="show"
          className="max-w-4xl text-balance font-display text-5xl leading-[1.08] text-ivory-50 sm:text-6xl md:text-7xl"
        >
          Turn your wedding details into a
          <span className="block text-shimmer">cinematic invitation film</span>
          <span className="mt-2 block font-serif text-3xl italic text-gold-200/90 sm:text-4xl">
            in minutes.
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          custom={2}
          initial="hidden"
          animate="show"
          className="mt-8 max-w-xl text-balance font-serif text-lg leading-relaxed text-ivory-300/80 sm:text-xl"
        >
          Rasm weaves the names, the place, and the moment into a short film worthy of your
          celebration — a keepsake your guests will actually want to open.
        </motion.p>

        <motion.div
          variants={fadeUp}
          custom={3}
          initial="hidden"
          animate="show"
          className="mt-12"
        >
          <button onClick={onStart} className="btn-gold animate-glowPulse group">
            <Sparkles className="h-4 w-4" />
            Create Your Invitation
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
          <p className="mt-4 font-sans text-xs uppercase tracking-[0.3em] text-ivory-300/50">
            No sign-up · No accounts · Just magic
          </p>
        </motion.div>

        {/* scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2 text-gold-300/60">
            <span className="font-sans text-[10px] uppercase tracking-[0.3em]">How it works</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="h-8 w-px bg-gradient-to-b from-gold-300/60 to-transparent"
            />
          </div>
        </motion.div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative px-6 py-24 sm:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-5xl"
        >
          <OrnateDivider className="mb-10" />
          <h2 className="text-center font-display text-3xl text-ivory-50 sm:text-4xl">
            Three steps to your film
          </h2>
          <p className="mx-auto mt-4 max-w-md text-center font-serif text-ivory-300/70">
            No editing software, no templates to fill. Just the story of your day, told in motion.
          </p>

          <div className="mt-16 grid gap-10 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: i * 0.18, ease: [0.22, 1, 0.36, 1] }}
                className="group relative flex flex-col items-center text-center"
              >
                <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-gold-400/30 bg-ink-800/60 shadow-glow transition-all duration-500 group-hover:border-gold-300/60 group-hover:shadow-glow-lg">
                  <s.icon className="h-7 w-7 text-gold-300" strokeWidth={1.4} />
                  <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-gold-400 font-sans text-xs font-semibold text-ink-900">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-display text-xl text-ivory-50">{s.title}</h3>
                <p className="mt-3 max-w-xs font-serif text-ivory-300/70">{s.body}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 text-center"
          >
            <button onClick={onStart} className="btn-ghost group">
              Begin your invitation
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
