import React, { useEffect, useRef, useState } from 'react';
import { Camera, ScanLine, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { findBarcode, ocrReady, readLabel, warmBarcode } from '../../lib/scan';

export type BarcodeResult = true | { name?: string; offline?: boolean } | false;

interface ScannerProps {
  open: boolean;
  onClose: () => void;
  /** true = handled (the scanner closes); otherwise what to tell the person */
  onBarcode: (code: string) => Promise<BarcodeResult>;
  onText: (text: string, sugar100: number | null) => void;
}

/**
 * Scan a pack: the live camera looks for a barcode; "Read the label" reads the ingredients list in the frame.
 * Without a camera (or permission) it falls back to the phone's own camera app through a file input.
 */
export const Scanner: React.FC<ScannerProps> = ({ open, onClose, onBarcode, onText }) => {
  const { t } = useLanguage();
  const dlg = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const file = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState('');
  const [camera, setCamera] = useState(false);
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  const tried = useRef(new Set<string>());

  const say = (key: string, vars?: Record<string, string | number>) => setStatus(key ? t(key, vars) : '');

  async function lookup(code: string) {
    busyRef.current = true; setBusy(true);
    tried.current.add(code);
    say('sc_found', { code });
    let res: BarcodeResult;
    try { res = await onBarcode(code); } catch { res = { offline: true }; }
    busyRef.current = false; setBusy(false);
    if (res === true) { onClose(); return true; }
    if (res && res.offline) say('sc_offline');
    else if (res && res.name) say('sc_noing', { name: res.name });
    else say('sc_notfound');
    return false;
  }

  async function read(source: CanvasImageSource, w: number, h: number) {
    if (busyRef.current || !w) return;
    busyRef.current = true; setBusy(true);
    say(ocrReady() ? 'sc_reading' : 'sc_loading', { p: 0 });
    try {
      const got = await readLabel(source, w, h, (p) => say('sc_reading', { p }));
      if (!got.ok) { say('sc_blurry'); return; }
      onClose();
      onText(got.text, got.sugar100);
    } catch {
      say('sc_blurry');
    } finally {
      busyRef.current = false; setBusy(false);
    }
  }

  // Open: show the sheet, start the camera, watch for barcodes. Close: stop everything.
  useEffect(() => {
    const d = dlg.current;
    if (!d) return;
    if (!open) { if (d.open) d.close(); return; }
    if (!d.open) d.showModal();
    tried.current = new Set();
    setStatus('');
    let stream: MediaStream | null = null, live = true, timer = 0;
    warmBarcode();
    (async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) throw new Error('no camera');
        stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } } });
        if (!live) { stream.getTracks().forEach((tr) => tr.stop()); return; }
        const v = video.current!;
        v.srcObject = stream;
        await v.play();
        setCamera(true);
        say('sc_looking');
        const tick = async () => {
          if (!live) return;
          if (!busyRef.current && v.videoWidth) {
            const code = await findBarcode(v, v.videoWidth, v.videoHeight).catch(() => null);
            if (!live) return;
            if (code && !tried.current.has(code)) await lookup(code);
          }
          timer = window.setTimeout(tick, 350);
        };
        tick();
      } catch {
        setCamera(false);
        if (live) say('sc_nocam');
      }
    })();
    return () => {
      live = false;
      clearTimeout(timer);
      stream?.getTracks().forEach((tr) => tr.stop());
      setCamera(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const onPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    let src: CanvasImageSource, w: number, h: number;
    try { const b = await createImageBitmap(f); src = b; w = b.width; h = b.height; }
    catch { const img = new Image(); img.src = URL.createObjectURL(f); await img.decode(); src = img; w = img.naturalWidth; h = img.naturalHeight; }
    // A photo of the barcode works too.
    const code = await findBarcode(src, w, h).catch(() => null);
    if (code && !tried.current.has(code) && (await lookup(code))) return;
    read(src, w, h);
  };

  return (
    <dialog
      ref={dlg}
      onCancel={(e) => { e.preventDefault(); onClose(); }}
      onClose={onClose}
      aria-labelledby="scan-title"
      className="m-auto h-dvh max-h-dvh w-screen max-w-none overflow-hidden bg-(--bg-panel) p-0 text-white backdrop:bg-black/70 sm:h-auto sm:max-h-[94dvh] sm:w-[min(560px,100vw)] sm:rounded-3xl"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between gap-3 px-4 pb-3 pt-[calc(14px+env(safe-area-inset-top,0px))]">
          <b id="scan-title" className="font-display text-lg font-extrabold">{t('sc_title')}</b>
          <button type="button" onClick={onClose} aria-label={t('sc_close')} className="grid h-11 w-11 place-items-center rounded-full bg-white/10 hover:bg-white/15">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className={`relative overflow-hidden ${camera ? 'min-h-72 flex-1 bg-black sm:aspect-[4/3.4] sm:flex-none' : 'bg-white/[0.04]'}`}>
          <video ref={video} playsInline muted className={camera ? 'absolute inset-0 h-full w-full object-cover' : 'hidden'} />
          {camera && (
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-[8%] inset-y-[14%] rounded-2xl border-2 border-amber-500">
              <span className="absolute inset-x-[6%] top-1/2 h-0.5 rounded bg-amber-500 motion-safe:animate-pulse" />
            </div>
          )}
          <p className={camera ? 'absolute inset-x-3 bottom-3 rounded-xl bg-black/55 px-3 py-2.5 text-center text-sm leading-relaxed' : 'm-4 text-center text-sm leading-relaxed text-slate-300'}>
            {t('sc_tip')}
          </p>
        </div>

        <p aria-live="polite" className="min-h-[2.6em] px-4 pt-3 text-sm font-bold leading-relaxed text-amber-400">{status}</p>

        <div className="flex flex-wrap gap-2.5 px-4 py-2.5">
          <button
            type="button"
            disabled={busy}
            onClick={() => { const v = video.current; if (camera && v) read(v, v.videoWidth, v.videoHeight); else file.current?.click(); }}
            className="inline-flex min-h-13 flex-[1_1_180px] items-center justify-center gap-2 rounded-full bg-amber-500 px-4 py-3 text-[15px] font-extrabold text-[#fff] disabled:cursor-wait disabled:opacity-60"
          >
            <ScanLine className="h-5 w-5" /> {t('sc_read')}
          </button>
          <label className="relative inline-flex min-h-13 flex-[1_1_180px] cursor-pointer items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-3 text-[15px] font-extrabold focus-within:outline focus-within:outline-3 focus-within:outline-amber-500">
            <Camera className="h-5 w-5" /> {t('sc_photo')}
            <input ref={file} type="file" accept="image/*" capture="environment" onChange={onPhoto} className="absolute h-px w-px opacity-0" />
          </label>
        </div>
        <p className="px-4 pb-[calc(14px+env(safe-area-inset-bottom,0px))] text-xs leading-relaxed text-slate-500">{t('sc_privacy')}</p>
      </div>
    </dialog>
  );
};

export default Scanner;
