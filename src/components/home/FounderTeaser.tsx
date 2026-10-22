import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import portrait from '../../assets/portrait.webp';
import cloth from '../../assets/founder/cloth.svg';

/** "Meet the founder": a slice of the founder's table (ikat cloth, tilted polaroid) that opens /founder. */
export const FounderTeaser: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { t } = useLanguage();
  return (
    <section className="container" aria-labelledby="founder-teaser">
      <button
        type="button"
        onClick={() => onNavigate('/founder')}
        className="reveal group relative grid w-full overflow-hidden rounded-3xl text-left shadow-2xl shadow-black/30 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]"
        style={{ backgroundImage: `url("${cloth}")`, backgroundSize: '120px 120px' }}
      >
        <div className="panel relative z-10 m-5 self-center p-7 sm:m-10 sm:p-9" style={{ background: 'var(--bg-panel)' }}>
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-500">{t('home_fd_kicker')}</p>
          <h2 id="founder-teaser" className="display-title mt-3 text-4xl text-white sm:text-5xl">
            {t('home_fd_title')} <span className="accent">{t('home_fd_accent')}</span>
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-slate-300">{t('home_fd_body')}</p>
          <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-sm font-bold text-[#fff] shadow-lg shadow-amber-500/30 transition group-hover:-translate-y-0.5">
            {t('home_fd_cta')} <ArrowRight className="h-4 w-4" />
          </span>
        </div>
        <div aria-hidden="true" className="relative min-h-72 lg:min-h-96">
          <div className="absolute left-1/2 top-1/2 w-[min(78%,420px)] -translate-x-1/2 -translate-y-1/2 -rotate-6 bg-white p-[3%] pb-[11%] shadow-2xl shadow-black/40 transition-transform duration-700 group-hover:rotate-0 group-hover:scale-105">
            <img src={portrait} alt="" loading="lazy" className="aspect-[3/2] w-full object-cover object-[55%_28%]" />
            <span className="absolute inset-x-0 bottom-[2%] text-center text-lg font-bold text-amber-700" style={{ fontFamily: '"Caveat", "Gurajada", cursive' }}>
              {t('home_fd_psst')}
            </span>
          </div>
        </div>
      </button>
    </section>
  );
};

export default FounderTeaser;
