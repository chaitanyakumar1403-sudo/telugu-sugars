import React, { useRef, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { BY, CATS, DISH, GR, ING, dishRating, hay, tsp, type AtlasItem, type GroupId, type Level } from '../../data/atlasData';
import { Chip, LEVEL_BORDER, LevelPill } from './atlasUi';
import { useAtlasText } from './useAtlasText';
import ShareButton from './ShareButton';
import ListenButton from '../common/ListenButton';
import { ATLAS_REC } from './recordings';

interface SafetyCheckProps {
  checkSel: string;
  onPick: (id: string) => void;
  /** Age group to highlight, from the Atlas "Who's eating?" control */
  focus?: GroupId;
}

export const SafetyCheck: React.FC<SafetyCheckProps> = ({ checkSel, onPick, focus }) => {
  const A = useAtlasText();
  const [q, setQ] = useState('');
  const [listOpen, setListOpen] = useState(true);
  const resultRef = useRef<HTMLDivElement>(null);
  const query = q.trim().toLowerCase();

  const blocks: { title: string; items: AtlasItem[] }[] = [
    ...CATS.map((c) => ({ title: A.cat(c.id), items: ING.filter((i) => i.cat === c.id).sort(A.byName).map((i) => BY[i.id]) })),
    { title: A.t('c_menu'), items: DISH.filter((d) => !d.pack).map((d) => BY[d.id]) },
    { title: A.t('c_packs'), items: DISH.filter((d) => d.pack).map((d) => BY[d.id]) },
  ]
    .map((b) => ({ ...b, items: b.items.filter((x) => !query || hay(x).includes(query)) }))
    .filter((b) => b.items.length);

  const n = BY[checkSel];

  // Every age's verdict for the picked item, with what drives it: the read-aloud text and the share card.
  const rows = (x: AtlasItem): { id: GroupId; level: Level; why: string[] }[] =>
    x.kind === 'con' ? [] : GR.map((g) => {
      if (x.kind === 'ing') return { id: g.id, level: x.r[g.id][0], why: [] };
      const dr = dishRating(x, g.id);
      return { id: g.id, level: dr.level, why: dr.drivers.slice(0, 3).map((d) => A.name(d.id)) };
    });
  const spoken = () => `${A.name(n.id)}. ` + rows(n).map((r) => `${A.groupName(r.id)}: ${A.level(r.level)}${n.kind === 'ing' ? '. ' + A.note(n.id, r.id) : ''}.`).join(' ');

  // Close the list after a pick and bring the result into view so the click visibly lands
  const pick = (id: string) => {
    onPick(id);
    setListOpen(false);
    setQ('');
    requestAnimationFrame(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
      {/* Picker */}
      <div className="panel flex flex-col lg:sticky lg:top-44 lg:max-h-[calc(100vh-12rem)]">
        <label className="relative m-3 block">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="search"
            value={q}
            onChange={(e) => { setQ(e.target.value); setListOpen(true); }}
            onFocus={() => setListOpen(true)}
            placeholder={A.t('c_ph')}
            aria-label={A.t('c_aria')}
            className="w-full rounded-xl border border-white/10 bg-scrim/30 py-2.5 pl-10 pr-3 text-base text-white placeholder:text-slate-500 focus:border-amber-400/60 focus:outline-none sm:text-sm"
          />
        </label>
        {!listOpen && (
          <button
            onClick={() => setListOpen(true)}
            aria-expanded={false}
            className="mx-3 mb-3 flex items-center justify-between gap-3 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-left text-sm"
          >
            <span className="font-semibold text-amber-200">{A.name(n.id)}</span>
            <span className="flex items-center gap-1 text-xs text-slate-400">{A.t('c_change')} <ChevronDown className="h-4 w-4" /></span>
          </button>
        )}
        {listOpen && <div className="max-h-[50vh] overflow-y-auto px-3 pb-3 lg:max-h-none">
          {blocks.length === 0 && <p className="p-2 text-sm text-slate-400">{A.t('c_none')}</p>}
          {blocks.map((b) => (
            <div key={b.title} className="mb-2">
              <h3 className="px-2 pb-1 pt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">{b.title}</h3>
              {b.items.map((x) => (
                <button
                  key={x.id}
                  onClick={() => pick(x.id)}
                  aria-current={x.id === checkSel || undefined}
                  className={`block w-full rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors ${
                    x.id === checkSel ? 'bg-amber-400/15 font-semibold text-amber-200' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {A.name(x.id)}
                </button>
              ))}
            </div>
          ))}
        </div>}
      </div>

      {/* Result */}
      <div ref={resultRef} className="panel scroll-mt-44 p-6 sm:p-8">
        <h2 className="font-display text-3xl font-extrabold text-white">{A.name(n.id)}</h2>
        {n.kind !== 'con' && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <ListenButton rec={ATLAS_REC[n.id]} text={spoken} className="relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-white/15 px-5 py-2.5 text-sm font-bold text-white transition hover:border-amber-500/60" />
            <ShareButton
              path="/atlas"
              slug={n.id}
              card={() => ({
                title: A.name(n.id),
                source: A.t('card_src_atlas'),
                tsp: n.kind === 'dish' && n.sugar > 0 ? tsp(n.sugar) : null,
                tspLabel: n.kind === 'dish' ? A.t('card_tspserv', { s: A.serving(n) }) : '',
                rows: rows(n).map((r) => ({ age: A.groupName(r.id), level: r.level, word: A.level(r.level), why: r.why.length ? A.t('ages_why', { list: r.why.join(', ') }) : '' })),
              })}
            />
          </div>
        )}
        {n.kind === 'ing' && (
          <p className="mt-2 text-sm text-slate-400">
            {A.t('c_concerns', {
              cat: A.cat(n.cat),
              list: n.tags.length ? n.tags.map((t) => (A.te ? A.name(t) : A.name(t).toLowerCase())).join(', ') : A.t('c_none_flagged'),
            })}
          </p>
        )}
        {n.kind === 'dish' && (
          <>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              {A.t(n.pack ? 'c_pack_note' : 'c_menu_note')}
              {A.t('c_strict')}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">{n.ing.map((i) => <Chip key={i} id={i} />)}</div>
          </>
        )}

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {GR.map((g) => {
            const level = n.kind === 'ing' ? n.r[g.id][0] : n.kind === 'dish' ? dishRating(n, g.id).level : 'ok';
            return (
              <div key={g.id} className={`rounded-xl border border-white/10 border-l-4 bg-white/[0.02] p-5 transition-shadow ${LEVEL_BORDER[level]} ${g.id === focus ? 'ring-2 ring-amber-500/70 shadow-lg shadow-amber-500/20' : ''}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-white">{A.groupName(g.id)}</h3>
                    <p className="text-xs text-slate-500">{A.groupAge(g.id)}</p>
                  </div>
                  <LevelPill level={level} />
                </div>
                {n.kind === 'ing' && <p className="mt-3 text-sm leading-relaxed text-slate-300">{A.note(n.id, g.id)}</p>}
                {n.kind === 'dish' && (() => {
                  const dr = dishRating(n, g.id);
                  return dr.drivers.length ? (
                    <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-300">
                      {dr.drivers.map((d) => (
                        <li key={d.id}>
                          <b className="text-white">{A.name(d.id)}</b> · {A.te ? A.level(d.lv) : A.level(d.lv).toLowerCase()}. {A.note(d.id, g.id)}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 text-sm text-slate-300">{A.t('c_all_ok')}</p>
                  );
                })()}
              </div>
            );
          })}
        </div>

        <p className="mt-6 text-xs leading-relaxed text-slate-500">
          {A.t('c_doctor')}
        </p>
      </div>
    </div>
  );
};

export default SafetyCheck;
