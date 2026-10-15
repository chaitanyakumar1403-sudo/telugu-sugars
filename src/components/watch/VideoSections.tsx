import React, { useState } from 'react';
import { Play, ShoppingBag, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { GOING, STARTED, youtubeId, type Video } from '../../data/videos';

const today = () => new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD in local time

const fmt = (date: string) =>
  new Date(date + 'T00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

const VideoCard: React.FC<{ v: Video; day?: number }> = ({ v, day }) => {
  const { language } = useLanguage();
  const [playing, setPlaying] = useState(false);
  const id = youtubeId(v.youtube);
  const title = language === 'te' && v.te ? v.te : v.title;
  const isToday = v.date === today();

  return (
    <article id={`video-${v.date}`} className="reveal group flex flex-col gap-4 scroll-mt-28">
      <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-(--bg-panel) shadow-xl transition-shadow duration-500 group-hover:shadow-amber-500/20">
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
            <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-amber-400 text-black shadow-2xl shadow-amber-500/40 transition-transform duration-500 ease-out group-hover:scale-125">
              <Play className="ml-1 h-6 w-6 fill-current" />
            </span>
            {isToday && (
              <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-rose-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#fff]">
                <span className="live-dot h-1.5 w-1.5 rounded-full bg-[#fff]" /> Today
              </span>
            )}
            {day && (
              <span className="absolute right-3 top-3 rounded-full bg-black/60 px-3 py-1 font-mono text-[11px] font-bold text-[#fff] backdrop-blur">
                Day {day}
              </span>
            )}
          </button>
        )}
      </div>

      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-slate-500">{fmt(v.date)}</p>
        <h3 className="mt-1 text-lg font-bold leading-snug text-white transition-colors group-hover:text-amber-300">{title}</h3>
      </div>

      {v.links?.length ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">Affiliate</span>
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
  const posted = new Set(GOING.map((v) => v.date));
  const days = Array.from({ length: 21 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (20 - i));
    return d.toLocaleDateString('en-CA');
  });
  return (
    <div className="flex flex-wrap items-center gap-1.5" aria-label="Last 21 days of videos">
      {days.map((d) => {
        const on = posted.has(d);
        return (
          <button
            key={d}
            disabled={!on}
            title={on ? fmt(d) : `${fmt(d)} · no video`}
            aria-label={on ? `Jump to video from ${fmt(d)}` : `${fmt(d)}, no video`}
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
  <div className="reveal flex items-center gap-4 rounded-3xl border border-dashed border-white/15 p-8 sm:p-12">
    <Sparkles className="live-dot h-6 w-6 shrink-0 text-amber-400" />
    <p className="text-lg text-slate-300">{text}</p>
  </div>
);

const Heading: React.FC<{ kicker: string; title: string; children?: React.ReactNode }> = ({ kicker, title, children }) => (
  <div className="reveal mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber-400">{kicker}</p>
      <h2 className="mt-2 font-display text-5xl font-extrabold leading-[0.95] text-white sm:text-7xl">{title}</h2>
    </div>
    {children}
  </div>
);

export const VideoSections: React.FC<{ limit?: number }> = ({ limit }) => {
  const going = limit ? GOING.slice(0, limit) : GOING;
  return (
    <div className="flex flex-col gap-28">
      <section className="container" aria-label="How it started">
        <Heading kicker="Chapter 01" title="How it started" />
        {STARTED.length ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {STARTED.map((v) => <VideoCard key={v.youtube} v={v} />)}
          </div>
        ) : (
          <Empty text="The first episodes are on their way." />
        )}
      </section>

      <section className="container" aria-label="How it's going">
        <Heading kicker="Chapter 02 · Updated daily" title="How it’s going">
          <div className="flex flex-col gap-3 sm:items-end">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300">
              <span className="live-dot h-2 w-2 rounded-full bg-rose-500" />
              {GOING.length ? `${GOING.length} days and counting` : 'Day 1 starts soon'}
            </span>
            <Streak />
          </div>
        </Heading>
        {going.length ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {going.map((v, i) => <VideoCard key={v.youtube} v={v} day={GOING.length - i} />)}
          </div>
        ) : (
          <Empty text="A new video lands here every day. Check back tomorrow." />
        )}
      </section>
    </div>
  );
};

export default VideoSections;
