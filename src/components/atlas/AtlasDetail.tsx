import React from 'react';
import { ArrowRight } from 'lucide-react';
import { BY, CATNAME, DISH, GR, ING, dishRating, type AtlasItem, type Level } from '../../data/atlasData';
import { Chip, Eyebrow, LevelPill } from './atlasUi';

interface AtlasDetailProps {
  sel: string | null;
  onSelect: (id: string) => void;
  onOpenCheck: (id: string) => void;
}

const AgeRows: React.FC<{ n: AtlasItem }> = ({ n }) => (
  <ul className="mt-5 divide-y divide-white/[0.06]">
    {GR.map((g) => {
      let lv: Level, note: string;
      if (n.kind === 'ing') [lv, note] = n.r[g.id];
      else {
        const dr = dishRating(n as Extract<AtlasItem, { kind: 'dish' }>, g.id);
        lv = dr.level;
        note = dr.drivers.length
          ? 'Held back by ' + dr.drivers.map((d) => BY[d.id].name.toLowerCase()).join(', ') + '.'
          : 'Every ingredient is suitable.';
      }
      return (
        <li key={g.id} className="py-3.5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white">{g.name}</p>
              <p className="text-xs text-slate-500">{g.age}</p>
            </div>
            <LevelPill level={lv} />
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-300">{note}</p>
        </li>
      );
    })}
  </ul>
);

export const AtlasDetail: React.FC<AtlasDetailProps> = ({ sel, onSelect, onOpenCheck }) => {
  const shell = 'panel p-6 lg:sticky lg:top-44 lg:max-h-[calc(100vh-12rem)] lg:overflow-y-auto';

  if (!sel) {
    return (
      <aside className={shell} aria-live="polite">
        <Eyebrow>Nothing selected</Eyebrow>
        <p className="mt-2 text-sm text-slate-300">Click any node to see what it connects to and how it rates for each age group.</p>
      </aside>
    );
  }

  const n = BY[sel];
  const openCheck = (
    <button
      onClick={() => onOpenCheck(n.id)}
      className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-amber-400 px-5 py-2.5 text-sm font-bold text-[#fff] transition-colors hover:bg-amber-300"
    >
      Open full safety check <ArrowRight className="h-4 w-4" />
    </button>
  );

  return (
    <aside className={shell} aria-live="polite">
      {n.kind === 'con' && (
        <>
          <Eyebrow>Health concern</Eyebrow>
          <h2 className="mt-2 font-display text-2xl font-extrabold text-white">{n.name}</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">{n.d}</p>
          <p className="mt-6 mb-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-slate-500">Connected items</p>
          <div className="flex flex-wrap gap-2">
            {ING.filter((i) => i.tags.includes(n.id)).map((i) => <Chip key={i.id} id={i.id} onClick={onSelect} />)}
          </div>
        </>
      )}

      {n.kind === 'ing' && (
        <>
          <Eyebrow>{CATNAME[n.cat]}</Eyebrow>
          <h2 className="mt-2 font-display text-2xl font-extrabold text-white">{n.name}</h2>
          {n.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {n.tags.map((t) => <Chip key={t} id={t} onClick={onSelect} />)}
            </div>
          )}
          <AgeRows n={n} />
          {DISH.some((d) => d.ing.includes(n.id)) && (
            <>
              <p className="mt-4 mb-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-slate-500">Found in sample dishes</p>
              <div className="flex flex-wrap gap-2">
                {DISH.filter((d) => d.ing.includes(n.id)).map((d) => <Chip key={d.id} id={d.id} onClick={onSelect} />)}
              </div>
            </>
          )}
          {openCheck}
        </>
      )}

      {n.kind === 'dish' && (
        <>
          <Eyebrow>{n.pack ? 'Packaged product example' : 'Sample menu item'}</Eyebrow>
          <h2 className="mt-2 font-display text-2xl font-extrabold text-white">{n.name}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {n.ing.map((t) => <Chip key={t} id={t} onClick={onSelect} />)}
          </div>
          <AgeRows n={n} />
          {openCheck}
        </>
      )}
    </aside>
  );
};

export default AtlasDetail;
