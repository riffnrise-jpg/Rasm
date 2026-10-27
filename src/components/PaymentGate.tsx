import { useState } from 'react';
import { Check, Loader2, X } from 'lucide-react';

export const PAYMENT_MODE: 'mock' | 'razorpay' = 'mock';

interface Props { name: string; price: number; onSuccess: () => void; onClose: () => void; }
interface RazorpayInstance { open: () => void; }
interface RazorpayConstructor { new (options: Record<string, unknown>): RazorpayInstance; }
function loadRazorpay() {
  return new Promise<RazorpayConstructor | undefined>((resolve) => { const existing = (window as unknown as { Razorpay?: RazorpayConstructor }).Razorpay; if (existing) { resolve(existing); return; } const script = document.createElement('script'); script.src = 'https://checkout.razorpay.com/v1/checkout.js'; script.onload = () => resolve((window as unknown as { Razorpay?: RazorpayConstructor }).Razorpay); script.onerror = () => resolve(undefined); document.body.appendChild(script); });
}
export default function PaymentGate({ name, price, onSuccess, onClose }: Props) {
  const [status, setStatus] = useState<'payment' | 'paying' | 'success'>('payment');
  const pay = async () => { setStatus('paying'); if (PAYMENT_MODE === 'mock') window.setTimeout(() => { setStatus('success'); onSuccess(); }, 1200); else { const key = import.meta.env.VITE_RAZORPAY_KEY; const Razorpay = await loadRazorpay(); if (!key || !Razorpay) { setStatus('payment'); return; } new Razorpay({ key, amount: price * 100, currency: 'INR', name: 'Rasm', description: name, handler: onSuccess }).open(); } };
  return <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-5 backdrop-blur-sm"><div className="ornate-border relative w-full max-w-md bg-ink-800 p-7 shadow-glow-lg"><button onClick={onClose} className="absolute right-4 top-4 text-ivory-300/60" aria-label="Close"><X className="h-5 w-5" /></button>{status === 'success' ? <div className="py-8 text-center"><Check className="mx-auto h-10 w-10 text-gold-300" /><h2 className="mt-4 font-display text-3xl text-ivory-50">Payment confirmed</h2><p className="mt-2 font-serif text-ivory-300/70">Your invitation is ready to render.</p></div> : <><p className="font-sans text-xs uppercase tracking-[.3em] text-gold-300/70">Order summary</p><h2 className="mt-3 font-display text-3xl text-ivory-50">{name}</h2><div className="mt-6 space-y-3 border-y border-ivory-100/10 py-5 font-sans text-sm text-ivory-300/70"><div className="flex justify-between"><span>Full HD 1080x1920 MP4</span><strong className="text-ivory-50">No watermark</strong></div><div className="flex justify-between"><span>Total</span><strong className="text-gold-200">₹{price}</strong></div></div>{PAYMENT_MODE === 'mock' && <p className="mt-5 text-center font-sans text-xs uppercase tracking-[.25em] text-gold-300">Test mode</p>}<button disabled={status === 'paying'} onClick={pay} className="btn-gold mt-6 w-full">{status === 'paying' ? <><Loader2 className="h-4 w-4 animate-spin" /> Processing</> : 'Simulate payment'}</button></>}</div></div>;
}
