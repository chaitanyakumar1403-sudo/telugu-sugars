import React, { useState } from 'react';
import { Mail, Check, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewsletterModal: React.FC<NewsletterModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
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
      className="fixed inset-0 z-50 bg-scrim/80 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={t('nl_aria')}
    >
      <div className="w-full max-w-lg bg-(--bg-panel) border border-amber-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white"
          aria-label={t('nl_close')}
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-white">{t('nl_done_t')}</h4>
            <p className="text-xs text-slate-300 max-w-sm">
              {t('nl_done_d')}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <p className="text-amber-400 text-sm font-semibold">{t('nl_kicker')}</p>

            <div>
              <h3 className="text-2xl font-extrabold text-white">
                {t('nl_title')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                {t('nl_lead')}
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="newsletter-email" className="text-xs font-bold text-slate-400">
                {t('nl_email')}
              </label>
              <div className="relative">
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.name@example.com"
                  className="w-full bg-scrim/60 border border-white/15 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none"
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
                {t('nl_consent')}
              </span>
            </label>

            <button
              type="submit"
              disabled={!email || !consentChecked}
              className="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-[#fff] font-bold text-sm transition-all"
            >
              {t('nl_submit')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default NewsletterModal;
