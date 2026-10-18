import React, { useRef, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { BY, CATNAME, CATS, DISH, GR, ING, LV, byName, dishRating, hay, type AtlasItem, type GroupId } from '../../data/atlasData';
import { Chip, LEVEL_BORDER, LevelPill } from './atlasUi';

interface SafetyCheckProps {
  checkSel: string;
  onPick: (id: string) => void;
  /** Age group to highlight, from the Atlas "Who's eating?" control */
  focus?: GroupId;
}

export const SafetyCheck: React.FC<SafetyCheckProps> = ({ checkSel, onPick, focus }) => {
  const [q, setQ] = useState('');
  const [listOpen, setListOpen] = useState(true);
  const resultRef = useRef<HTMLDivElement>(null);
  const query = q.trim().toLowerCase();

  const blocks: { title: string; items: AtlasItem[] }[] = [
    ...CATS.map((c) => ({ title: c.name, items: ING.filter((i) => i.cat === c.id).sort(byName).map((i) => BY[i.id]) })),
    { title: 'Menu examples', items: DISH.filter((d) => !d.pack).map((d) => BY[d.id]) },
    { title: 'Packaged product examples', items: DISH.filter((d) => d.pack).map((d) => BY[d.id]) },
  ]
    .map((b) => ({ ...b, items: b.items.filter((x) => !query || hay(x).includes(query)) }))
    .filter((b) => b.items.length);

  const n = BY[checkSel];

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
            placeholder="Try maltodextrin, E621 or tartrazine"
            aria-label="Find an ingredient, additive or dish"
            className="w-full rounded-xl border border-white/10 bg-scrim/30 py-2.5 pl-10 pr-3 text-base text-white placeholder:text-slate-500 focus:border-amber-400/60 focus:outline-none sm:text-sm"
          />
        </label>
        {!listOpen && (
          <button
            onClick={() => setListOpen(true)}
            aria-expanded={false}
            className="mx-3 mb-3 flex items-center justify-between gap-3 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-left text-sm"
          >
            <span className="font-semibold text-amber-200">{n.name}</span>
            <span className="flex items-center gap-1 text-xs text-slate-400">Change <ChevronDown className="h-4 w-4" /></span>
          </button>
        )}
        {listOpen && <div className="max-h-[50vh] overflow-y-auto px-3 pb-3 lg:max-h-none">
          {blocks.length === 0 && <p className="p-2 text-sm text-slate-400">No match. Try another name or E-number.</p>}
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
                  {x.name}
                </button>
              ))}
            </div>
          ))}
        </div>}
      </div>

      {/* Result */}
      <div ref={resultRef} className="panel scroll-mt-44 p-6 sm:p-8">
        <h2 className="font-display text-3xl font-extrabold text-white">{n.name}</h2>
        {n.kind === 'ing' && (
          <p className="mt-2 text-sm text-slate-400">
            {CATNAME[n.cat]}. Concerns: {n.tags.length ? n.tags.map((t) => BY[t].name.toLowerCase()).join(', ') : 'none flagged'}.
          </p>
        )}
        {n.kind === 'dish' && (
          <>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              {n.pack ? 'Packaged product example built from a typical ingredient list. Real products vary, so check the label. ' : 'Sample menu item. '}
              Each rating is the strictest one among its ingredients, so changing the recipe changes the result.
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
                    <h3 className="text-base font-bold text-white">{g.name}</h3>
                    <p className="text-xs text-slate-500">{g.age}</p>
                  </div>
                  <LevelPill level={level} />
                </div>
                {n.kind === 'ing' && <p className="mt-3 text-sm leading-relaxed text-slate-300">{n.r[g.id][1]}</p>}
                {n.kind === 'dish' && (() => {
                  const dr = dishRating(n, g.id);
                  return dr.drivers.length ? (
                    <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-300">
                      {dr.drivers.map((d) => (
                        <li key={d.id}>
                          <b className="text-white">{BY[d.id].name}</b> · {LV[d.lv].t.toLowerCase()}. {d.note}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 text-sm text-slate-300">Every ingredient is suitable for this group.</p>
                  );
                })()}
              </div>
            );
          })}
        </div>

        <p className="mt-6 text-xs leading-relaxed text-slate-500">
          Check with a doctor or dietitian if the person has an allergy, a chronic condition or takes regular medicine.
        </p>
      </div>
    </div>
  );
};

export default SafetyCheck;
