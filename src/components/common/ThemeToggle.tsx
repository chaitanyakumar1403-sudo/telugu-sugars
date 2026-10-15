import React, { useState } from 'react';
import { Moon, Sun } from 'lucide-react';

type Theme = 'light' | 'dark';

export const ThemeToggle: React.FC = () => {
  // index.html sets data-theme before first paint
  const [theme, setTheme] = useState<Theme>(() => (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'));

  const toggle = () => {
    const next: Theme = theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('telugusugars_theme', next); } catch { /* private mode: theme just won't persist */ }
    setTheme(next);
  };

  const Icon = theme === 'light' ? Moon : Sun;
  return (
    <button
      onClick={toggle}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      title={theme === 'light' ? 'Dark mode' : 'Light mode'}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-amber-400 transition hover:rotate-45 hover:border-amber-400/40"
    >
      <Icon key={theme} className="h-4 w-4 animate-[greet-in_500ms_var(--ease-spring)]" />
    </button>
  );
};

export default ThemeToggle;
