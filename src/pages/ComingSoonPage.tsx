import React from 'react';
import { useLanguage } from '../context/LanguageContext';

// A section that isn't built yet: say so plainly and point to what already works.
export const ComingSoonPage: React.FC<{ title: string; onNavigate: (path: string) => void }> = ({ title, onNavigate }) => {
  const { t } = useLanguage();
  return (
    <div className="container py-16 sm:py-24">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold text-amber-400">{t('coming_soon')}</p>
        {/* Sized to the screen so long words (English "Research") never run off a phone */}
        <h1 className="mt-2 font-display text-[clamp(2.5rem,11vw,5.5rem)] font-extrabold leading-none text-white [overflow-wrap:anywhere]">
          {title}
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-slate-300">{t('soon_research')}</p>
        <p className="mt-10 text-base text-slate-400">{t('soon_meanwhile')}</p>
        <div className="mt-3 flex flex-wrap gap-3">
          <button onClick={() => onNavigate('/watch')} className="rounded-full bg-amber-500 px-5 py-3 text-sm font-bold text-[#fff] hover:bg-amber-600">
            {t('nav_watch')}
          </button>
          <button onClick={() => onNavigate('/atlas')} className="rounded-full border border-white/20 px-5 py-3 text-sm font-bold text-white hover:border-amber-400">
            {t('nav_atlas')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonPage;
