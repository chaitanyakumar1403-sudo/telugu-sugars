// Scanning a pack for the Ingredient Atlas, and the WhatsApp share card.
//  - Barcode: the phone's own BarcodeDetector where it has one (Chrome on Android), else ZXing.
//  - Ingredients photo: read on the phone with Tesseract OCR. Photos never leave the phone;
//    only a barcode number is looked up on Open Food Facts.
// Both libraries load from jsDelivr only when someone opens the scanner.
import type { Level } from '../data/atlasData';

const ZXING = 'https://cdn.jsdelivr.net/npm/@zxing/library@0.21.3/umd/index.min.js';
const TESS = 'https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js';
// English model, 3 MB (the default download is 11 MB); the browser keeps it after the first scan.
const TESS_LANG = 'https://cdn.jsdelivr.net/npm/@tesseract.js-data/eng@1.0.0/4.0.0_best_int';

/* eslint-disable @typescript-eslint/no-explicit-any */
type AnyWin = Window & { ZXing?: any; Tesseract?: any; BarcodeDetector?: any };
const w = () => window as AnyWin;

const loaded: Record<string, Promise<void>> = {};
function load(src: string): Promise<void> {
  if (!loaded[src]) {
    loaded[src] = new Promise((ok, no) => {
      const s = document.createElement('script');
      s.src = src; s.async = true;
      s.onload = () => ok();
      s.onerror = () => { delete loaded[src]; no(new Error('load ' + src)); };
      document.head.appendChild(s);
    });
  }
  return loaded[src];
}

// ---------- barcodes ----------
export function validEan(d: string): boolean {
  if (!/^\d{8}$|^\d{12,13}$/.test(d)) return false;
  const n = d.split('').map(Number), check = n.pop()!;
  const sum = n.reverse().reduce((s, x, i) => s + x * (i % 2 ? 1 : 3), 0);
  return (10 - (sum % 10)) % 10 === check;
}

let native: any = null, nativeChecked = false;
async function nativeDetector() {
  if (nativeChecked) return native;
  nativeChecked = true;
  try {
    const BD = w().BarcodeDetector;
    if (BD) {
      const f: string[] = await BD.getSupportedFormats();
      const want = ['ean_13', 'ean_8', 'upc_a', 'upc_e'].filter((x) => f.includes(x));
      if (want.length) native = new BD({ formats: want });
    }
  } catch { native = null; }
  return native;
}
let zx: ((c: HTMLCanvasElement) => string | null) | null = null;
async function zxingReader() {
  if (zx) return zx;
  await load(ZXING);
  const Z = w().ZXing, hints = new Map();
  hints.set(Z.DecodeHintType.POSSIBLE_FORMATS, [Z.BarcodeFormat.EAN_13, Z.BarcodeFormat.EAN_8, Z.BarcodeFormat.UPC_A, Z.BarcodeFormat.UPC_E]);
  hints.set(Z.DecodeHintType.TRY_HARDER, true);
  const r = new Z.MultiFormatReader();
  r.setHints(hints);
  zx = (canvas) => {
    try { return r.decode(new Z.BinaryBitmap(new Z.HybridBinarizer(new Z.HTMLCanvasElementLuminanceSource(canvas)))).getText(); }
    catch { return null; }
    finally { r.reset(); }
  };
  return zx;
}
/** Warm whichever barcode reader this phone will use, while the camera starts. */
export const warmBarcode = () => nativeDetector().then((d) => { if (!d) zxingReader().catch(() => {}); });

/** An EAN/UPC code in a video frame, photo or canvas, or null. */
export async function findBarcode(source: CanvasImageSource, width: number, height: number): Promise<string | null> {
  const det = await nativeDetector();
  if (det) {
    try { const r: { rawValue: string }[] = await det.detect(source); return r.map((x) => x.rawValue).find(validEan) ?? null; }
    catch { return null; }
  }
  const read = await zxingReader();
  const c = document.createElement('canvas'), k = Math.min(1, 1000 / width);
  c.width = Math.round(width * k); c.height = Math.round(height * k);
  c.getContext('2d')!.drawImage(source, 0, 0, c.width, c.height);
  const v = read(c);
  return v && validEan(v) ? v : null;
}

// ---------- reading the ingredients (OCR) ----------
let worker: any = null, onPct: ((p: number) => void) | null = null;
// Greyscale + stretch the contrast: labels are small print on shiny packs.
function prepare(source: CanvasImageSource, width: number, height: number) {
  const k = Math.min(1, 2000 / Math.max(width, height)), c = document.createElement('canvas');
  c.width = Math.round(width * k); c.height = Math.round(height * k);
  const g = c.getContext('2d', { willReadFrequently: true })!;
  g.drawImage(source, 0, 0, c.width, c.height);
  const img = g.getImageData(0, 0, c.width, c.height), d = img.data;
  let lo = 255, hi = 0;
  for (let i = 0; i < d.length; i += 4) { const y = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]; d[i] = y; if (y < lo) lo = y; if (y > hi) hi = y; }
  const span = Math.max(1, hi - lo);
  for (let i = 0; i < d.length; i += 4) { const y = ((d[i] - lo) / span) * 255; d[i] = d[i + 1] = d[i + 2] = y; }
  g.putImageData(img, 0, 0);
  return c;
}

/** Keep the ingredients section and the sugar figure; drop the rest of the pack's small print. */
export function parseLabel(raw: string): { text: string; sugar100: number | null; ok: boolean } {
  const flat = raw.replace(/-\n(?=[a-z])/g, '').replace(/\s*\n\s*/g, ' ').replace(/\s{2,}/g, ' ').trim();
  let text = flat;
  const start = flat.search(/ingred[il1]ents?\s*[:;.-]?/i);
  if (start >= 0) {
    const rest = flat.slice(start).replace(/^ingred[il1]ents?\s*[:;.-]?\s*/i, '');
    const stop = rest.slice(20).search(/\b(allergen|allergy|contains?\s*:|nutrition|nutritional|energy\s*\(|net\s*(wt|weight|qty|quantity)|best before|use by|mfd|manufactured|marketed by|packed by|store in|storage|customer care|fssai|lic\.?\s*no|mrp)\b/i);
    text = (stop >= 0 ? rest.slice(0, stop + 20) : rest).trim().replace(/[.;,\s]+$/, '');
  }
  const sm = flat.match(/(?:total\s*)?sugars?\s*(?:\(g\))?\s*[:-]?\s*(\d{1,2}(?:[.,]\d{1,2})?)\s*g?/i);
  const sugar100 = sm ? parseFloat(sm[1].replace(',', '.')) : null;
  const letters = (text.match(/[a-z]/gi) || []).length;
  return { text, sugar100: sugar100 != null && sugar100 <= 100 ? sugar100 : null, ok: letters >= 15 };
}

/** Read the ingredients from a photo or frame. `progress` gets 0–100 while it reads. */
export async function readLabel(source: CanvasImageSource, width: number, height: number, progress: (p: number) => void) {
  const canvas = prepare(source, width, height);
  await load(TESS);
  if (!worker) {
    worker = await w().Tesseract.createWorker('eng', 1, {
      langPath: TESS_LANG,
      logger: (m: { status: string; progress: number }) => { if (m.status === 'recognizing text' && onPct) onPct(Math.round(m.progress * 100)); },
    });
  }
  onPct = progress;
  try { const { data } = await worker.recognize(canvas); return parseLabel(data.text || ''); }
  finally { onPct = null; }
}
export const ocrReady = () => !!worker;

// ---------- Open Food Facts ----------
export type Lookup =
  | { status: 'found'; name: string; text: string; sugar100: number | null }
  | { status: 'noing'; name: string }
  | { status: 'missing' }
  | { status: 'offline' };

/** Only the barcode number leaves the phone. */
export async function lookupBarcode(code: string): Promise<Lookup> {
  const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), 9000);
  try {
    const r = await fetch(`https://world.openfoodfacts.org/api/v2/product/${code}.json?fields=product_name,product_name_en,brands,ingredients_text_en,ingredients_text,nutriments`, { signal: ctl.signal });
    const j = await r.json().catch(() => ({}));
    if (j.status !== 1 || !j.product) return { status: 'missing' };
    const p = j.product;
    const name = String(p.product_name_en || p.product_name || (p.brands && String(p.brands).split(',')[0]) || code).trim();
    const text = String(p.ingredients_text_en || p.ingredients_text || '').trim();
    if (!text) return { status: 'noing', name };
    const sg = p.nutriments?.sugars_100g;
    return { status: 'found', name, text, sugar100: sg == null || sg === '' || isNaN(+sg) ? null : +sg };
  } catch {
    return { status: 'offline' };
  } finally {
    clearTimeout(timer);
  }
}

// ---------- the share card ----------
export interface CardRow { age: string; level: Level; word: string; why: string }
export interface CardData { title: string; source: string; tsp: number | null; tspLabel: string; rows: CardRow[]; brand: string; foot: string; url: string; te: boolean }

const LVC: Record<Level, string> = { ok: '#2e7d4f', limit: '#fd6a02', care: '#a94400', avoid: '#b3261e' };
const SYM: Record<Level, string> = { ok: '✓', limit: '!', care: '?', avoid: '✕' };
const fmt = (x: number) => String(Math.round(x * 10) / 10);
function wrap(g: CanvasRenderingContext2D, text: string, max: number) {
  const words = String(text).split(/\s+/), lines: string[] = [];
  let line = '';
  words.forEach((wd) => { const next = line ? line + ' ' + wd : wd; if (g.measureText(next).width > max && line) { lines.push(line); line = wd; } else line = next; });
  if (line) lines.push(line);
  return lines;
}
function roundRect(g: CanvasRenderingContext2D, x: number, y: number, wd: number, h: number, r: number) {
  g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + wd, y, x + wd, y + h, r); g.arcTo(x + wd, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + wd, y, r); g.closePath();
}

/** A 1080-wide PNG: brand band, title, sugar teaspoons, a verdict row for each age, the doctor line. */
export async function drawCard(data: CardData): Promise<Blob> {
  const F = data.te ? '"Noto Sans Telugu", sans-serif' : '"Bricolage Grotesque", "Noto Sans Telugu", sans-serif';
  try { await Promise.all([document.fonts.load('700 60px "Noto Sans Telugu"'), document.fonts.load('800 60px "Bricolage Grotesque"')]); } catch { /* fall back to system fonts */ }
  const W = 1080, c = document.createElement('canvas'), g = c.getContext('2d')!;
  g.font = `800 62px ${F}`;
  const titleLines = wrap(g, data.title, W - 140).slice(0, 3);
  const H = 230 + titleLines.length * 80 + 70 + (data.tsp != null ? 230 : 0) + data.rows.length * 150 + 200;
  c.width = W; c.height = H;
  g.fillStyle = '#ffffff'; g.fillRect(0, 0, W, H);
  const band = g.createLinearGradient(0, 0, W, 0); band.addColorStop(0, '#fd6a02'); band.addColorStop(1, '#c24e00');
  g.fillStyle = band; g.fillRect(0, 0, W, 150);
  g.fillStyle = '#fff'; g.textBaseline = 'middle';
  g.font = '700 46px "Noto Sans Telugu", sans-serif'; g.fillText('తెలుగు', 60, 78);
  const tw = g.measureText('తెలుగు').width;
  g.font = '800 46px "Bricolage Grotesque", sans-serif'; g.fillText(' SUGARS', 60 + tw, 80);
  g.font = `600 30px ${F}`; g.textAlign = 'right'; g.fillText(data.brand, W - 60, 80); g.textAlign = 'left';
  let y = 230;
  g.fillStyle = '#2b1d16'; g.font = `800 62px ${F}`; g.textBaseline = 'alphabetic';
  titleLines.forEach((l) => { g.fillText(l, 70, y); y += 80; });
  g.fillStyle = '#6b5a50'; g.font = `500 28px ${F}`;
  if (data.source) g.fillText(wrap(g, data.source, W - 140)[0], 70, y - 18);
  y += 40;
  if (data.tsp != null) {
    g.fillStyle = '#fff4ec'; roundRect(g, 60, y, W - 120, 200, 28); g.fill();
    g.fillStyle = '#c24e00'; g.font = '800 96px "Bricolage Grotesque", sans-serif'; g.fillText(fmt(data.tsp), 100, y + 125);
    const nw = g.measureText(fmt(data.tsp)).width;
    g.fillStyle = '#2b1d16'; g.font = `700 34px ${F}`; g.fillText(data.tspLabel, 130 + nw, y + 92);
    const n = Math.min(14, Math.round(data.tsp * 2) / 2);
    for (let i = 0; i < Math.ceil(n); i++) {
      const x = 130 + nw + i * 46;
      if (x > W - 140) break;
      g.fillStyle = '#ffffff'; roundRect(g, x, y + 118, i + 1 > n ? 19 : 38, 38, 7); g.fill();
      g.strokeStyle = '#e8a774'; g.lineWidth = 3; g.stroke();
    }
    y += 230;
  }
  data.rows.forEach((r) => {
    g.fillStyle = '#faf6f2'; roundRect(g, 60, y, W - 120, 128, 24); g.fill();
    g.fillStyle = LVC[r.level]; g.beginPath(); g.arc(122, y + 64, 36, 0, 7); g.fill();
    g.fillStyle = '#fff'; g.font = '800 40px "Bricolage Grotesque", sans-serif'; g.textAlign = 'center'; g.fillText(SYM[r.level], 122, y + 78); g.textAlign = 'left';
    g.fillStyle = '#2b1d16'; g.font = `700 36px ${F}`; g.fillText(r.age, 184, y + (r.why ? 56 : 76));
    if (r.why) { g.fillStyle = '#6b5a50'; g.font = `500 26px ${F}`; g.fillText(wrap(g, r.why, W - 520)[0], 184, y + 98); }
    g.fillStyle = LVC[r.level]; g.font = `800 36px ${F}`; g.textAlign = 'right'; g.fillText(r.word, W - 96, y + 76); g.textAlign = 'left';
    y += 150;
  });
  y += 20;
  g.strokeStyle = '#eee3da'; g.lineWidth = 2; g.beginPath(); g.moveTo(60, y); g.lineTo(W - 60, y); g.stroke();
  g.fillStyle = '#6b5a50'; g.font = `500 26px ${F}`;
  wrap(g, data.foot, W - 120).slice(0, 2).forEach((l, i) => g.fillText(l, 60, y + 52 + i * 38));
  g.fillStyle = '#c24e00'; g.font = '700 28px "Bricolage Grotesque", sans-serif'; g.fillText(data.url, 60, y + 140);
  return new Promise((ok, no) => c.toBlob((b) => (b ? ok(b) : no(new Error('card'))), 'image/png'));
}

/** Straight to the phone's share sheet (WhatsApp) when it takes files; otherwise the caller shows a preview. */
export async function shareImage(blob: Blob, text: string, name: string): Promise<'shared' | 'cancelled' | 'unsupported'> {
  const file = new File([blob], name, { type: 'image/png' });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try { await navigator.share({ files: [file], text }); return 'shared'; }
    catch (e) { if ((e as Error)?.name === 'AbortError') return 'cancelled'; }
  }
  return 'unsupported';
}
