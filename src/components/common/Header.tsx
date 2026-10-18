import React, { useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import LanguageToggle from './LanguageToggle';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  activePath: string;
  onNavigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activePath, onNavigate }) => {
  const { t } = useLanguage();
  const bar = useRef<HTMLDivElement>(null);

  // Orange reading-progress line along the top edge
  useEffect(() => {
    const on = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.current?.style.setProperty('--p', String(max > 0 ? scrollY / max : 0));
    };
    on();
    addEventListener('scroll', on, { passive: true });
    addEventListener('resize', on);
    return () => { removeEventListener('scroll', on); removeEventListener('resize', on); };
  }, [activePath]);

  const navItems = [
    { path: '/atlas', labelKey: 'nav_atlas' },
    { path: '/watch', labelKey: 'nav_watch' },
    { path: '/research', labelKey: 'nav_research' },
    { path: '/food-labels', labelKey: 'nav_food_labels' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-(--bg-obsidian)/80 backdrop-blur-xl">
      <div ref={bar} className="scroll-progress" aria-hidden="true" />
      <div className="container flex h-18 items-center justify-between gap-2 sm:gap-4">
        {/* Brand Wordmark */}
        <button
          onClick={() => onNavigate('/')}
          className="flex min-w-0 items-center gap-2.5 text-left sm:gap-3"
          aria-label="Telugu Sugars Home"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 font-display text-base font-extrabold text-[#fff] shadow-lg shadow-amber-500/30">
            TS
          </div>
          <div className="flex flex-col leading-tight">
            <span className="whitespace-nowrap font-display text-sm font-extrabold tracking-tight text-white sm:text-base">TELUGU SUGARS</span>
            <span className="font-telugu text-xs font-medium text-amber-400">తెలుగు సుగర్స్</span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main Navigation">
          {navItems.map((item) => {
            const isActive = activePath === item.path || activePath.startsWith(item.path + '/');
            return (
              <button
                key={item.path}
                onClick={() => onNavigate(item.path)}
                aria-current={isActive ? 'page' : undefined}
                className={`rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-amber-500 text-[#fff] shadow-lg shadow-amber-500/30'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {t(item.labelKey)}
              </button>
            );
          })}
        </nav>

        {/* Action Controls: Search & Language Switcher */}
        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
