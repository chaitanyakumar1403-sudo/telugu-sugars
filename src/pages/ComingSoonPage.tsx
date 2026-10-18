import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const ComingSoonPage: React.FC<{ title: string }> = ({ title }) => {
  const { t } = useLanguage();
  return (
    <div className="hero-stage relative isolate overflow-hidden">
      <div className="container flex min-h-[72svh] flex-col items-center justify-center gap-8 text-center">
        <span className="reveal inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-1.5 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
          <span className="live-dot h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_10px_#ff6a00]" /> {t('coming_soon')}
        </span>
        <h1 className="reveal display-title text-7xl text-white sm:text-9xl" style={{ '--d': '120ms' } as React.CSSProperties}>
          {title}<span aria-hidden="true" className="text-amber-500">.</span>
        </h1>
        <div className="reveal notice flex max-w-xl items-center gap-3 px-6 py-4 text-left" style={{ '--d': '240ms' } as React.CSSProperties}>
          <span className="live-dot h-2 w-2 shrink-0 rounded-full bg-amber-500" />
          <p className="text-sm text-slate-300 sm:text-base">
            Studies, sources and the evidence behind every video, gathered in one place. We are building it now.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonPage;
