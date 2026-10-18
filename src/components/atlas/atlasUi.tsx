import React from 'react';
import { BY, LV, type Level } from '../../data/atlasData';
import type { NodeKind } from './forceLayout';

export const TYPE_FILL: Record<NodeKind, string> = {
  ing: '#fb923c',
  dish: '#fde68a',
  con: '#d6d3d1',
};

export const LEVEL_FILL: Record<Level, string> = {
  ok: '#34d399',
  limit: '#ff7a1a',
  care: '#f2542d',
  avoid: '#e11d48',
};

const PILL: Record<Level, string> = {
  ok: 'bg-emerald-500/15 text-emerald-300 ring-emerald-400/40',
  limit: 'bg-amber-500/20 text-amber-300 ring-amber-500/50',
  care: 'bg-[#f2542d]/20 text-[#ff8a6b] ring-[#f2542d]/50',
  avoid: 'bg-rose-600/20 text-rose-300 ring-rose-500/50',
};

const SYMBOL: Record<Level, string> = { ok: '✓', limit: '!', care: '?', avoid: '✕' };

export const LEVEL_BORDER: Record<Level, string> = {
  ok: 'border-l-emerald-400',
  limit: 'border-l-amber-500',
  care: 'border-l-[#f2542d]',
  avoid: 'border-l-rose-500',
};

export const LevelPill: React.FC<{ level: Level }> = ({ level }) => (
  <span
    className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ring-1 ring-inset ${PILL[level]}`}
  >
    <span aria-hidden="true">{SYMBOL[level]}</span> {LV[level].t}
  </span>
);

export const Chip: React.FC<{ id: string; onClick?: (id: string) => void }> = ({ id, onClick }) =>
  onClick ? (
    <button
      onClick={() => onClick(id)}
      className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-slate-200 transition-colors hover:border-amber-400/50 hover:text-amber-200"
    >
      {BY[id].name}
    </button>
  ) : (
    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-slate-200">
      {BY[id].name}
    </span>
  );

export const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-amber-400/90">{children}</p>
);
