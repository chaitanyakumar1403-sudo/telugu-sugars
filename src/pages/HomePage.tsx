import React from 'react';
import { ArrowUpRight, Compass, Film, Leaf, ScanLine } from 'lucide-react';
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

// Points are lettered అ ఆ ఇ… in both languages, never 1 2 3 (house style)
const LETTERS = ['అ', 'ఆ', 'ఇ', 'ఈ', 'ఉ', 'ఊ'];
const DOES = [1, 2, 3, 4, 5, 6];

/** "What does Telugu Sugars do?" with read-aloud: Dheeraj's recording (public/audio/<lang>/what.mp3), else the device voice. */
const WhatWeDo: React.FC = () => {
  const { t } = useLanguage();
  const spoken = () => [`${t('what_title')} ${t('what_accent')}`, t('what_lead'), ...DOES.flatMap((n) => [t(`do${n}_t`), t(`do${n}_d`)])].join('. ');

  return (
    <section className="container" aria-labelledby="what-we-do">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-5xl">
          <h2 id="what-we-do" className="display-title text-[clamp(2.5rem,9vw,4.5rem)] text-white">
            {t('what_title')} <span className="accent">{t('what_accent')}</span>
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300 sm:text-xl">{t('what_lead')}</p>
        </div>
        <ListenButton rec="what" text={spoken} />
      </div>

      <ol className="mt-12 grid grid-cols-1 border-t border-white/10 sm:grid-cols-2 lg:grid-cols-3">
        {DOES.map((n, i) => (
          <li key={n} className="flex gap-4 border-b border-white/10 py-6 sm:pr-8">
            <span aria-hidden="true" className="w-8 shrink-0 font-telugu text-2xl font-bold leading-none text-amber-500">{LETTERS[i]}</span>
            <div>
              <h3 className="font-sans text-lg font-bold leading-snug text-white">{t(`do${n}_t`)}</h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-slate-400">{t(`do${n}_d`)}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
};

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { t } = useLanguage();

  return (
    <div className="flex w-full flex-col gap-24 pb-24">
      <HomeHero onNavigate={onNavigate} />

      <WhatWeDo />

      <section className="container" aria-label={t('home_features')}>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {FEATURES.map(({ path, key, icon: Icon, span, soon }) => (
            <button
              key={path}
              onClick={() => onNavigate(path)}
              className={`panel panel-hover group flex min-h-44 flex-col justify-between gap-8 rounded-2xl p-6 text-left sm:min-h-60 sm:p-9 ${span}`}
            >
              <div className="flex items-start justify-between">
                <Icon className="h-6 w-6 text-amber-500" />
                {soon ? (
                  <span className="rounded-full border border-white/15 px-3 py-1 text-xs font-semibold text-slate-400">
                    {t('coming_soon')}
                  </span>
                ) : (
                  <ArrowUpRight className="h-6 w-6 text-slate-500 transition-colors group-hover:text-amber-500" />
                )}
              </div>
              <h2 className="font-display text-[clamp(2rem,8vw,3.5rem)] font-extrabold leading-none text-white">{t(key)}</h2>
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
