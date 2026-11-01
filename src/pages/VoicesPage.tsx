import React, { useState } from 'react';
import { Check, Mic, RotateCcw, Send, Share2, Shuffle, Square } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import ListenButton from '../components/common/ListenButton';
import { InstagramLink, INSTAGRAM_HANDLE } from '../components/common/InstagramLink';
import { shareClip, useRecorder } from '../lib/useRecorder';
import { sendToInbox } from '../lib/inbox';

const LETTERS = ['అ', 'ఆ', 'ఇ', 'ఈ', 'ఉ'];
const QUESTIONS = 6;
const MAX = 90; // seconds per story

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

/** Record one food story on the phone; it is shared only when the person chooses to. */
const Recorder: React.FC = () => {
  const { t } = useLanguage();
  const r = useRecorder(MAX);
  const [sent, setSent] = useState<'shared' | 'downloaded' | null>(null);

  const share = async () => {
    if (!r.clip) return;
    const how = await shareClip(r.clip.blob, 'telugu-sugars-voice', t('iv_share_text'));
    if (how !== 'cancelled') setSent(how);
  };
  const again = () => { setSent(null); r.reset(); };

  if (r.state === 'unsupported' || r.state === 'denied') {
    return <p role="alert" className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-base leading-relaxed text-slate-200">{t(r.state === 'denied' ? 'iv_rec_denied' : 'iv_rec_unsupported')}</p>;
  }

  const on = r.state === 'rec';
  return (
    <div className="flex flex-col items-center gap-5 text-center">
      {r.state !== 'done' && (
        <>
          <button
            type="button"
            onClick={on ? r.stop : r.start}
            disabled={r.state === 'asking'}
            aria-pressed={on}
            aria-label={on ? t('iv_rec_stop') : t('iv_rec_start')}
            className="relative grid h-28 w-28 place-items-center rounded-full bg-amber-500 text-[#fff] transition hover:bg-amber-600 disabled:opacity-60"
          >
            {/* The ring breathes with the speaker's voice */}
            <span aria-hidden="true" className="absolute inset-0 rounded-full border-4 border-amber-500/40" style={{ transform: `scale(${1 + (on ? r.level * 0.45 : 0)})`, transition: 'transform 80ms linear' }} />
            {on ? <Square className="h-9 w-9 fill-current" /> : <Mic className="h-10 w-10" />}
          </button>
          <p className="text-lg font-semibold text-white" aria-live="polite">
            {r.state === 'asking' ? t('iv_rec_asking') : on ? t('iv_rec_on', { s: `${mmss(r.secs)} / ${mmss(MAX)}` }) : t('iv_rec_start')}
          </p>
          {on && (
            <span aria-hidden="true" className="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-white/10">
              <span className="block h-full rounded-full bg-amber-500" style={{ width: `${(r.secs / MAX) * 100}%` }} />
            </span>
          )}
        </>
      )}
      {r.state === 'done' && r.clip && (
        <div className="flex w-full flex-col items-center gap-4">
          <p className="text-base text-slate-200">{t('iv_rec_done')}</p>
          <audio controls src={r.clip.url} className="w-full max-w-sm" />
          {sent ? (
            <p role="status" className="flex items-start gap-2 text-left text-base text-slate-200"><Check className="mt-1 h-5 w-5 shrink-0 text-teal-400" />{t(sent === 'shared' ? 'iv_rec_shared' : 'iv_rec_saved')}</p>
          ) : null}
          <div className="flex flex-wrap justify-center gap-3">
            <button type="button" onClick={share} className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-base font-bold text-[#fff] hover:bg-amber-600"><Share2 className="h-5 w-5" />{t('iv_rec_share')}</button>
            <button type="button" onClick={again} className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-base font-bold text-white hover:border-amber-400"><RotateCcw className="h-5 w-5" />{t('iv_rec_again')}</button>
          </div>
        </div>
      )}
      <p className="max-w-sm text-sm text-slate-400">{t('iv_rec_private')}</p>
    </div>
  );
};

/** For people who can't or would rather not speak: type the story (or have someone at home type it). */
const WriteForm: React.FC = () => {
  const { t } = useLanguage();
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    if (data._honey) return;
    setStatus('sending');
    const ok = await sendToInbox(`Inclusive Voices story from ${data.place || 'somewhere'}`, data);
    setStatus(ok ? 'done' : 'error');
  };
  if (status === 'done') return <p role="status" className="flex items-start gap-2 text-base text-slate-200"><Check className="mt-1 h-5 w-5 shrink-0 text-teal-400" />{t('iv_w_done')}</p>;
  const field = 'w-full rounded-xl border border-white/15 bg-scrim/60 px-4 py-3 text-base text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none';
  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-300">{t('iv_w_name')}<input name="name" maxLength={80} autoComplete="name" className={field} /></label>
      <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-300">{t('iv_w_place')}<input name="place" required maxLength={80} className={field} /></label>
      <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-300">{t('iv_w_story')}<textarea name="story" required rows={6} maxLength={3000} className={field} /></label>
      <input type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <label className="flex items-start gap-3 text-sm text-slate-300"><input type="checkbox" name="consent" value="yes" required className="mt-1 h-5 w-5 accent-amber-500" />{t('iv_w_ok')}</label>
      {status === 'error' && <p role="alert" className="text-sm text-red-400">{t('iv_w_error')}</p>}
      <button type="submit" disabled={status === 'sending'} className="inline-flex w-fit items-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-base font-bold text-[#fff] hover:bg-amber-600 disabled:opacity-60"><Send className="h-5 w-5" />{status === 'sending' ? t('cr_sending') : t('iv_w_send')}</button>
    </form>
  );
};

/**
 * Inclusive Voices: an open stage for the Telugu voices that are usually left out (elders, villages, every dialect,
 * signing and disabled creators, first-timers). Record one food story on the phone, or write it.
 */
export const VoicesPage: React.FC = () => {
  const { t } = useLanguage();
  const [q, setQ] = useState(() => Math.floor(Math.random() * QUESTIONS) + 1);
  const question = t(`iv_q${q}`);

  return (
    <div className="container flex flex-col gap-16 py-12 pb-24 sm:py-16">
      <header className="max-w-3xl">
        <p className="text-sm font-semibold text-amber-400">{t('iv_k')}</p>
        <h1 className="display-title mt-2 text-[clamp(2.5rem,8vw,5rem)] text-white">{t('iv_title')}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-300 sm:text-xl">{t('iv_lead')}</p>
        <div className="mt-6"><ListenButton text={t('iv_listen')} /></div>
      </header>

      <section aria-labelledby="iv-who">
        <h2 id="iv-who" className="text-sm font-semibold text-amber-400">{t('iv_who_k')}</h2>
        <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {LETTERS.map((l, i) => (
            <li key={l} className="panel flex gap-3 p-5 lg:flex-col">
              <span aria-hidden="true" className="font-telugu text-2xl font-bold leading-none text-amber-500">{l}</span>
              <div>
                <h3 className="text-lg font-bold leading-snug text-white">{t(`iv_who${i + 1}_t`)}</h3>
                <p className="mt-1 text-[15px] leading-relaxed text-slate-400">{t(`iv_who${i + 1}_d`)}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2" aria-labelledby="iv-rec">
        <div className="panel flex flex-col gap-8 p-6 sm:p-8">
          <div>
            <h2 id="iv-rec" className="text-2xl font-bold text-white">{t('iv_rec_k')}</h2>
            <p className="mt-2 text-base text-slate-400">{t('iv_rec_hint')}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm font-semibold text-slate-400">{t('iv_q_k')}</p>
            <p className="mt-2 text-xl font-bold leading-snug text-white" aria-live="polite">{question}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={() => setQ((n) => (n % QUESTIONS) + 1)} className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-bold text-white hover:border-amber-400"><Shuffle className="h-4 w-4" />{t('iv_q_next')}</button>
              <ListenButton text={question} className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-bold text-white hover:border-amber-400" />
            </div>
          </div>
          <Recorder />
        </div>

        <div className="panel flex flex-col gap-5 p-6 sm:p-8">
          <div>
            <h2 className="text-2xl font-bold text-white">{t('iv_write_k')}</h2>
            <p className="mt-2 text-base text-slate-400">{t('iv_write_d')}</p>
          </div>
          <WriteForm />
        </div>
      </section>

      <section aria-labelledby="iv-promise" className="max-w-3xl">
        <h2 id="iv-promise" className="text-2xl font-bold text-white">{t('iv_promise_k')}</h2>
        <ol className="mt-4 border-t border-white/10">
          {[1, 2, 3, 4].map((n, i) => (
            <li key={n} className="flex gap-4 border-b border-white/10 py-4 text-lg leading-snug text-slate-200">
              <span aria-hidden="true" className="w-6 shrink-0 font-telugu font-bold text-amber-500">{LETTERS[i]}</span>{t(`iv_p${n}`)}
            </li>
          ))}
        </ol>
        <p className="mt-8 text-lg text-slate-300">
          {t('iv_first')} <InstagramLink className="font-semibold text-amber-400 underline underline-offset-4">@{INSTAGRAM_HANDLE}</InstagramLink>
        </p>
      </section>
    </div>
  );
};

export default VoicesPage;
