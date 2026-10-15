import React from 'react';
import { ArrowUpRight, Compass, Film, Leaf, ScanLine } from 'lucide-react';
import HomeHero from '../components/home/HomeHero';
import VideoSections from '../components/watch/VideoSections';
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

      <section className="container" aria-label="Features">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {FEATURES.map(({ path, key, icon: Icon, span, soon }, i) => (
            <button
              key={path}
              onClick={() => onNavigate(path)}
              onPointerMove={track}
              style={{ '--d': `${i * 90}ms` } as React.CSSProperties}
              className={`reveal spotlight group flex min-h-56 flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-(--bg-panel) p-7 text-left transition-[border-color,translate] duration-500 hover:-translate-y-1 hover:border-amber-400/40 sm:min-h-72 sm:p-10 ${span}`}
            >
              <div className="flex items-start justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-400 transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-110">
                  <Icon className="h-6 w-6" />
                </span>
                {soon ? (
                  <span className="rounded-full border border-amber-400/30 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-amber-300">
                    Coming soon
                  </span>
                ) : (
                  <ArrowUpRight className="h-7 w-7 text-slate-500 transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-amber-400" />
                )}
              </div>
              <div className="flex items-end justify-between gap-4">
                <h2 className="font-display text-4xl font-extrabold leading-[0.95] text-white sm:text-6xl">{t(key)}</h2>
                <span className="font-mono text-sm text-slate-500">0{i + 1}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <VideoSections limit={6} />
    </div>
  );
};

export default HomePage;
