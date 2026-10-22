// Turns Dheeraj's raw voice recordings into the files the site plays (Listen / వినండి buttons).
//   1. Put phone recordings in audio-raw/ (git-ignored), named <language>-<name>.<ext>:
//        te-what.m4a   en-founder.m4a   te-atlas-sugar.m4a   en-atlas-coca-cola.m4a ...
//      Any phone format works: m4a, mp3, wav, aac, ogg, opus, amr, webm, 3gp.
//   2. Run:   node scripts/prepare-audio.mjs          (add --force to redo every file)
// Each take is trimmed of silence at both ends, cleaned of rumble and light hiss, set to an even
// loudness (-16 LUFS, held under 0 dBFS) and saved as a small mono MP3 in public/audio:
//   te-what.m4a        → public/audio/te/what.mp3          (homepage)
//   en-atlas-sugar.m4a → public/audio/en/atlas/sugar.mp3   (Atlas detail for that item)
// Needs ffmpeg on PATH.
import { readdirSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname } from 'node:path';

// Every script in the Script Book, in recording order. A name not listed here still gets processed.
const SCRIPTS = [
  ['what', 'Homepage: What does Telugu Sugars do?'],
  ['founder', 'Founder page postcard'],
  ['atlas-sugar', 'Atlas: Sugar'],
  ['atlas-jaggery', 'Atlas: Jaggery'],
  ['atlas-honey', 'Atlas: Honey'],
  ['atlas-glucosesyrup', 'Atlas: Glucose syrup and HFCS'],
  ['atlas-maltodextrin', 'Atlas: Maltodextrin'],
  ['atlas-stevia', 'Atlas: Stevia and monk fruit'],
  ['atlas-aspartame', 'Atlas: Aspartame'],
  ['atlas-coca-cola', 'Atlas: Coca-Cola'],
  ['atlas-diet-coke', 'Atlas: Diet Coke'],
  ['atlas-bournvita', 'Atlas: Bournvita'],
  ['atlas-maggi-masala', 'Atlas: Maggi Masala Noodles'],
  ['atlas-parle-g', 'Atlas: Parle-G'],
  ['atlas-dairy-milk', 'Atlas: Cadbury Dairy Milk'],
  ['atlas-kissan-ketchup', 'Atlas: Kissan Ketchup'],
];
const LANGS = ['te', 'en'];
const outPath = (lang, name) => (name.startsWith('atlas-') ? `public/audio/${lang}/atlas/${name.slice(6)}.mp3` : `public/audio/${lang}/${name}.mp3`);

const RAW = 'audio-raw';
const force = process.argv.includes('--force');
if (!existsSync(RAW)) mkdirSync(RAW, { recursive: true });

const trim = 'silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.2';
const filters = [trim, 'areverse', trim, 'areverse', 'highpass=f=80', 'afftdn=nf=-28', 'loudnorm=I=-16:TP=-1.5:LRA=11',
  // loudnorm alone let true peaks reach +1.3 dBFS on real takes; a gentle limiter keeps them under 0 after MP3 encoding.
  'alimiter=limit=0.7:attack=5:release=50:level=false'].join(',');
const known = new Set(SCRIPTS.map(([n]) => n));
let made = 0, kept = 0;
const files = readdirSync(RAW).filter((f) => /\.(m4a|mp3|wav|aac|ogg|opus|amr|webm|3gp)$/i.test(f));
if (!files.length) console.log(`No recordings in ${RAW}/ yet.`);
for (const f of files) {
  // Windows hides extensions, so a take renamed to "en-what.m4a" often arrives as en-what.m4a.m4a: accept that too.
  const m = f.toLowerCase().match(/^(te|en)-([a-z0-9]+(?:-[a-z0-9]+)*)(?:\.[a-z0-9]+)+$/);
  if (!m) { console.log(`skipped ${f}: name it like te-what.m4a or en-atlas-sugar.m4a`); continue; }
  const [, lang, name] = m, out = outPath(lang, name);
  if (!force && existsSync(out) && statSync(out).mtimeMs > statSync(`${RAW}/${f}`).mtimeMs) { kept++; continue; }
  mkdirSync(dirname(out), { recursive: true });
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', `${RAW}/${f}`, '-af', filters, '-ac', '1', '-ar', '44100', '-b:a', '96k', out], { stdio: 'inherit' });
  const secs = execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', out]).toString().trim();
  console.log(`${f} → ${out} (${(+secs).toFixed(1)} s)${known.has(name) ? '' : '   note: not in the Script Book list'}`);
  made++;
}
if (kept) console.log(`${kept} recording(s) already up to date (use --force to redo them).`);

// Summary: which scripts still need a take, per language.
const missing = { te: [], en: [] };
for (const [name] of SCRIPTS) for (const l of LANGS) if (!existsSync(outPath(l, name))) missing[l].push(name);
const total = SCRIPTS.length;
console.log(`\nRecorded: Telugu ${total - missing.te.length}/${total}, English ${total - missing.en.length}/${total}.`);
for (const l of LANGS) if (missing[l].length) console.log(`Still to record in ${l === 'te' ? 'Telugu' : 'English'} (${missing[l].length}): ${missing[l].map((n) => `${l}-${n}`).join(', ')}`);
if (made) console.log('Done. Reload the page and press Listen.');
