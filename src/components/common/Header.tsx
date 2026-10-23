import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { InstagramLink, InstagramIcon } from './InstagramLink';
import { useLanguage } from '../../context/LanguageContext';
import LanguageToggle from './LanguageToggle';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  activePath: string;
  onNavigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activePath, onNavigate }) => {
  const { t } = useLanguage();
  // Phones and tablets: the links live in a menu under the header (no bottom tab bar)
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [activePath]);
  const go = (path: string) => { setOpen(false); onNavigate(path); };

  const navItems = [
    { path: '/atlas', labelKey: 'nav_atlas' },
    { path: '/watch', labelKey: 'nav_watch' },
    { path: '/research', labelKey: 'nav_research' },
    { path: '/food-labels', labelKey: 'nav_food_labels' },
    { path: '/creators', labelKey: 'nav_creators' },
    { path: '/founder', labelKey: 'nav_founder' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-(--bg-obsidian)">
      <div className="container flex h-18 items-center justify-between gap-2 sm:gap-4">
        {/* Brand Wordmark */}
        <button
          onClick={() => onNavigate('/')}
          className="flex min-w-0 items-center gap-2 text-left sm:gap-3"
          aria-label={t('nav_brand_aria')}
        >
          <div className="flex h-9 w-9 shrink-0 items-center sm:h-10 sm:w-10 justify-center rounded-lg bg-amber-500 font-display text-base font-extrabold text-[#fff]">
            TS
          </div>
          <div className="flex min-w-0 flex-col overflow-hidden leading-tight">
            {/* Wordmark is too wide beside the toggles on very narrow phones; the TS mark and Telugu name carry the brand there */}
            <span className="whitespace-nowrap font-display text-xs font-extrabold max-[379px]:hidden tracking-tight text-white sm:text-base">TELUGU SUGARS</span>
            <span className="whitespace-nowrap font-telugu text-xs font-medium text-amber-400">తెలుగు సుగర్స్</span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label={t('nav_main_aria')}>
          {navItems.map((item) => {
            const isActive = activePath === item.path || activePath.startsWith(item.path + '/');
            return (
              <button
                key={item.path}
                onClick={() => onNavigate(item.path)}
                aria-current={isActive ? 'page' : undefined}
                className={`rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-amber-500 text-[#fff]'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {t(item.labelKey)}
              </button>
            );
          })}
        </nav>

        {/* Action Controls: Search & Language Switcher */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
          <InstagramLink className="hidden h-9 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 text-xs font-bold text-slate-200 transition-colors hover:border-amber-400/50 hover:text-white xl:inline-flex">
            <InstagramIcon className="h-3.5 w-3.5 text-amber-400" />
            {t('contact_us')}
          </InstagramLink>
          <ThemeToggle />
          <LanguageToggle />
          <button
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={t('nav_menu')}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white lg:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-menu" className="border-t border-white/10 bg-(--bg-obsidian) lg:hidden" aria-label={t('nav_main_aria')}>
          <div className="container flex flex-col py-2">
            {[{ path: '/', labelKey: 'nav_home' }, ...navItems].map((item) => {
              const isActive = item.path === '/' ? activePath === '/' : activePath === item.path || activePath.startsWith(item.path + '/');
              return (
                <button
                  key={item.path}
                  onClick={() => go(item.path)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`border-b border-white/5 py-3.5 text-left text-lg font-semibold last:border-0 ${isActive ? 'text-amber-400' : 'text-white'}`}
                >
                  {t(item.labelKey)}
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
