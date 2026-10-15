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
  limit: '#fcd34d',
  care: '#38bdf8',
  avoid: '#fb7185',
};

const PILL: Record<Level, string> = {
  ok: 'bg-emerald-500/10 text-emerald-300 ring-emerald-400/30',
  limit: 'bg-amber-500/10 text-amber-200 ring-amber-300/30',
  care: 'bg-sky-500/10 text-sky-300 ring-sky-400/30',
  avoid: 'bg-rose-500/10 text-rose-300 ring-rose-400/30',
};

export const LEVEL_BORDER: Record<Level, string> = {
  ok: 'border-l-emerald-400',
  limit: 'border-l-amber-300',
  care: 'border-l-sky-400',
  avoid: 'border-l-rose-400',
};

export const LevelPill: React.FC<{ level: Level }> = ({ level }) => (
  <span
    className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ring-1 ring-inset ${PILL[level]}`}
  >
    {LV[level].t}
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
