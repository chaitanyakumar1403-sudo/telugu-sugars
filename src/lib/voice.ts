// Read-aloud: Dheeraj's own recording when one exists, else the device's voice for that language.
// Recordings live in public/audio/<lang>/<name>.mp3 (made by scripts/prepare-audio.mjs).
import type { Language } from '../types/content';

export const recUrl = (name: string, lang: Language) => `/audio/${lang}/${name}.mp3`;

const known = new Map<string, Promise<boolean>>();

/** True only when the recording is really there: the SPA rewrite answers a missing file with index.html. */
export function hasRecording(name: string, lang: Language): Promise<boolean> {
  const url = recUrl(name, lang);
  let p = known.get(url);
  if (!p) {
    p = fetch(url, { method: 'HEAD', cache: 'no-cache' })
      .then((r) => r.ok && /audio|mpeg|octet-stream/.test(r.headers.get('content-type') || ''))
      .catch(() => false);
    known.set(url, p);
  }
  return p;
}

export const canSpeak = () => typeof window !== 'undefined' && 'speechSynthesis' in window;

/** The device voice for this language, if it has one (most Android phones have Telugu; many laptops don't). */
export function deviceVoice(lang: Language): SpeechSynthesisVoice | null {
  if (!canSpeak()) return null;
  const want = lang === 'te' ? 'te' : 'en';
  const voices = speechSynthesis.getVoices();
  return voices.find((v) => v.lang.toLowerCase().startsWith(want + '-in')) || voices.find((v) => v.lang.toLowerCase().startsWith(want)) || null;
}

// Only one thing reads aloud at a time: starting a new one stops the last.
let current: (() => void) | null = null;
export function claim(stop: () => void) {
  if (current && current !== stop) current();
  current = stop;
}
export function release(stop: () => void) {
  if (current === stop) current = null;
}
