import React, { useCallback, useMemo, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { BY, CATS, ING, byName, hay } from '../data/atlasData';
import AtlasMap, { type ColourMode } from '../components/atlas/AtlasMap';
import AtlasDetail from '../components/atlas/AtlasDetail';
import SafetyCheck from '../components/atlas/SafetyCheck';

const MODES: { id: ColourMode; label: string }[] = [
  { id: 'type', label: 'Type' },
  { id: 'inf', label: 'Infants' },
  { id: 'youth', label: 'Youth' },
  { id: 'mid', label: 'Middle-aged' },
  { id: 'old', label: 'Older adults' },
];

const label = 'font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500';

export const AtlasPage: React.FC = () => {
  const [tab, setTab] = useState<'map' | 'check'>('map');
  const [mode, setMode] = useState<ColourMode>('type');
  const [sel, setSel] = useState<string | null>('maltodextrin');
  const [catF, setCatF] = useState('all');
  const [query, setQuery] = useState('');
  const [visible, setVisible] = useState<Set<string>>(() => new Set(Object.keys(BY)));
  const [checkSel, setCheckSel] = useState('maltodextrin');

  const matchIds = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? [...visible].filter((id) => hay(BY[id]).includes(q)) : null;
  }, [query, visible]);

  const select = (id: string) => {
    if (!visible.has(id)) setCatF('all');
    setSel(id);
  };

  // When a group filter hides the selection, fall back to the first ingredient in that group.
  const onFiltered = useCallback((vis: Set<string>) => {
    setVisible(vis);
    setSel((cur) => (cur && vis.has(cur) ? cur : ING.filter((i) => vis.has(i.id)).sort(byName)[0]?.id ?? null));
  }, []);

  const openCheck = (id: string) => {
    setCheckSel(id);
    setTab('check');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container pb-16 pt-10 sm:pt-14">
      {/* Title row */}
      <header className="flex flex-col gap-6 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-amber-400">Interactive · {ING.length} ingredients</p>
          <h1 className="mt-3 font-display text-4xl font-extrabold leading-[1.05] text-white sm:text-6xl">Ingredient Atlas</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-400">
            Maltodextrin, sweeteners, colours, preservatives and E-numbers — see how each connects to health concerns,
            then check it for infants, youth, middle-aged and older adults.
          </p>
        </div>
        <div role="tablist" aria-label="Atlas views" className="flex w-full shrink-0 rounded-full border border-white/10 bg-white/[0.03] p-1 sm:w-auto">
          {(['map', 'check'] as const).map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={`flex-1 rounded-full px-5 py-2 text-sm font-semibold transition-colors sm:flex-none ${
                tab === t ? 'bg-amber-400 text-black' : 'text-slate-300 hover:text-white'
              }`}
            >
              {t === 'map' ? 'Relationship map' : 'Age safety check'}
            </button>
          ))}
        </div>
      </header>

      {tab === 'map' ? (
        <>
          {/* Toolbar */}
          <div className="flex flex-col gap-4 py-6 lg:flex-row lg:items-end">
            <label className="flex flex-1 flex-col gap-1.5 lg:max-w-sm">
              <span className={label}>Search</span>
              <span className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && matchIds?.length) { select(matchIds[0]); setQuery(''); }
                  }}
                  placeholder="Name, E-number or concern"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-24 text-base text-white placeholder:text-slate-500 focus:border-amber-400/60 focus:outline-none sm:text-sm"
                />
                {matchIds && (
                  <span aria-live="polite" className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[11px] text-amber-300/80">
                    {matchIds.length} {matchIds.length === 1 ? 'match' : 'matches'}
                  </span>
                )}
              </span>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className={label}>Group</span>
              <span className="relative">
                <select
                  value={catF}
                  onChange={(e) => setCatF(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-white/10 bg-(--bg-panel) py-2.5 pl-3.5 pr-10 text-sm text-white focus:border-amber-400/60 focus:outline-none lg:w-64"
                >
                  <option value="all">All groups ({ING.length})</option>
                  {CATS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({ING.filter((i) => i.cat === c.id).length})
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              </span>
            </label>

            <div className="flex flex-col gap-1.5">
              <span className={label} id="colour-by">Colour by</span>
              <div role="group" aria-labelledby="colour-by" className="flex flex-wrap gap-1.5">
                {MODES.map((m) => (
                  <button
                    key={m.id}
                    aria-pressed={mode === m.id}
                    onClick={() => setMode(m.id)}
                    className={`rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors ${
                      mode === m.id
                        ? 'border-amber-400 bg-amber-400 text-black'
                        : 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/25 hover:text-white'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <AtlasMap mode={mode} sel={sel} catF={catF} matchIds={matchIds} onSelect={select} onFiltered={onFiltered} />
            <AtlasDetail sel={sel} onSelect={select} onOpenCheck={openCheck} />
          </div>
        </>
      ) : (
        <div className="pt-6">
          <SafetyCheck checkSel={checkSel} onPick={setCheckSel} />
        </div>
      )}

      <p className="mt-10 max-w-4xl text-xs leading-relaxed text-slate-500">
        General guidance based on public health advice from WHO, the NHS, paediatric bodies and food regulators. It does not
        replace a doctor or dietitian. Allergies, medicines and medical conditions change the answer for any one person.
        Additive rules differ by country — check FSSAI rules in India. Packaged product examples are built from typical
        ingredient lists and real products vary.
      </p>
    </div>
  );
};

export default AtlasPage;
