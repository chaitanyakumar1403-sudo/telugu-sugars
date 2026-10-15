import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const SEEN = 'telugusugars_greeted';

const greeting = (h: number) =>
  h < 12 ? { en: 'Good morning', te: 'శుభోదయం' } : h < 17 ? { en: 'Good afternoon', te: 'శుభ మధ్యాహ్నం' } : { en: 'Good evening', te: 'శుభ సాయంత్రం' };

const seen = () => { try { return sessionStorage.getItem(SEEN) === '1'; } catch { return false; } };

// Fixed pseudo-random layout so the falling cubes don't reshuffle on re-render
const CUBES = Array.from({ length: 18 }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  s: `${8 + ((i * 7) % 12)}px`,
  d: `${(i * 113) % 900}ms`,
  t: `${2.4 + ((i * 3) % 10) / 10}s`,
  r: `${(i % 2 ? 1 : -1) * (120 + i * 20)}deg`,
}));

/** Full-screen hello shown once per browser session; any click or key skips it. */
export const WelcomeGreeting: React.FC = () => {
  const { language } = useLanguage();
  const [phase, setPhase] = useState<'in' | 'out' | 'gone'>(() => (seen() ? 'gone' : 'in'));

  useEffect(() => {
    if (phase !== 'in') return;
    try { sessionStorage.setItem(SEEN, '1'); } catch { /* ignore */ }
    const close = () => setPhase('out');
    const timer = setTimeout(close, 2800);
    window.addEventListener('keydown', close);
    return () => { clearTimeout(timer); window.removeEventListener('keydown', close); };
  }, [phase]);

  if (phase === 'gone') return null;

  const g = greeting(new Date().getHours());
  const words = (language === 'te' ? g.te : g.en).split(' ');

  return (
    <div
      role="status"
      onClick={() => setPhase('out')}
      onAnimationEnd={(e) => e.target === e.currentTarget && phase === 'out' && setPhase('gone')}
      className={`hero-stage fixed inset-0 z-[100] flex cursor-pointer flex-col items-center justify-center overflow-hidden px-6 text-center ${phase === 'out' ? 'greet-out' : ''}`}
    >
      {CUBES.map((c, i) => (
        <span key={i} aria-hidden="true" className="sugar-cube top-0" style={{ left: c.left, '--s': c.s, '--d': c.d, '--t': c.t, '--r': c.r } as React.CSSProperties} />
      ))}
      <p className="greet-word font-telugu text-2xl text-amber-300 sm:text-3xl">నమస్కారం 🙏</p>
      <h2 className="mt-4 font-display text-6xl font-extrabold leading-[0.95] text-white sm:text-8xl">
        {words.map((w, i) => (
          <span key={i} className="greet-word mr-[0.25em]" style={{ '--d': `${250 + i * 140}ms` } as React.CSSProperties}>{w}</span>
        ))}
      </h2>
      <p className="greet-word mt-6 text-lg text-slate-300" style={{ '--d': '700ms' } as React.CSSProperties}>
        {language === 'te' ? 'తెలుగు సుగర్స్‌కి స్వాగతం' : 'Welcome to Telugu Sugars'}
      </p>
    </div>
  );
};

export default WelcomeGreeting;
