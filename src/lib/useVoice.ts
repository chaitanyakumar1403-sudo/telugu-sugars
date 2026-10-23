// Read-aloud as a hook: Dheeraj's recording for this language when it exists, else the device voice.
// Used by ListenButton and the founder page's record player.
import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { canSpeak, claim, deviceVoice, hasRecording, recUrl, release } from './voice';

export type VoiceState = 'idle' | 'rec' | 'tts';

export function useVoice(rec: string | undefined, text: string | (() => string)) {
  const { language } = useLanguage();
  const [mine, setMine] = useState(false);
  const [voice, setVoice] = useState(() => !!deviceVoice(language));
  const [state, setState] = useState<VoiceState>('idle');
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

  return { available: mine || voice, mine, state, pct, toggle };
}
