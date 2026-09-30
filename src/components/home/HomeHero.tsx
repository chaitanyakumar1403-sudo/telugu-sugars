import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import AmbientCanvas from './AmbientCanvas';
import { ArrowRight, Compass, ShieldCheck } from 'lucide-react';

interface HomeHeroProps {
  onNavigate: (path: string) => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({ onNavigate }) => {
  const { language, t } = useLanguage();
  const [isRevealed, setIsRevealed] = useState(false);

  const wordmarkText = language === 'te' ? 'తెలుగు సుగర్స్' : 'TELUGU SUGARS';

  return (
    <section className="relative min-h-[82vh] flex flex-col justify-center items-center text-center px-4 overflow-hidden border-b border-white/10 bg-radial-gradient">
      {/* Background Ambient Particle Flow */}
      <AmbientCanvas />

      {/* Decorative luxury radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-amber-500/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        {/* Verification Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold tracking-wider text-amber-300/90 mb-6 backdrop-blur-sm shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
          <span>INDEPENDENT EVIDENCE-FIRST JOURNALISM</span>
        </div>

        {/* Inside-IMAX Signature Monumental Wordmark */}
        <h1
          data-testid="hero-wordmark"
          data-text={wordmarkText}
          className={`hero-wordmark text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black mb-6 select-none ${
            isRevealed ? 'is-revealed' : ''
          }`}
          onMouseEnter={() => setIsRevealed(true)}
          onMouseLeave={() => setIsRevealed(false)}
          onClick={() => setIsRevealed((prev) => !prev)}
          tabIndex={0}
          onFocus={() => setIsRevealed(true)}
          onBlur={() => setIsRevealed(false)}
          role="button"
          aria-label={`${wordmarkText} - Hover or tap to reveal signature sugar crystal texture`}
        >
          {wordmarkText}
        </h1>

        {/* Core Publication Statement */}
        <p className="text-lg sm:text-xl md:text-2xl text-slate-300 max-w-2xl font-light leading-relaxed mb-10">
          {t('hero_tagline')}
        </p>

        {/* Primary and Secondary Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 w-full sm:w-auto">
          <button
            onClick={() => onNavigate('/watch')}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-base font-bold bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black shadow-lg shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>{t('cta_explore')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigate('/research')}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-base font-bold bg-white/5 hover:bg-white/10 text-white border border-white/15 hover:border-amber-400/40 transition-all backdrop-blur-sm"
          >
            <Compass className="w-4 h-4 text-amber-400" />
            <span>{t('cta_browse_evidence')}</span>
          </button>
        </div>

        {/* Subtle Trust Indicators */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400" /> Peer-Reviewed Citations Only
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Human Editorial Verification
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" /> Zero Food Brand Sponsorships
          </span>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
