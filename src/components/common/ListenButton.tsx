import React, { useEffect, useRef, useState } from 'react';
import { Square, Volume2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { canSpeak, claim, deviceVoice, hasRecording, recUrl, release } from '../../lib/voice';

interface ListenButtonProps {
  /** Recording name, e.g. "what" or "atlas/sugar" → public/audio/<lang>/<rec>.mp3 */
  rec?: string;
  /** What the device voice reads when there is no recording */
  text: string | (() => string);
  className?: string;
}

const BASE =
  'relative inline-flex w-fit items-center gap-2 overflow-hidden rounded-full bg-amber-500 px-6 py-3 text-sm font-bold text-[#fff] transition hover:bg-amber-600';

/**
 * Listen / వినండి. Plays Dheeraj's recording for this language when it exists (with a progress line
 * and "Dheeraj's voice"), else reads the text with the device voice. Hidden when neither is available.
 */
export const ListenButton: React.FC<ListenButtonProps> = ({ rec, text, className = BASE }) => {
  const { t, language } = useLanguage();
  const [mine, setMine] = useState(false);
  const [voice, setVoice] = useState(() => !!deviceVoice(language));
  const [state, setState] = useState<'idle' | 'rec' | 'tts'>('idle');
  const [pct, setPct] = useState(0);
  const stopRef = useRef<() => void>(() => {});

  useEffect(() => {
    let live = true;
    setMine(false);
    if (rec) hasRecording(rec, language).then((has) => { if (live) setMine(has); });
    const update = () => setVoice(!!deviceVoice(language));
    update();
    if (canSpeak()) speechSynthesis.addEventListener?.('voiceschanged', update);
    return () => {
      live = false;
      if (canSpeak()) speechSynthesis.removeEventListener?.('voiceschanged', update);
      stopRef.current();
    };
  }, [rec, language]);

  if (!mine && !voice) return null;

  const toggle = () => {
    if (state !== 'idle') { stopRef.current(); return; }
    let audio: HTMLAudioElement | null = null;
    const stop = () => {
      if (audio) { audio.pause(); audio = null; }
      if (canSpeak()) speechSynthesis.cancel();
      setState('idle');
      setPct(0);
      release(stop);
      stopRef.current = () => {};
    };
    stopRef.current = stop;
    claim(stop);
    if (mine && rec) {
      const a = (audio = new Audio(recUrl(rec, language)));
      a.ontimeupdate = () => { if (a.duration) setPct(a.currentTime / a.duration); };
      a.onended = stop;
      a.onerror = stop;
      setState('rec');
      a.play().catch(stop);
      return;
    }
    const v = deviceVoice(language);
    if (!v) { stop(); return; }
    const u = new SpeechSynthesisUtterance(typeof text === 'function' ? text() : text);
    u.voice = v;
    u.lang = v.lang;
    u.rate = language === 'te' ? 0.9 : 0.95;
    u.onend = u.onerror = stop;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
    setState('tts');
  };

  const on = state !== 'idle';
  return (
    <button type="button" onClick={toggle} aria-pressed={on} className={className}>
      {on ? <Square className="h-4 w-4 fill-current" /> : <Volume2 className="h-4 w-4" />}
      <span>{t(on ? 'listen_stop' : 'listen')}</span>
      {state === 'rec' && <span className="text-xs font-semibold opacity-90">· {t('voice_mine')}</span>}
      {state === 'rec' && (
        <span aria-hidden="true" className="absolute inset-x-4 bottom-1 h-0.5 rounded-full bg-white/30">
          <span className="block h-full rounded-full bg-white motion-safe:transition-[width]" style={{ width: `${Math.round(pct * 100)}%` }} />
        </span>
      )}
    </button>
  );
};

export default ListenButton;
