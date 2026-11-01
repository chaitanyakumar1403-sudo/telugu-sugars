import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useRecorder } from '../../lib/useRecorder';

const MAX = 6; // seconds: a hello, not a speech

/**
 * On the record player: after Dheeraj says hello, the visitor can say hello back. A few seconds on their own
 * phone, played back beside his, and a door to Inclusive Voices for the full story. Nothing is uploaded.
 */
export const HelloBack: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const r = useRecorder(MAX);
  const [playing, setPlaying] = useState(false);
  const audio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => () => { audio.current?.pause(); }, []);
  if (r.state === 'unsupported' || r.state === 'denied') return null;

  const play = () => {
    if (!r.clip) return;
    if (playing) { audio.current?.pause(); setPlaying(false); return; }
    const a = (audio.current = new Audio(r.clip.url));
    a.onended = a.onpause = () => setPlaying(false);
    setPlaying(true);
    a.play().catch(() => setPlaying(false));
  };
  const mic = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></svg>;

  return (
    <div className="hello">
      {r.state === 'idle' && (
        <button type="button" className="hb" onClick={r.start}>{mic}<span>{t('fd.h.back')}</span></button>
      )}
      {(r.state === 'asking' || r.state === 'rec') && (
        <button type="button" className="hb on" onClick={r.stop} aria-live="polite">
          <span className="lvl" aria-hidden="true"><i style={{ transform: `scaleX(${Math.max(0.06, r.level * 1.4)})` }} /></span>
          <span>{t('fd.h.rec', { s: Math.max(0, Math.ceil(MAX - r.secs)) })}</span>
        </button>
      )}
      {r.state === 'done' && r.clip && (
        <div className="hb-done">
          <button type="button" className="hb mine" onClick={play} aria-pressed={playing}>
            {playing
              ? <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" /></svg>
              : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor" /></svg>}
            <span>{t('fd.h.yours')}</span>
          </button>
          <button type="button" className="hb x" onClick={r.reset} aria-label={t('fd.h.again')} title={t('fd.h.again')}>↺</button>
          <a className="more" href="/voices" onClick={(e) => { e.preventDefault(); onNavigate('/voices'); }}>{t('fd.h.more')} →</a>
        </div>
      )}
      <p className="hb-note">{t('fd.h.private')}</p>
    </div>
  );
};

export default HelloBack;
