import React, { useEffect, useRef, useState } from 'react';
import { AlignLeft, Contrast, Moon, Pause, Smartphone, Square, Sun, Type, Volume2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { canSpeak, claim, deviceVoice, release } from '../../lib/voice';

type Theme = 'system' | 'light' | 'dark';
type Size = 'normal' | 'big' | 'bigger';

const THEME_KEY = 'telugusugars_theme';
const SIZE_KEY = 'telugusugars_size';

const read = (k: string) => { try { return localStorage.getItem(k); } catch { return null; } };
const write = (k: string, v: string | null) => {
  try { if (v) localStorage.setItem(k, v); else localStorage.removeItem(k); } catch { /* private mode: just won't persist */ }
};
const systemTheme = () => (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

const THEMES: { id: Theme; icon: typeof Sun }[] = [
  { id: 'system', icon: Smartphone },
  { id: 'light', icon: Sun },
  { id: 'dark', icon: Moon },
];
const SIZES: { id: Size; cls: string }[] = [
  { id: 'normal', cls: 'text-xs' },
  { id: 'big', cls: 'text-sm' },
  { id: 'bigger', cls: 'text-base' },
];

// Accessibility switches: each sets <html data-…> (index.html applies them before first paint) and is remembered.
const FLAGS = [
  { attr: 'contrast', on: 'more', label: 'acc_contrast', icon: Contrast },
  { attr: 'read', on: 'easy', label: 'acc_read', icon: AlignLeft },
  { attr: 'motion', on: 'off', label: 'acc_calm', icon: Pause },
] as const;
type Flag = (typeof FLAGS)[number]['attr'];

/** The page's main text in pieces short enough for every speech engine (long utterances stop early on Chrome). */
const pageChunks = () => {
  const text = (document.querySelector('main')?.innerText || '').replace(/[ \t]+/g, ' ');
  return text
    .split(/\n+|(?<=[.!?।])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 1)
    .flatMap((s) => s.match(/.{1,220}(\s|$)/g) || [s]);
};

/** Display menu: colour scheme, text size and the accessibility switches. index.html applies them before first paint. */
export const ThemeToggle: React.FC = () => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => {
    const t = read(THEME_KEY);
    return t === 'system' || t === 'dark' ? t : 'light';
  });
  const [size, setSize] = useState<Size>(() => {
    const z = read(SIZE_KEY);
    return z === 'big' || z === 'bigger' ? z : 'normal';
  });
  const ref = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const [flags, setFlags] = useState<Record<Flag, boolean>>(() => ({
    contrast: read('telugusugars_contrast') === '1',
    read: read('telugusugars_read') === '1',
    motion: read('telugusugars_motion') === '1',
  }));
  const [reading, setReading] = useState(false);
  const stopReading = useRef<() => void>(() => {});

  useEffect(() => {
    for (const f of FLAGS) {
      if (flags[f.attr]) document.documentElement.dataset[f.attr] = f.on;
      else delete document.documentElement.dataset[f.attr];
      write(`telugusugars_${f.attr}`, flags[f.attr] ? '1' : null);
    }
  }, [flags]);
  useEffect(() => () => stopReading.current(), []);
  useEffect(() => { stopReading.current(); }, [language]);

  // Read the whole page aloud in the reader's language, a sentence at a time.
  const hasVoice = canSpeak() && !!deviceVoice(language);
  const toggleReading = () => {
    if (reading) { stopReading.current(); return; }
    const v = deviceVoice(language);
    if (!v) return;
    const queue = pageChunks();
    let live = true;
    const stop = () => { live = false; speechSynthesis.cancel(); setReading(false); release(stop); stopReading.current = () => {}; };
    const next = () => {
      if (!live) return;
      const s = queue.shift();
      if (!s) { stop(); return; }
      const u = new SpeechSynthesisUtterance(s);
      u.voice = v;
      u.lang = v.lang;
      u.rate = language === 'te' ? 0.9 : 0.95;
      u.onend = next;
      u.onerror = stop;
      speechSynthesis.speak(u);
    };
    claim(stop);
    stopReading.current = stop;
    speechSynthesis.cancel();
    setReading(true);
    next();
  };

  useEffect(() => {
    document.documentElement.dataset.theme = theme === 'system' ? systemTheme() : theme;
    write(THEME_KEY, theme === 'light' ? null : theme);
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
      on ? 'bg-amber-500 text-[#fff]' : 'text-slate-300 hover:bg-white/5 hover:text-white'
    }`;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={t('disp_aria')}
        className={`flex h-9 items-center gap-1.5 rounded-full border px-2.5 transition sm:px-3 ${
          open ? 'border-amber-500 bg-amber-500/15 text-amber-400' : 'border-white/10 bg-white/5 text-amber-400 hover:border-amber-400/50'
        }`}
      >
        <Smartphone className="h-4 w-4" />
        <Type className="h-3.5 w-3.5 text-slate-300" />
      </button>

      {open && (
        <div className="panel absolute right-0 top-12 z-50 max-h-[80vh] w-64 overflow-y-auto bg-(--bg-panel) p-3 animate-[pop-in_150ms_ease-out]">
          <p className="px-1 pb-1.5 text-xs text-slate-500">{t('theme_title')}</p>
          <div className="flex flex-col gap-1">
            {THEMES.map(({ id, icon: Icon }) => (
              <button key={id} onClick={() => setTheme(id)} aria-pressed={theme === id} className={opt(theme === id)}>
                <Icon className="h-4 w-4" /> {t(`theme_${id}`)}
              </button>
            ))}
          </div>
          <p className="px-1 pb-1.5 pt-4 text-xs text-slate-500">{t('size_title')}</p>
          <div className="grid grid-cols-3 gap-1.5">
            {SIZES.map(({ id, cls }) => (
              <button
                key={id}
                onClick={() => setSize(id)}
                aria-pressed={size === id}
                className={`rounded-xl border px-2 py-2.5 font-bold transition-colors ${cls} ${
                  size === id ? 'border-amber-500 bg-amber-500 text-[#fff]' : 'border-white/10 text-slate-300 hover:border-white/25 hover:text-white'
                }`}
              >
                {t(`size_${id}`)}
              </button>
            ))}
          </div>
          <p className="px-1 pb-1.5 pt-4 text-xs text-slate-500">{t('acc_title')}</p>
          <div className="flex flex-col gap-1">
            {FLAGS.map(({ attr, label, icon: Icon }) => (
              <button key={attr} onClick={() => setFlags((f) => ({ ...f, [attr]: !f[attr] }))} aria-pressed={flags[attr]} className={opt(flags[attr])}>
                <Icon className="h-4 w-4" /> {t(label)}
              </button>
            ))}
            <button onClick={toggleReading} disabled={!hasVoice} aria-pressed={reading} className={`${opt(reading)} disabled:opacity-50`}>
              {reading ? <Square className="h-4 w-4 fill-current" /> : <Volume2 className="h-4 w-4" />} {t(reading ? 'acc_aloud_stop' : 'acc_aloud')}
            </button>
            {!hasVoice && <p className="px-1 pt-1 text-xs text-slate-500">{t('acc_novoice')}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeToggle;
