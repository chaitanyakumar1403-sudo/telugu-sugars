import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import LanguageToggle from './LanguageToggle';
import { Search } from 'lucide-react';

interface HeaderProps {
  activePath: string;
  onNavigate: (path: string) => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activePath, onNavigate, onOpenSearch }) => {
  const { t } = useLanguage();

  const navItems = [
    { path: '/atlas', labelKey: 'nav_atlas' },
    { path: '/stories', labelKey: 'nav_stories' },
    { path: '/watch', labelKey: 'nav_watch' },
    { path: '/topics', labelKey: 'nav_topics' },
    { path: '/research', labelKey: 'nav_research' },
    { path: '/food-labels', labelKey: 'nav_food_labels' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#08090b]/85 backdrop-blur-md">
      <div className="container flex h-18 items-center justify-between gap-2 sm:gap-4">
        {/* Brand Wordmark */}
        <button
          onClick={() => onNavigate('/')}
          className="flex min-w-0 items-center gap-2.5 text-left sm:gap-3"
          aria-label="Telugu Sugars Home"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-300 via-amber-500 to-amber-800 font-display text-base font-extrabold text-black shadow-lg shadow-amber-500/20">
            TS
          </div>
          <div className="flex flex-col leading-tight">
            <span className="whitespace-nowrap font-display text-sm font-extrabold tracking-tight text-white sm:text-base">TELUGU SUGARS</span>
            <span className="font-telugu text-xs font-medium text-amber-300/80">తెలుగు సుగర్స్</span>
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
                  isActive ? 'bg-amber-500/15 text-amber-300' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {t(item.labelKey)}
              </button>
            );
          })}
        </nav>

        {/* Action Controls: Search & Language Switcher */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-300 transition-colors hover:bg-white/10"
            aria-label="Search articles, studies, food labels"
            title="Global Search (Ctrl+K / ⌘K)"
          >
            <Search className="h-4 w-4 text-amber-400" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden rounded border border-white/10 bg-black/40 px-1.5 py-0.5 font-mono text-[10px] text-slate-400 md:inline">
              ⌘K
            </kbd>
          </button>

          <LanguageToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
