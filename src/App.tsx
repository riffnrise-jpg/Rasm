import { useCallback, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import ParticleBackground from '@/components/ParticleBackground';
import Hero from '@/screens/Hero';
import EventSelection from '@/screens/EventSelection';
import DetailIntake from '@/screens/DetailIntake';
import Generating from '@/screens/Generating';
import Result, { type ResultState } from '@/screens/Result';
import { EVENTS, type EventKey, type InvitationDetails, type Screen } from '@/data/events';
import { generateFilm } from '@/lib/api';

const screenTransition = {
  initial: { opacity: 0, y: 20, filter: 'blur(6px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -20, filter: 'blur(6px)' },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [eventKey, setEventKey] = useState<EventKey | null>(null);
  const [details, setDetails] = useState<InvitationDetails | null>(null);
  const [result, setResult] = useState<ResultState | null>(null);
  const lastDetails = useRef<InvitationDetails | null>(null);

  const event = eventKey ? EVENTS[eventKey] : null;

  const goEvents = useCallback(() => setScreen('events'), []);

  const selectEvent = useCallback((key: EventKey) => {
    setEventKey(key);
    setDetails(null);
    setResult(null);
    setScreen('details');
  }, []);

  const goBackToEvents = useCallback(() => {
    setEventKey(null);
    setScreen('events');
  }, []);

  const submitDetails = useCallback(
    async (d: InvitationDetails) => {
      setDetails(d);
      lastDetails.current = d;
      setResult(null);
      setScreen('generating');
      try {
        const out = await generateFilm(eventKey!, d);
        if ('videoUrl' in out) {
          setResult({ status: 'success', videoUrl: out.videoUrl });
        } else {
          const blob = base64ToBlob(out.videoBase64, out.mimeType);
          setResult({ status: 'success', videoUrl: URL.createObjectURL(blob) });
        }
        setScreen('result');
      } catch (err) {
        setResult({
          status: 'error',
          message: err instanceof Error ? err.message : 'Unknown error',
        });
        setScreen('result');
      }
    },
    [eventKey],
  );

  const retry = useCallback(() => {
    if (lastDetails.current && eventKey) {
      void submitDetails(lastDetails.current);
    }
  }, [eventKey, submitDetails]);

  const reset = useCallback(() => {
    setDetails(null);
    setResult(null);
    setEventKey(null);
    setScreen('events');
  }, []);

  return (
    <div className="relative min-h-[100svh] overflow-x-hidden">
      <ParticleBackground density={20} />

      {/* Brand mark */}
      <BrandMark onClick={() => setScreen('landing')} visible={screen !== 'landing'} />

      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {screen === 'landing' && (
            <motion.div key="landing" {...screenTransition}>
              <Hero onStart={goEvents} />
            </motion.div>
          )}

          {screen === 'events' && (
            <motion.div key="events" {...screenTransition}>
              <EventSelection onSelect={selectEvent} onBack={() => setScreen('landing')} />
            </motion.div>
          )}

          {screen === 'details' && event && (
            <motion.div key="details" {...screenTransition}>
              <DetailIntake event={event} onSubmit={submitDetails} onBack={goBackToEvents} />
            </motion.div>
          )}

          {screen === 'generating' && event && (
            <motion.div key="generating" {...screenTransition}>
              <Generating event={event} />
            </motion.div>
          )}

          {screen === 'result' && event && result && (
            <motion.div key="result" {...screenTransition}>
              <Result event={event} result={result} onRetry={retry} onReset={reset} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}

function BrandMark({ onClick, visible }: { onClick: () => void; visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          onClick={onClick}
          className="fixed left-6 top-6 z-20 flex items-center gap-2"
        >
          <Sparkles className="h-4 w-4 text-gold-300" />
          <span className="font-display text-lg tracking-wide text-ivory-50">Rasm</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

function Footer() {
  return (
    <footer className="relative z-10 px-6 py-8 text-center">
      <p className="font-sans text-xs text-ivory-300/40">
        Rasm — cinematic wedding invitation films · crafted with light
      </p>
    </footer>
  );
}

function base64ToBlob(b64: string, mimeType: string): Blob {
  const byteChars = atob(b64);
  const byteNumbers = new Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) {
    byteNumbers[i] = byteChars.charCodeAt(i);
  }
  return new Blob([new Uint8Array(byteNumbers)], { type: mimeType });
}
