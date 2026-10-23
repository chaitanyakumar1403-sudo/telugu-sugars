import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { InstagramLink, InstagramIcon, INSTAGRAM_HANDLE } from '../components/common/InstagramLink';
import { sendToInbox } from '../lib/inbox';

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
    const ok = await sendToInbox(`New creator registration: ${data.name}`, data);
    setStatus(ok ? 'done' : 'error');
  };

  return (
    // .container is unlayered CSS and beats Tailwind's max-w-*, so the width cap lives on an inner wrapper
    <div className="container py-12 sm:py-20">
      <div className="mx-auto flex max-w-xl flex-col items-center text-center">
        <span className="text-sm font-semibold text-amber-400">{t('cr_kicker')}</span>
        <h1 className="display-title mt-2 text-[clamp(2rem,7vw,3.75rem)] text-white">
          {t('cr_title')}
        </h1>
        <p className="mt-5 text-base leading-relaxed text-slate-300 sm:text-lg">
          {t('cr_lead')}
        </p>

        <div className="panel mt-10 w-full p-6 text-left sm:p-8">
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
              {status === 'error' && (
                <p role="alert" className="text-sm text-red-400">
                  {t('cr_error')}{' '}
                  <InstagramLink className="font-semibold underline underline-offset-4 hover:text-red-300">@{INSTAGRAM_HANDLE}</InstagramLink>
                </p>
              )}
              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full rounded-xl bg-amber-400 py-3.5 text-sm font-bold text-[#fff] transition-all hover:bg-amber-300 disabled:opacity-50"
              >
                {status === 'sending' ? t('cr_sending') : t('cr_submit')}
              </button>
            </form>
          )}
        </div>

        <InstagramLink className="group mt-6 flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left transition-colors hover:border-amber-500/50">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-[#fff]">
            <InstagramIcon className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs text-slate-400">{t('cr_dm_t')}</span>
            <span className="block truncate text-sm font-semibold text-white">{t('cr_dm_d')} · @{INSTAGRAM_HANDLE}</span>
          </span>
          <span aria-hidden="true" className="text-amber-400">→</span>
        </InstagramLink>
      </div>
    </div>
  );
};

export default CreatorsPage;
