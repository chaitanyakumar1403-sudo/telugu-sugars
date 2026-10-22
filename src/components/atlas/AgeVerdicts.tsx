import React from 'react';
import { BY, GR, LV, type GroupId, type Ingredient, type Level } from '../../data/atlasData';
import { LEVEL_BORDER, LevelPill } from './atlasUi';
import { useAtlasText } from './useAtlasText';

export interface AgeRow { id: GroupId; level: Level; why: string[] }

/** For each age: the strictest verdict among the label's ingredients, and the ingredients that set it. */
export function ageRows(ids: string[]): AgeRow[] {
  return GR.map((g) => {
    let level: Level = 'ok', why: string[] = [];
    ids.forEach((id) => {
      const r = (BY[id] as Ingredient | undefined)?.r?.[g.id];
      if (!r) return;
      if (LV[r[0]].o > LV[level].o) { level = r[0]; why = [id]; }
      else if (r[0] === level && level !== 'ok') why.push(id);
    });
    return { id: g.id, level, why: why.slice(0, 3) };
  });
}

/** "Who can eat this?": one tile per age with the verdict and why. Never a single "safe / not safe". */
export const AgeVerdicts: React.FC<{ ids: string[]; focus?: GroupId }> = ({ ids, focus }) => {
  const A = useAtlasText();
  return (
    <div className="mt-4">
      <h3 className="text-sm font-bold text-white">{A.t('ages_title')}</h3>
      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {ageRows(ids).map((r) => (
          <div key={r.id} className={`rounded-xl border border-white/10 border-l-4 bg-white/[0.02] p-3.5 ${LEVEL_BORDER[r.level]} ${r.id === focus ? 'ring-2 ring-amber-500/60' : ''}`}>
            <div className="flex items-start justify-between gap-2">
              <span className="text-sm font-bold text-white">{A.groupName(r.id)}</span>
              <LevelPill level={r.level} />
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
              {r.why.length ? A.t('ages_why', { list: r.why.map(A.name).join(', ') }) : A.t('ages_clean')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgeVerdicts;
