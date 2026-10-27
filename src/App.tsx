import { useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import ParticleBackground from '@/components/ParticleBackground';
import Hero from '@/screens/Hero';
import EventSelection from '@/screens/EventSelection';
import DetailIntake from '@/screens/DetailIntake';
import TemplateMarketplace from '@/screens/TemplateMarketplace';
import TemplateEditor from '@/screens/TemplateEditor';
import { EVENTS, type EventKey, type InvitationDetails, type Screen } from '@/data/events';

const screenTransition = { initial: { opacity: 0, y: 20, filter: 'blur(6px)' }, animate: { opacity: 1, y: 0, filter: 'blur(0px)' }, exit: { opacity: 0, y: -20, filter: 'blur(6px)' }, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } };

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [eventKey, setEventKey] = useState<EventKey | null>(null);
  const [details, setDetails] = useState<InvitationDetails | null>(null);
  const [templateSlug, setTemplateSlug] = useState<string | null>(null);
  const event = eventKey ? EVENTS[eventKey] : null;
  const selectEvent = useCallback((key: EventKey) => { setEventKey(key); setDetails(null); setScreen('details'); }, []);
  const submitDetails = useCallback((value: InvitationDetails) => { setDetails(value); setScreen('templates'); }, []);
  const reset = useCallback(() => { setTemplateSlug(null); setDetails(null); setEventKey(null); setScreen('events'); }, []);

  return <div className="relative min-h-[100svh] overflow-x-hidden"><ParticleBackground density={20} /><BrandMark onClick={() => setScreen('landing')} visible={screen !== 'landing'} /><main className="relative z-10"><AnimatePresence mode="wait">
    {screen === 'landing' && <motion.div key="landing" {...screenTransition}><Hero onStart={() => setScreen('events')} /></motion.div>}
    {screen === 'events' && <motion.div key="events" {...screenTransition}><EventSelection onSelect={selectEvent} onBack={() => setScreen('landing')} /></motion.div>}
    {screen === 'details' && event && <motion.div key="details" {...screenTransition}><DetailIntake event={event} onSubmit={submitDetails} onBack={() => { setEventKey(null); setScreen('events'); }} /></motion.div>}
    {screen === 'templates' && details && <motion.div key="templates" {...screenTransition}><TemplateMarketplace details={details} onSelect={(slug) => { setTemplateSlug(slug); setScreen('editor'); }} onBack={() => setScreen('details')} /></motion.div>}
    {screen === 'editor' && details && templateSlug && <motion.div key="editor" {...screenTransition}><TemplateEditor slug={templateSlug} details={details} onBack={() => setScreen('templates')} onEditAnother={reset} /></motion.div>}
  </AnimatePresence></main><Footer /></div>;
}

function BrandMark({ onClick, visible }: { onClick: () => void; visible: boolean }) { return <AnimatePresence>{visible && <motion.button initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }} onClick={onClick} className="fixed left-6 top-6 z-20 flex items-center gap-2"><Sparkles className="h-4 w-4 text-gold-300" /><span className="font-display text-lg tracking-wide text-ivory-50">Rasm</span></motion.button>}</AnimatePresence>; }
function Footer() { return <footer className="relative z-10 px-6 py-8 text-center"><p className="font-sans text-xs text-ivory-300/40">Rasm — cinematic wedding invitation films · crafted with light</p></footer>; }
