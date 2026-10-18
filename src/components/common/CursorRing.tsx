import React, { useEffect, useRef } from 'react';

const HOT = 'a, button, [role="tab"], input, select, textarea, label, summary';

/** Orange ring that trails the mouse and swells over anything clickable. Mouse/trackpad only. */
export const CursorRing: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !matchMedia('(pointer: fine)').matches) return;
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let x = -100, y = -100, rx = x, ry = y, raf = 0;

    const tick = () => {
      // Ease toward the pointer; snap when motion is reduced
      rx += (x - rx) * (still ? 1 : 0.22);
      ry += (y - ry) * (still ? 1 : 0.22);
      el.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = Math.abs(x - rx) + Math.abs(y - ry) > 0.1 ? requestAnimationFrame(tick) : 0;
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      x = e.clientX; y = e.clientY;
      el.classList.remove('is-hidden');
      el.classList.toggle('is-hot', !!(e.target as Element).closest?.(HOT));
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const down = () => el.classList.add('is-down');
    const up = () => el.classList.remove('is-down');
    const hide = () => el.classList.add('is-hidden');

    addEventListener('pointermove', move, { passive: true });
    addEventListener('pointerdown', down);
    addEventListener('pointerup', up);
    document.documentElement.addEventListener('pointerleave', hide);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('pointermove', move);
      removeEventListener('pointerdown', down);
      removeEventListener('pointerup', up);
      document.documentElement.removeEventListener('pointerleave', hide);
    };
  }, []);

  return <div ref={ref} aria-hidden="true" className="cursor-ring is-hidden" />;
};

export default CursorRing;
