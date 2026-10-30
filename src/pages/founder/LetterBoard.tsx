import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { canSpeak, deviceVoice } from '../../lib/voice';
import { keyLift, stampFound, typeset } from './motion';
import { rise } from './rise';

/** The Telugu alphabet in chart order: [letter, how it sounds]. */
const VOWELS: [string, string][] = [
  ['అ', 'a'], ['ఆ', 'aa'], ['ఇ', 'i'], ['ఈ', 'ii'], ['ఉ', 'u'], ['ఊ', 'uu'], ['ఋ', 'ru'], ['ౠ', 'ruu'], ['ఌ', 'lu'],
  ['ౡ', 'luu'], ['ఎ', 'e'], ['ఏ', 'ee'], ['ఐ', 'ai'], ['ఒ', 'o'], ['ఓ', 'oo'], ['ఔ', 'au'], ['అం', 'am'], ['అః', 'aha'],
];
const CONSONANTS: [string, string][] = [
  ['క', 'ka'], ['ఖ', 'kha'], ['గ', 'ga'], ['ఘ', 'gha'], ['ఙ', 'nga'], ['చ', 'cha'], ['ఛ', 'chha'], ['జ', 'ja'], ['ఝ', 'jha'], ['ఞ', 'nya'],
  ['ట', 'ṭa'], ['ఠ', 'ṭha'], ['డ', 'ḍa'], ['ఢ', 'ḍha'], ['ణ', 'ṇa'], ['త', 'ta'], ['థ', 'tha'], ['ద', 'da'], ['ధ', 'dha'], ['న', 'na'],
  ['ప', 'pa'], ['ఫ', 'pha'], ['బ', 'ba'], ['భ', 'bha'], ['మ', 'ma'], ['య', 'ya'], ['ర', 'ra'], ['ల', 'la'], ['వ', 'va'], ['శ', 'śa'],
  ['ష', 'ṣa'], ['స', 'sa'], ['హ', 'ha'], ['ళ', 'ḷa'], ['క్ష', 'kṣa'], ['ఱ', 'ṟa'],
];
const KEY = 'ధ'; // ధీరజ్ (Dheeraj) starts with ధ
const HINT_AFTER = 3;

/**
 * Founder gate: all 54 Telugu letters as letterpress blocks. Tap ధ (dha, as in ధీరజ్) and Dheeraj's desk opens;
 * any other letter shows how it sounds (and says it, when the device has a Telugu voice). Skip is always there.
 */
export const LetterBoard: React.FC<{ onFound: () => void }> = ({ onFound }) => {
  const { t } = useLanguage();
  const [miss, setMiss] = useState<{ l: string; r: string; n: number } | null>(null);
  const [misses, setMisses] = useState(0);
  const [found, setFound] = useState(false);
  const [shake, setShake] = useState<string | null>(null);
  // Letters are read aloud only when the device has a Telugu voice (voices can load late, so listen for them).
  const [aloud, setAloud] = useState(true);
  const [hasVoice, setHasVoice] = useState(() => !!deviceVoice('te'));
  const timers = useRef<number[]>([]);
  const boardRef = useRef<HTMLDivElement>(null);
  const trayRef = useRef<HTMLDivElement>(null);

  // Arrival: the letters are typeset into the case; then the keys rise under the pointer.
  useEffect(() => {
    if (boardRef.current) typeset(boardRef.current);
    return trayRef.current ? keyLift(trayRef.current) : undefined;
  }, []);
  // Found: ధ flies onto the stamp and everything else falls out of the case.
  useEffect(() => {
    const b = boardRef.current;
    const hit = b?.querySelector<HTMLElement>('.tile.hit');
    if (found && b && hit) stampFound(b, hit, b.querySelector<HTMLElement>('.lb-stamp b'));
  }, [found]);

  useEffect(() => {
    const update = () => setHasVoice(!!deviceVoice('te'));
    if (canSpeak()) speechSynthesis.addEventListener?.('voiceschanged', update);
    return () => {
      if (canSpeak()) speechSynthesis.removeEventListener?.('voiceschanged', update);
      timers.current.forEach(clearTimeout);
    };
  }, []);

  const say = (l: string) => {
    const v = aloud && deviceVoice('te');
    if (!v) return;
    const u = new SpeechSynthesisUtterance(l);
    u.voice = v;
    u.lang = v.lang;
    u.rate = 0.85;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  };
  const later = (fn: () => void, ms: number) => { timers.current.push(window.setTimeout(fn, ms)); };

  const tap = (l: string, r: string) => {
    if (found) return;
    say(l);
    if (l === KEY) {
      setFound(true);
      const quick = matchMedia('(prefers-reduced-motion: reduce)').matches;
      later(onFound, quick ? 300 : 1900);
      return;
    }
    setMisses((m) => m + 1);
    setMiss((p) => ({ l, r, n: (p?.n ?? 0) + 1 }));
    setShake(l);
    later(() => setShake((s) => (s === l ? null : s)), 450);
  };

  const hint = misses >= HINT_AFTER;
  const tile = ([l, r]: [string, string], i: number) => (
    <button
      key={l}
      type="button"
      className={['tile', l === KEY && found ? 'hit' : '', l === KEY && hint && !found ? 'hint' : '', shake === l ? 'shake' : ''].filter(Boolean).join(' ')}
      style={{ '--i': i } as React.CSSProperties}
      onClick={() => tap(l, r)}
      aria-label={`${l} (${r})`}
      tabIndex={found ? -1 : 0}
    >
      <span className="g">{l}</span>
      <small>{r}</small>
    </button>
  );

  return (
    <div ref={boardRef} className={found ? 'lboard found' : 'lboard'}>
      <div className="lb-head">
        <p className="nk"><span>{t('fd.l.k')} ::</span></p>
        <h2 className="lb-q">{rise(t('fd.l.title'))}</h2>
        <p className="lb-ask">{t('fd.l.ask')}</p>
      </div>

      <div ref={trayRef} className="lb-case">
        <p className="lb-lab">{t('fd.l.vowels')}</p>
        <div className="lb-grid v">{VOWELS.map((x, i) => tile(x, i))}</div>
        <p className="lb-lab">{t('fd.l.cons')}</p>
        <div className="lb-grid c">{CONSONANTS.map((x, i) => tile(x, i + VOWELS.length))}</div>
      </div>

      <div className="lb-foot">
        <p className="lb-msg" aria-live="polite">
          {found ? t('fd.l.found') : hint ? t('fd.l.hint') : miss ? <span key={miss.n}>{t('fd.l.miss', { l: miss.l, r: miss.r })}</span> : ' '}
        </p>
        <div className="lb-act">
          {hasVoice && (
            <button type="button" className="chip" aria-pressed={aloud} onClick={() => setAloud((a) => !a)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4zM16 9a4 4 0 0 1 0 6" />{aloud && <path d="M19 6a8 8 0 0 1 0 12" />}</svg>
              <span>{t('fd.l.say')}</span>
            </button>
          )}
          <button type="button" className="chip ghost" onClick={onFound}>{t('fd.l.skip')}</button>
        </div>
      </div>

      {found && (
        <div className="lb-stamp" aria-hidden="true">
          <b>ధ</b><span>→</span><strong>ధీరజ్</strong><em>Dheeraj Kumar</em>
        </div>
      )}
    </div>
  );
};

export default LetterBoard;
