// Founder page motion: the choreography that CSS alone can't do (FLIP flights, gravity, pointer parallax,
// the voice meter). Every function is a no-op when the reader prefers reduced motion.
import { useEffect } from 'react';

export const calm = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const BOUNCE = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
const SETTLE = 'cubic-bezier(0.2, 0.8, 0.2, 1)';

/**
 * The ధ moment: the block arcs out of its slot and lands exactly where the stamp's ధ is printed, growing to its
 * size; the case takes the hit (an ink ring and a small jolt); every other letter falls out of the case with gravity.
 */
export function stampFound(board: HTMLElement, hit: HTMLElement, target: HTMLElement | null) {
  if (calm()) return;
  const tray = board.querySelector<HTMLElement>('.lb-case');
  if (!tray) return;
  const r = hit.getBoundingClientRect();
  const tr = (target ?? tray).getBoundingClientRect();
  const dx = tr.left + tr.width / 2 - (r.left + r.width / 2);
  const dy = tr.top + tr.height / 2 - (r.top + r.height / 2);
  const s = target ? Math.max(1.6, (tr.height * 0.9) / r.height) : 3;
  hit.animate(
    [
      { transform: 'translate(0, 0) scale(1) rotate(0deg)', offset: 0 },
      { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 90}px) scale(${(s * 0.75).toFixed(2)}) rotate(-16deg)`, offset: 0.45 },
      { transform: `translate(${dx}px, ${dy}px) scale(${s.toFixed(2)}) rotate(-2deg)`, opacity: 1, offset: 0.82 },
      { transform: `translate(${dx}px, ${dy}px) scale(${(s * 1.06).toFixed(2)}) rotate(-2deg)`, opacity: 0 },
    ],
    { duration: 900, easing: 'cubic-bezier(0.5, 0, 0.2, 1)', fill: 'forwards' },
  );
  // The landing: a jolt through the case and an orange ink ring
  tray.animate(
    [{ transform: 'none' }, { transform: 'translate(0, 5px) rotate(0.4deg)' }, { transform: 'translate(0, -2px)' }, { transform: 'none' }],
    { duration: 360, delay: 740, easing: 'ease-out' },
  );
  const ink = document.createElement('i');
  ink.className = 'lb-ink';
  const c = tray.getBoundingClientRect();
  ink.style.left = `${tr.left + tr.width / 2 - c.left}px`;
  ink.style.top = `${tr.top + tr.height / 2 - c.top}px`;
  tray.appendChild(ink);
  ink.animate([{ transform: 'translate(-50%, -50%) scale(0.2)', opacity: 0.7 }, { transform: 'translate(-50%, -50%) scale(4.5)', opacity: 0 }], {
    duration: 900, delay: 760, easing: 'cubic-bezier(0.1, 0.7, 0.2, 1)', fill: 'both',
  });
  // Everyone else falls out of the case
  board.querySelectorAll<HTMLElement>('.tile:not(.hit)').forEach((t) => {
    const vx = rnd(-160, 160);
    const spin = rnd(-220, 220);
    t.animate(
      [
        { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
        { transform: `translate(${vx * 0.3}px, -${rnd(10, 40)}px) rotate(${spin * 0.2}deg)`, opacity: 1, offset: 0.2 },
        { transform: `translate(${vx}px, ${rnd(420, 720)}px) rotate(${spin}deg)`, opacity: 0 },
      ],
      { duration: rnd(900, 1300), delay: rnd(0, 260), easing: 'cubic-bezier(0.45, 0, 0.9, 0.55)', fill: 'forwards' },
    );
  });
}

/** Letters are typeset into the case one by one, in chart order, each landing with a small bounce. */
export function typeset(board: HTMLElement) {
  if (calm()) return;
  board.querySelectorAll<HTMLElement>('.tile').forEach((t, i) => {
    t.animate(
      [{ transform: `translate(${rnd(-14, 14)}px, -90px) rotate(${rnd(-24, 24)}deg)`, opacity: 0 }, { transform: 'none', opacity: 1 }],
      { duration: 620, delay: 160 + i * 16, easing: BOUNCE, fill: 'backwards' },
    );
  });
}

/** Keys near the pointer rise, like a hand running over a type case. Returns the cleanup. */
export function keyLift(tray: HTMLElement) {
  if (calm() || !matchMedia('(hover: hover)').matches) return () => {};
  const tiles = Array.from(tray.querySelectorAll<HTMLElement>('.tile'));
  let raf = 0;
  let px = -1e4, py = -1e4;
  const paint = () => {
    raf = 0;
    for (const t of tiles) {
      const r = t.getBoundingClientRect();
      const d = Math.hypot(r.left + r.width / 2 - px, r.top + r.height / 2 - py);
      const k = Math.max(0, 1 - d / 150);
      t.style.setProperty('--lift', `${(k * k * 11).toFixed(1)}px`);
    }
  };
  const move = (e: PointerEvent) => { px = e.clientX; py = e.clientY; if (!raf) raf = requestAnimationFrame(paint); };
  const leave = () => { px = py = -1e4; if (!raf) raf = requestAnimationFrame(paint); };
  tray.addEventListener('pointermove', move);
  tray.addEventListener('pointerleave', leave);
  return () => { tray.removeEventListener('pointermove', move); tray.removeEventListener('pointerleave', leave); cancelAnimationFrame(raf); };
}

/**
 * The desk is set: the postcard drops in and the paperclip clips on, the postmark lands with a thud,
 * the field notes slide in from the left and type themselves out, the record player slides in and spins up.
 */
export function setDesk(desk: HTMLElement) {
  if (calm()) return;
  const q = (s: string) => desk.querySelector<HTMLElement>(s);
  const card = q('.o-card'), notes = q('.o-notes'), rec = q('.o-record');
  card?.animate([{ transform: 'translateY(-160px) rotate(-7deg) scale(1.04)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 900, easing: BOUNCE, fill: 'backwards' });
  q('.clip')?.animate([{ transform: 'translateY(-40px) rotate(-25deg)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 520, delay: 620, easing: BOUNCE, fill: 'backwards' });
  q('.pmark')?.animate([{ transform: 'scale(2.1) rotate(-34deg)', opacity: 0 }, { transform: 'scale(0.94)', opacity: 1, offset: 0.7 }, { transform: 'none', opacity: 1 }], { duration: 420, delay: 820, easing: 'ease-out', fill: 'backwards' });
  card?.animate([{ transform: 'none' }, { transform: 'translateY(3px)' }, { transform: 'none' }], { duration: 220, delay: 1060, easing: 'ease-out' });
  q('.stamp')?.animate([{ transform: 'rotate(-6deg) scale(0.9)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 700, delay: 260, easing: BOUNCE, fill: 'backwards' });
  notes?.animate([{ transform: 'translateX(-130%) rotate(-12deg)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 950, delay: 300, easing: SETTLE, fill: 'backwards' });
  rec?.animate([{ transform: 'translateX(130%) rotate(12deg)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 950, delay: 420, easing: SETTLE, fill: 'backwards' });
  q('.vinyl')?.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(900deg)' }], { duration: 2200, delay: 520, easing: 'cubic-bezier(0.1, 0.6, 0.3, 1)' });
  // Field notes type themselves out, row by row; then the day squares light up one by one
  desk.querySelectorAll<HTMLElement>('.kv dd').forEach((dd, i) => {
    const n = Math.max(4, (dd.textContent || '').length);
    dd.animate([{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0 0 0)' }], { duration: n * 32, delay: 900 + i * 260, easing: `steps(${n})`, fill: 'backwards' });
  });
  desk.querySelectorAll<HTMLElement>('.grid i.on').forEach((sq, i) => {
    sq.animate([{ background: 'rgba(255,255,255,0.09)', transform: 'scale(0.6)' }, { transform: 'none' }], { duration: 260, delay: 1900 + i * 34, easing: BOUNCE, fill: 'backwards' });
  });
}

/** The desk leans toward the pointer, each object at its own depth (desktop only, not while a card is focused). */
export function useTilt(desk: HTMLElement | null, on: boolean) {
  useEffect(() => {
    if (!desk || !on || calm() || !matchMedia('(hover: hover) and (min-width: 900px)').matches) return;
    let raf = 0;
    let x = 0, y = 0;
    const paint = () => { raf = 0; desk.style.setProperty('--px', x.toFixed(3)); desk.style.setProperty('--py', y.toFixed(3)); };
    const move = (e: PointerEvent) => {
      const r = desk.getBoundingClientRect();
      x = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
      y = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
      if (!raf) raf = requestAnimationFrame(paint);
    };
    const leave = () => { x = y = 0; if (!raf) raf = requestAnimationFrame(paint); };
    addEventListener('pointermove', move);
    desk.addEventListener('pointerleave', leave);
    return () => {
      removeEventListener('pointermove', move);
      desk.removeEventListener('pointerleave', leave);
      cancelAnimationFrame(raf);
      desk.style.removeProperty('--px');
      desk.style.removeProperty('--py');
    };
  }, [desk, on]);
}

/** Sections play their entrance once, when they first come into view. */
export function useEntrances(root: HTMLElement | null) {
  useEffect(() => {
    if (!root) return;
    const els = root.querySelectorAll('.sec');
    if (calm() || typeof IntersectionObserver === 'undefined') { els.forEach((el) => el.classList.add('in')); return; }
    const io = new IntersectionObserver((list) => list.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.18 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [root]);
}

/**
 * Bars that move with Dheeraj's actual recorded voice: the audio element is routed through an analyser
 * (one AudioContext for the page) and each bar follows a band of the spectrum.
 */
let ctx: AudioContext | null = null;
export function meter(audio: HTMLAudioElement, bars: HTMLElement[]) {
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC || !bars.length || calm()) return () => {};
  ctx = ctx || new AC();
  ctx.resume().catch(() => {});
  const src = ctx.createMediaElementSource(audio);
  const an = ctx.createAnalyser();
  an.fftSize = 128;
  an.smoothingTimeConstant = 0.72;
  src.connect(an);
  an.connect(ctx.destination);
  const data = new Uint8Array(an.frequencyBinCount);
  let raf = 0;
  const draw = () => {
    an.getByteFrequencyData(data);
    bars.forEach((b, i) => {
      const v = data[2 + i * 2] / 255;
      b.style.transform = `scaleY(${(0.12 + v * 0.95).toFixed(3)})`;
    });
    raf = requestAnimationFrame(draw);
  };
  draw();
  return () => {
    cancelAnimationFrame(raf);
    try { src.disconnect(); an.disconnect(); } catch { /* already gone */ }
    bars.forEach((b) => { b.style.transform = ''; });
  };
}
