import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ArrowRight, Leaf } from 'lucide-react';
import portrait from '../../assets/portrait.webp';

interface HomeHeroProps {
  onNavigate: (path: string) => void;
}

const MarqueeRow: React.FC<{ outline?: boolean }> = ({ outline = false }) => (
  <div className={`hero-wordmark ${outline ? 'hero-wordmark--outline' : ''} text-[clamp(4.25rem,10.5vw,10rem)]`}>
    <div className={`marquee ${outline ? 'marquee--reverse' : ''}`}>
      {/* Two identical halves so the -50% loop is seamless */}
      {Array.from({ length: 8 }, (_, i) => (
        <span key={i} className="marquee__item">
          <span className="te">తెలుగు</span> SUGARS <span className="mx-[0.12em] inline-block h-[0.16em] w-[0.16em] rounded-full bg-amber-500 align-middle" />
        </span>
      ))}
    </div>
  </div>
);

export const HomeHero: React.FC<HomeHeroProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <section className="hero-stage relative isolate flex min-h-[calc(100svh-72px)] flex-col justify-end overflow-hidden border-b border-white/10">
      <h1 className="sr-only">Telugu Sugars — తెలుగు సుగర్స్</h1>

      {/* Running wordmark; hover or tap turns it orange */}
      <div
        data-testid="hero-wordmark"
        aria-hidden="true"
        className={`absolute inset-x-0 top-[10%] z-0 flex select-none flex-col gap-1 sm:top-[9%] ${isRevealed ? 'is-revealed' : ''}`}
        onMouseEnter={() => setIsRevealed(true)}
        onMouseLeave={() => setIsRevealed(false)}
        onClick={() => setIsRevealed((prev) => !prev)}
      >
        <MarqueeRow />
        <MarqueeRow outline />
      </div>

      {/* Portrait sits in front of the type; pointer events pass through to the wordmark */}
      <img
        src={portrait}
        alt=""
        fetchPriority="high"
        className="pointer-events-none absolute bottom-0 left-1/2 z-10 w-[min(1180px,210vw)] max-w-none -translate-x-[58%] sm:w-[min(1180px,120vw)]"
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[55%] bg-gradient-to-t from-(--bg-obsidian) via-(--bg-obsidian)/85 to-transparent" />

      <div className="pointer-events-none container relative z-30 flex flex-col items-center pb-12 pt-[52svh] text-center sm:pb-16">
        <p className="max-w-xl text-lg leading-relaxed text-slate-200 sm:text-xl">
          {t('hero_tagline')}
        </p>

        <div className="pointer-events-auto mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
          <button
            onClick={() => onNavigate('/atlas')}
            className="flex w-full items-center justify-center gap-2.5 rounded-full bg-amber-500 px-7 py-3.5 text-sm font-bold text-[#fff] transition hover:bg-amber-600 sm:w-auto"
          >
            <Leaf className="h-4 w-4" />
            <span>{t('nav_atlas')}</span>
          </button>
          <button
            onClick={() => onNavigate('/watch')}
            className="flex w-full items-center justify-center gap-2.5 rounded-full border border-white/15 bg-(--bg-obsidian)/60 px-7 py-3.5 text-sm font-semibold text-white transition hover:border-amber-400/50 hover:bg-white/10 sm:w-auto"
          >
            <span>{t('cta_explore')}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
