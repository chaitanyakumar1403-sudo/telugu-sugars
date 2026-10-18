import React, { useEffect, useRef, useState } from 'react';
import { Moon, Smartphone, Sun, Type } from 'lucide-react';

type Theme = 'system' | 'light' | 'dark';
type Size = 'normal' | 'big' | 'bigger';

const THEME_KEY = 'telugusugars_theme';
const SIZE_KEY = 'telugusugars_size';

const read = (k: string) => { try { return localStorage.getItem(k); } catch { return null; } };
const write = (k: string, v: string | null) => {
  try { if (v) localStorage.setItem(k, v); else localStorage.removeItem(k); } catch { /* private mode: just won't persist */ }
};
const systemTheme = () => (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

const THEMES: { id: Theme; label: string; icon: typeof Sun }[] = [
  { id: 'system', label: 'System (same as phone)', icon: Smartphone },
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'dark', label: 'Dark', icon: Moon },
];
const SIZES: { id: Size; label: string; cls: string }[] = [
  { id: 'normal', label: 'Normal', cls: 'text-xs' },
  { id: 'big', label: 'Big', cls: 'text-sm' },
  { id: 'bigger', label: 'Bigger', cls: 'text-base' },
];

/** Display menu: colour scheme + text size. index.html applies both before first paint. */
export const ThemeToggle: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => {
    const t = read(THEME_KEY);
    return t === 'light' || t === 'dark' ? t : 'system';
  });
  const [size, setSize] = useState<Size>(() => {
    const z = read(SIZE_KEY);
    return z === 'big' || z === 'bigger' ? z : 'normal';
  });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme === 'system' ? systemTheme() : theme;
    write(THEME_KEY, theme === 'system' ? null : theme);
    if (theme !== 'system') return;
    const mq = matchMedia('(prefers-color-scheme: light)');
    const on = () => (document.documentElement.dataset.theme = systemTheme());
    mq.addEventListener?.('change', on);
    return () => mq.removeEventListener?.('change', on);
  }, [theme]);

  useEffect(() => {
    if (size === 'normal') delete document.documentElement.dataset.size;
    else document.documentElement.dataset.size = size;
    write(SIZE_KEY, size === 'normal' ? null : size);
  }, [size]);

  useEffect(() => {
    if (!open) return;
    const close = (e: Event) => {
      if (e instanceof KeyboardEvent ? e.key === 'Escape' : !ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', close);
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', close); };
  }, [open]);

  const opt = (on: boolean) =>
    `flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-semibold transition-colors ${
      on ? 'bg-amber-500 text-[#fff] shadow-lg shadow-amber-500/30' : 'text-slate-300 hover:bg-white/5 hover:text-white'
    }`;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Display settings: colours and text size"
        className={`flex h-9 items-center gap-1.5 rounded-full border px-3 transition ${
          open ? 'border-amber-500 bg-amber-500/15 text-amber-400' : 'border-white/10 bg-white/5 text-amber-400 hover:border-amber-400/50'
        }`}
      >
        <Smartphone className="h-4 w-4" />
        <Type className="h-3.5 w-3.5 text-slate-300" />
      </button>

      {open && (
        <div className="panel absolute right-0 top-12 z-50 w-64 bg-(--bg-panel) p-3 animate-[greet-in_350ms_var(--ease-spring)]">
          <p className="px-1 pb-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">Colours</p>
          <div className="flex flex-col gap-1">
            {THEMES.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setTheme(id)} aria-pressed={theme === id} className={opt(theme === id)}>
                <Icon className="h-4 w-4" /> {label}
              </button>
            ))}
          </div>
          <p className="px-1 pb-1.5 pt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">Text size</p>
          <div className="grid grid-cols-3 gap-1.5">
            {SIZES.map(({ id, label, cls }) => (
              <button
                key={id}
                onClick={() => setSize(id)}
                aria-pressed={size === id}
                className={`rounded-xl border px-2 py-2.5 font-bold transition-colors ${cls} ${
                  size === id ? 'border-amber-500 bg-amber-500 text-[#fff]' : 'border-white/10 text-slate-300 hover:border-white/25 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeToggle;
