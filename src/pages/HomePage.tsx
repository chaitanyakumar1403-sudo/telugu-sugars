import React from 'react';
import {
  ArrowUpRight, Compass, Film, HandCoins, Leaf, Microscope, MessagesSquare, ScanLine, Search, UsersRound, UtensilsCrossed,
} from 'lucide-react';
import HomeHero from '../components/home/HomeHero';
import VideoSections from '../components/watch/VideoSections';
import ListenButton from '../components/common/ListenButton';
import FounderTeaser from '../components/home/FounderTeaser';
import { useLanguage } from '../context/LanguageContext';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

const FEATURES = [
  { path: '/atlas', key: 'nav_atlas', icon: Leaf, span: 'lg:col-span-7' },
  { path: '/watch', key: 'nav_watch', icon: Film, span: 'lg:col-span-5' },
  { path: '/research', key: 'nav_research', icon: Compass, span: 'lg:col-span-5', soon: true },
  { path: '/food-labels', key: 'nav_food_labels', icon: ScanLine, span: 'lg:col-span-7' },
];

const DOES = [
  { n: 1, icon: Search },
  { n: 2, icon: Microscope },
  { n: 3, icon: MessagesSquare },
  { n: 4, icon: UsersRound },
  { n: 5, icon: HandCoins },
  { n: 6, icon: UtensilsCrossed },
];

/** "What does Telugu Sugars do?" with read-aloud: Dheeraj's recording (public/audio/<lang>/what.mp3), else the device voice. */
const WhatWeDo: React.FC = () => {
  const { t } = useLanguage();
  const spoken = () => [`${t('what_title')} ${t('what_accent')}`, t('what_lead'), ...DOES.flatMap(({ n }) => [t(`do${n}_t`), t(`do${n}_d`)])].join('. ');

  return (
    <section className="container" aria-labelledby="what-we-do">
      <div className="reveal flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-5xl">
          <h2 id="what-we-do" className="display-title text-5xl text-white sm:text-7xl">
            {t('what_title')} <span className="accent">{t('what_accent')}</span>
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300 sm:text-xl">{t('what_lead')}</p>
        </div>
        <ListenButton rec="what" text={spoken} />
      </div>

      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DOES.map(({ n, icon: Icon }, i) => (
          <article
            key={n}
            onPointerMove={track}
            style={{ '--d': `${i * 70}ms` } as React.CSSProperties}
            className="reveal spotlight panel panel-hover group flex gap-4 p-6"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400 ring-1 ring-inset ring-amber-500/25 transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-110">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-sans text-lg font-bold leading-snug text-white">{t(`do${n}_t`)}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{t(`do${n}_d`)}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

// Feeds the cursor position to the .spotlight glow
const track = (e: React.PointerEvent<HTMLElement>) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`);
};

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { t } = useLanguage();

  return (
    <div className="flex w-full flex-col gap-28 pb-28">
      <HomeHero onNavigate={onNavigate} />

      <WhatWeDo />

      <section className="container" aria-label={t('home_features')}>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {FEATURES.map(({ path, key, icon: Icon, span, soon }, i) => (
            <button
              key={path}
              onClick={() => onNavigate(path)}
              onPointerMove={track}
              style={{ '--d': `${i * 90}ms` } as React.CSSProperties}
              className={`reveal spotlight panel panel-hover group flex min-h-56 flex-col justify-between overflow-hidden rounded-3xl p-7 text-left sm:min-h-72 sm:p-10 ${span}`}
            >
              <div className="flex items-start justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-400 transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-110">
                  <Icon className="h-6 w-6" />
                </span>
                {soon ? (
                  <span className="rounded-full border border-amber-400/30 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-amber-300">
                    {t('coming_soon')}
                  </span>
                ) : (
                  <ArrowUpRight className="h-7 w-7 text-slate-500 transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-amber-400" />
                )}
              </div>
              <div className="flex items-end justify-between gap-4">
                <h2 className="font-display text-4xl font-extrabold leading-[0.95] text-white sm:text-6xl">{t(key)}</h2>
                <span className="font-mono text-sm text-amber-500/70">0{i + 1}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <FounderTeaser onNavigate={onNavigate} />

      <VideoSections limit={6} />
    </div>
  );
};

export default HomePage;
