import React, { useState } from 'react';
import { Mail, Check, X, Sparkles } from 'lucide-react';

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewsletterModal: React.FC<NewsletterModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !consentChecked) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Telugu Sugars Evidence Dispatch"
    >
      <div className="w-full max-w-lg bg-[#0e1117] border border-amber-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-white">Subscription Confirmed!</h4>
            <p className="text-xs text-slate-300 max-w-sm">
              Thank you for trusting Telugu Sugars. You will receive our monthly peer-reviewed clinical dossier with zero promotional noise.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Evidence Dispatch • ఉచిత సబ్‌స్క్రిప్షన్</span>
            </div>

            <div>
              <h3 className="text-2xl font-extrabold text-white">
                Stay Grounded in Metabolic Truth
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                Receive our monthly forensic breakdowns of supermarket food deceptions, clinical sweetener research, and Telugu dietary investigations.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="newsletter-email" className="text-xs font-bold text-slate-400">
                Email Address:
              </label>
              <div className="relative">
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.name@example.com"
                  className="w-full bg-black/60 border border-white/15 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute right-4 top-3.5" />
              </div>
            </div>

            {/* Explicit Consent Checkbox (PDF Section 5 & 8 requirement) */}
            <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
                className="mt-0.5 rounded border-white/20 text-amber-500 focus:ring-amber-400 accent-amber-500"
              />
              <span className="leading-snug">
                I explicitly consent to receiving monthly scientific updates. Telugu Sugars guarantees 1-click unsubscribe and promises never to collect sensitive personal medical records or sell subscriber data.
              </span>
            </label>

            <button
              type="submit"
              disabled={!email || !consentChecked}
              className="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-black font-bold text-sm shadow-lg shadow-amber-500/25 transition-all"
            >
              Confirm Free Subscription
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default NewsletterModal;
