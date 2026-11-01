// A small voice recorder for the browser: microphone → one audio clip, kept on the device.
// Nothing is uploaded; the clip only leaves the phone if the person shares or downloads it themselves.
import { useEffect, useRef, useState } from 'react';

export type RecState = 'idle' | 'asking' | 'rec' | 'done' | 'denied' | 'unsupported';

const supported = () =>
  typeof window !== 'undefined' && !!navigator.mediaDevices?.getUserMedia && typeof MediaRecorder !== 'undefined';

// The first format this browser can record (Chrome/Android: webm, Safari/iPhone: mp4)
const pickType = () => ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg'].find((t) => MediaRecorder.isTypeSupported?.(t)) ?? '';

/** maxSeconds: recording stops on its own at this length. */
export function useRecorder(maxSeconds: number) {
  const [state, setState] = useState<RecState>(() => (supported() ? 'idle' : 'unsupported'));
  const [secs, setSecs] = useState(0);
  const [level, setLevel] = useState(0); // 0–1, for a live meter while recording
  const [clip, setClip] = useState<{ url: string; blob: Blob } | null>(null);
  const stopRef = useRef<() => void>(() => {});

  useEffect(() => () => stopRef.current(), []);
  useEffect(() => () => { if (clip) URL.revokeObjectURL(clip.url); }, [clip]);

  const start = async () => {
    if (!supported()) { setState('unsupported'); return; }
    setState('asking');
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
    } catch {
      setState('denied');
      return;
    }
    const type = pickType();
    const rec = new MediaRecorder(stream, type ? { mimeType: type } : undefined);
    const chunks: BlobPart[] = [];
    rec.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };

    // Live level meter
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    const ctx = AC ? new AC() : null;
    const an = ctx?.createAnalyser();
    if (ctx && an) { an.fftSize = 256; ctx.createMediaStreamSource(stream).connect(an); }
    const buf = new Uint8Array(an?.fftSize ?? 0);
    let raf = 0;
    const t0 = performance.now();
    const tick = () => {
      const s = (performance.now() - t0) / 1000;
      setSecs(Math.min(maxSeconds, s));
      if (an) {
        an.getByteTimeDomainData(buf);
        let peak = 0;
        for (const v of buf) peak = Math.max(peak, Math.abs(v - 128) / 128);
        setLevel(peak);
      }
      if (s >= maxSeconds) { stop(); return; }
      raf = requestAnimationFrame(tick);
    };

    const stop = () => {
      cancelAnimationFrame(raf);
      if (rec.state !== 'inactive') rec.stop();
      stream.getTracks().forEach((tr) => tr.stop());
      ctx?.close().catch(() => {});
      setLevel(0);
      stopRef.current = () => {};
    };
    rec.onstop = () => {
      const blob = new Blob(chunks, { type: rec.mimeType || type || 'audio/webm' });
      setClip({ url: URL.createObjectURL(blob), blob });
      setState('done');
    };
    stopRef.current = stop;
    setClip(null);
    setSecs(0);
    rec.start();
    setState('rec');
    raf = requestAnimationFrame(tick);
  };

  const reset = () => { stopRef.current(); setClip(null); setSecs(0); setState(supported() ? 'idle' : 'unsupported'); };

  return { state, secs, level, clip, start, stop: () => stopRef.current(), reset };
}

/** File extension for a recorded clip, from its type. */
export const clipExt = (blob: Blob) => (blob.type.includes('mp4') ? 'm4a' : blob.type.includes('ogg') ? 'ogg' : 'webm');

/**
 * Share a clip through the phone's share sheet (WhatsApp, Instagram…) when the browser can share files;
 * otherwise download it. Returns what happened.
 */
export async function shareClip(blob: Blob, name: string, text: string): Promise<'shared' | 'downloaded' | 'cancelled'> {
  const file = new File([blob], `${name}.${clipExt(blob)}`, { type: blob.type });
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], text });
      return 'shared';
    } catch {
      return 'cancelled';
    }
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  return 'downloaded';
}
