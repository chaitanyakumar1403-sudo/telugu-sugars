import React, { useState } from 'react';
import { Play, ShoppingBag, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { GOING, STARTED, youtubeId, type Video } from '../../data/videos';

const today = () => new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD in local time

const fmt = (date: string, lang: string) =>
  new Date(date + 'T00:00').toLocaleDateString(lang === 'te' ? 'te-IN' : 'en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

const VideoCard: React.FC<{ v: Video; day?: number }> = ({ v, day }) => {
  const { language, t } = useLanguage();
  const [playing, setPlaying] = useState(false);
  const id = youtubeId(v.youtube);
  const title = language === 'te' && v.te ? v.te : v.title;
  const isToday = v.date === today();

  return (
    <article id={`video-${v.date}`} className="reveal group flex flex-col gap-4 scroll-mt-28">
      <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-(--bg-panel) shadow-xl transition-[box-shadow,border-color] duration-500 group-hover:border-amber-500/40 group-hover:shadow-amber-500/25">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <button onClick={() => setPlaying(true)} aria-label={`Play: ${title}`} className="absolute inset-0 h-full w-full">
            <img
              src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-amber-400 text-[#fff] shadow-2xl shadow-amber-500/40 transition-transform duration-500 ease-out group-hover:scale-125">
              <Play className="ml-1 h-6 w-6 fill-current" />
            </span>
            {isToday && (
              <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#fff]">
                <span className="live-dot h-1.5 w-1.5 rounded-full bg-[#fff]" /> {t('vid_today')}
              </span>
            )}
            {day && (
              <span className="absolute right-3 top-3 rounded-full bg-black/60 px-3 py-1 font-mono text-[11px] font-bold text-[#fff] backdrop-blur">
                {t('vid_day', { n: day })}
              </span>
            )}
          </button>
        )}
      </div>

      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-slate-500">{fmt(v.date, language)}</p>
        <h3 className="mt-1 text-lg font-bold leading-snug text-white transition-colors group-hover:text-amber-300">{title}</h3>
      </div>

      {v.links?.length ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">{t('vid_affiliate')}</span>
          {v.links.map((l) => (
            <a
              key={l.url}
              href={l.url}
              target="_blank"
              rel="sponsored nofollow noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 text-xs font-semibold text-amber-300 transition hover:-translate-y-0.5 hover:bg-amber-400/20"
            >
              <ShoppingBag className="h-3.5 w-3.5" /> {l.label}
            </a>
          ))}
        </div>
      ) : null}
    </article>
  );
};

/** Last 21 days as squares; filled days had a video. Clicking jumps to it. */
const Streak: React.FC = () => {
  const { language, t } = useLanguage();
  const posted = new Set(GOING.map((v) => v.date));
  const days = Array.from({ length: 21 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (20 - i));
    return d.toLocaleDateString('en-CA');
  });
  return (
    <div className="flex flex-wrap items-center gap-1.5" aria-label={t('vid_streak')}>
      {days.map((d) => {
        const on = posted.has(d);
        return (
          <button
            key={d}
            disabled={!on}
            title={on ? fmt(d, language) : `${fmt(d, language)} · ${t('vid_none')}`}
            aria-label={on ? t('vid_jump', { d: fmt(d, language) }) : `${fmt(d, language)}, ${t('vid_none')}`}
            onClick={() => document.getElementById(`video-${d}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
            className={`h-3.5 w-3.5 rounded-[4px] transition-transform ${
              on ? 'bg-amber-400 hover:scale-150' : 'bg-white/10'
            } ${d === today() ? 'ring-2 ring-amber-400/60 ring-offset-2 ring-offset-(--bg-obsidian)' : ''}`}
          />
        );
      })}
    </div>
  );
};

const Empty: React.FC<{ text: string }> = ({ text }) => (
  <div className="reveal notice flex items-center gap-4 px-6 py-6 sm:px-8">
    <Sparkles className="live-dot h-5 w-5 shrink-0 text-amber-500" />
    <p className="text-base text-slate-200 sm:text-lg">{text}</p>
  </div>
);

const Heading: React.FC<{ kicker: string; title: string; accent: string; children?: React.ReactNode }> = ({ kicker, title, accent, children }) => (
  <div className="reveal mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-amber-500">{kicker}</p>
      <h2 className="display-title mt-3 text-6xl text-white sm:text-8xl">
        {title} <span className="accent">{accent}</span>
      </h2>
    </div>
    {children}
  </div>
);

export const VideoSections: React.FC<{ limit?: number }> = ({ limit }) => {
  const { t } = useLanguage();
  const going = limit ? GOING.slice(0, limit) : GOING;
  return (
    <div className="flex flex-col gap-28">
      <section className="container" aria-label={`${t('ch1_title')} ${t('ch1_accent')}`}>
        <Heading kicker={t('ch1_kicker')} title={t('ch1_title')} accent={t('ch1_accent')} />
        {STARTED.length ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {STARTED.map((v) => <VideoCard key={v.youtube} v={v} />)}
          </div>
        ) : (
          <Empty text={t('ch1_empty')} />
        )}
      </section>

      <section className="container" aria-label={`${t('ch2_title')} ${t('ch2_accent')}`}>
        <Heading kicker={t('ch2_kicker')} title={t('ch2_title')} accent={t('ch2_accent')}>
          <div className="flex flex-col gap-3 sm:items-end">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300">
              <span className="live-dot h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_10px_#ff6a00]" />
              {GOING.length ? t('vid_count', { n: GOING.length }) : t('ch2_day1')}
            </span>
            <Streak />
          </div>
        </Heading>
        {going.length ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {going.map((v, i) => <VideoCard key={v.youtube} v={v} day={GOING.length - i} />)}
          </div>
        ) : (
          <Empty text={t('ch2_empty')} />
        )}
      </section>
    </div>
  );
};

export default VideoSections;
