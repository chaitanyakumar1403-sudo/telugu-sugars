import React, { useState } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

// FormSubmit relays each submission to this inbox; no backend needed.
// The first ever submission sends a one-time activation email that must be confirmed.
const ENDPOINT = 'https://formsubmit.co/ajax/telugusugars@gmail.com';

const FIELDS = [
  { name: 'name', label: 'cr_name', type: 'text', autoComplete: 'name' },
  { name: 'phone', label: 'cr_phone', type: 'tel', autoComplete: 'tel', pattern: '[0-9+ \\-]{7,15}' },
  { name: 'instagram', label: 'cr_insta', type: 'text', autoComplete: 'off' },
  { name: 'address', label: 'cr_address', type: 'text', autoComplete: 'street-address' },
] as const;

export const CreatorsPage: React.FC = () => {
  const { t } = useLanguage();
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    if (data._honey) return; // bot filled the hidden field
    setStatus('sending');
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...data, _subject: `New creator registration: ${data.name}`, _template: 'table' }),
      });
      const json = await res.json().catch(() => ({}));
      setStatus(res.ok && String(json.success) === 'true' ? 'done' : 'error');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="container max-w-2xl py-12 sm:py-16">
      <span className="reveal inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-500">
        <Sparkles className="h-4 w-4" /> {t('cr_kicker')}
      </span>
      <h1 className="reveal display-title mt-4 text-[clamp(2rem,9vw,5rem)] text-white" style={{ '--d': '80ms' } as React.CSSProperties}>
        {t('cr_title')}
      </h1>
      <p className="reveal mt-6 text-lg leading-relaxed text-slate-300" style={{ '--d': '160ms' } as React.CSSProperties}>
        {t('cr_lead')}
      </p>

      <div className="reveal panel mt-10 p-6 sm:p-8" style={{ '--d': '220ms' } as React.CSSProperties}>
        {status === 'done' ? (
          <div role="status" className="flex flex-col items-center gap-3 py-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-500/20 text-teal-400">
              <Check className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-white">{t('cr_done_t')}</h2>
            <p className="max-w-sm text-sm text-slate-300">{t('cr_done_d')}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {FIELDS.map((f) => (
              <div key={f.name} className="flex flex-col gap-1.5">
                <label htmlFor={`cr-${f.name}`} className="text-xs font-bold text-slate-400">{t(f.label)}</label>
                <input
                  id={`cr-${f.name}`}
                  name={f.name}
                  type={f.type}
                  required
                  maxLength={200}
                  autoComplete={f.autoComplete}
                  pattern={'pattern' in f ? f.pattern : undefined}
                  className="w-full rounded-xl border border-white/15 bg-scrim/60 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                />
              </div>
            ))}
            <input type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
            {status === 'error' && <p role="alert" className="text-sm text-red-400">{t('cr_error')}</p>}
            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full rounded-xl bg-amber-400 py-3.5 text-sm font-bold text-[#fff] shadow-lg shadow-amber-500/25 transition-all hover:bg-amber-300 disabled:opacity-50"
            >
              {status === 'sending' ? t('cr_sending') : t('cr_submit')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreatorsPage;
