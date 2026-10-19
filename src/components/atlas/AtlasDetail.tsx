import React from 'react';
import { ArrowRight } from 'lucide-react';
import { BY, DISH, GR, ING, dishRating, type AtlasItem, type Level } from '../../data/atlasData';
import { Chip, Eyebrow, LevelPill } from './atlasUi';
import { useAtlasText } from './useAtlasText';

interface AtlasDetailProps {
  sel: string | null;
  onSelect: (id: string) => void;
  onOpenCheck: (id: string) => void;
}

const AgeRows: React.FC<{ n: AtlasItem }> = ({ n }) => {
  const A = useAtlasText();
  return (
    <ul className="mt-5 divide-y divide-white/[0.06]">
      {GR.map((g) => {
        let lv: Level, note: string;
        if (n.kind === 'ing') [lv, note] = [n.r[g.id][0], A.note(n.id, g.id)];
        else {
          const dr = dishRating(n as Extract<AtlasItem, { kind: 'dish' }>, g.id);
          lv = dr.level;
          note = dr.drivers.length
            ? A.t('d_held', { list: dr.drivers.map((d) => (A.te ? A.name(d.id) : A.name(d.id).toLowerCase())).join(', ') })
            : A.t('d_all_ok');
        }
        return (
          <li key={g.id} className="py-3.5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white">{A.groupName(g.id)}</p>
                <p className="text-xs text-slate-500">{A.groupAge(g.id)}</p>
              </div>
              <LevelPill level={lv} />
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-300">{note}</p>
          </li>
        );
      })}
    </ul>
  );
};

export const AtlasDetail: React.FC<AtlasDetailProps> = ({ sel, onSelect, onOpenCheck }) => {
  const A = useAtlasText();
  const shell = 'panel p-6 lg:sticky lg:top-44 lg:max-h-[calc(100vh-12rem)] lg:overflow-y-auto';

  if (!sel) {
    return (
      <aside className={shell} aria-live="polite">
        <Eyebrow>{A.t('d_none')}</Eyebrow>
        <p className="mt-2 text-sm text-slate-300">{A.t('d_none_hint')}</p>
      </aside>
    );
  }

  const n = BY[sel];
  const title = <h2 className="mt-2 font-display text-2xl font-extrabold text-white">{A.name(n.id)}</h2>;
  const openCheck = (
    <button
      onClick={() => onOpenCheck(n.id)}
      className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-amber-400 px-5 py-2.5 text-sm font-bold text-[#fff] transition-colors hover:bg-amber-300"
    >
      {A.t('d_open')} <ArrowRight className="h-4 w-4" />
    </button>
  );

  return (
    <aside className={shell} aria-live="polite">
      {n.kind === 'con' && (
        <>
          <Eyebrow>{A.t('m_leg_con')}</Eyebrow>
          {title}
          <p className="mt-3 text-sm leading-relaxed text-slate-300">{A.desc(n.id)}</p>
          <p className="mt-6 mb-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-slate-500">{A.t('d_connected')}</p>
          <div className="flex flex-wrap gap-2">
            {ING.filter((i) => i.tags.includes(n.id)).map((i) => <Chip key={i.id} id={i.id} onClick={onSelect} />)}
          </div>
        </>
      )}

      {n.kind === 'ing' && (
        <>
          <Eyebrow>{A.cat(n.cat)}</Eyebrow>
          {title}
          {n.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {n.tags.map((t) => <Chip key={t} id={t} onClick={onSelect} />)}
            </div>
          )}
          <AgeRows n={n} />
          {DISH.some((d) => d.ing.includes(n.id)) && (
            <>
              <p className="mt-4 mb-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-slate-500">{A.t('d_found')}</p>
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
          <Eyebrow>{A.t(n.pack ? 'd_pack' : 'd_menu')}</Eyebrow>
          {title}
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
