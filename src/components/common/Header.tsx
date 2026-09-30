import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import LanguageToggle from './LanguageToggle';
import { Search, Compass, BookOpen, Film, Tag, Sparkles, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  activePath: string;
  onNavigate: (path: string) => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activePath, onNavigate, onOpenSearch }) => {
  const { t } = useLanguage();

  const navItems = [
    { path: '/stories', labelKey: 'nav_stories', icon: BookOpen },
    { path: '/watch', labelKey: 'nav_watch', icon: Film },
    { path: '/topics', labelKey: 'nav_topics', icon: Tag },
    { path: '/research', labelKey: 'nav_research', icon: Compass },
    { path: '/food-labels', labelKey: 'nav_food_labels', icon: Sparkles },
    { path: '/about/editorial-standards', labelKey: 'nav_standards', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#08090b]/85 backdrop-blur-md border-b border-white/10 transition-colors">
      <div className="container mx-auto px-4 h-18 flex items-center justify-between gap-4">
        {/* Brand Wordmark */}
        <button
          onClick={() => onNavigate('/')}
          className="flex items-center gap-3 text-left focus-visible:outline-none"
          aria-label="Telugu Sugars Home"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-600 to-amber-900 flex items-center justify-center font-bold text-black text-xl shadow-lg shadow-amber-500/20">
            TS
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold tracking-tight text-lg leading-tight text-white flex items-center gap-1.5">
              TELUGU SUGARS
            </span>
            <span className="text-xs text-amber-300/80 font-medium font-telugu tracking-wide">
              తెలుగు సుగర్స్ • ఎవిడెన్స్ జర్నల్
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePath === item.path || (item.path !== '/' && activePath.startsWith(item.path));
            return (
              <button
                key={item.path}
                onClick={() => onNavigate(item.path)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'text-amber-300 bg-amber-500/15 border border-amber-500/30 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{t(item.labelKey)}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Controls: Search & Language Switcher */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            aria-label="Search articles, studies, food labels"
            title="Global Search (Ctrl+K / ⌘K)"
          >
            <Search className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden md:inline px-1.5 py-0.5 text-[10px] font-mono bg-black/40 text-slate-400 rounded border border-white/10">
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
