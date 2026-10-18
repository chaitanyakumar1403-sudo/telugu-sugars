import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ChevronDown, ScanText, Search } from 'lucide-react';
import { BY, CATS, CODES, CON, DISH, GR, ING, byName, decodeLabel, hay, type GroupId, type Ingredient } from '../data/atlasData';
import AtlasMap, { type ColourMode } from '../components/atlas/AtlasMap';
import AtlasDetail from '../components/atlas/AtlasDetail';
import SafetyCheck from '../components/atlas/SafetyCheck';
import ProductGrid from '../components/atlas/ProductGrid';
import { LevelPill } from '../components/atlas/atlasUi';

type Tab = 'products' | 'check' | 'decode' | 'map';

const TABS: { id: Tab; label: string }[] = [
  { id: 'products', label: 'Products' },
  { id: 'check', label: 'Ingredients & additives' },
  { id: 'decode', label: 'Label decoder' },
  { id: 'map', label: 'Connections' },
];

const MODES: { id: ColourMode; label: string }[] = [
  { id: 'type', label: 'Type' },
  { id: 'inf', label: 'Infants' },
  { id: 'youth', label: 'Youth' },
  { id: 'mid', label: 'Middle-aged' },
  { id: 'old', label: 'Older adults' },
];

const QUICK = ['d-maggi', 'd-dietcoke', 'sugar', 'maltodextrin', 'aspartame', 'c-glycemic'];
const FACE: Record<GroupId, string> = { inf: '👶', youth: '🧒', mid: '🧑', old: '🧓' };
const FLOATING: [string, string, string][] = [
  ['maltodextrin', 'right-[6%] top-[14%]', '0s'],
  ['E951', 'right-[2%] top-[30%]', '1.2s'],
  ['invert syrup', 'right-[22%] top-[48%]', '2.1s'],
  ['INS 635', 'right-[4%] top-[60%]', '0.6s'],
  ['150d', 'right-[16%] top-[78%]', '1.7s'],
];
const STEPS = [
  'Find your packet: type its name, or tap a picture below.',
  'Choose who is eating it: a baby, a child, you, or a grandparent.',
  'Look at the colour: green is fine, orange means eat less, red means avoid.',
];
const SAMPLE = 'Refined wheat flour (maida), palm oil, salt, flavour enhancer (INS 627, INS 631), sugar, maltodextrin, antioxidant (INS 319), colour (150d)';

const label = 'font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500';

/** Paste an ingredient list; every Atlas ingredient found is rated for the chosen age group. */
const LabelDecoder: React.FC<{ group: GroupId; onOpen: (id: string) => void }> = ({ group, onOpen }) => {
  const [text, setText] = useState('');
  const ids = useMemo(() => decodeLabel(text), [text]);
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      <div className="panel flex flex-col p-5 sm:p-6">
        <label htmlFor="decode" className="flex items-center gap-2 text-sm font-bold text-white">
          <ScanText className="h-4 w-4 text-amber-500" /> Paste the ingredients list from a packet
        </label>
        <textarea
          id="decode"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          placeholder="Ingredients: Sugar, wheat flour, palm oil, emulsifier (INS 322)…"
          className="mt-3 w-full flex-1 resize-y rounded-xl border border-white/10 bg-scrim/30 p-4 text-base text-white placeholder:text-slate-500 focus:border-amber-400/60 focus:outline-none sm:text-sm"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <button onClick={() => setText(SAMPLE)} className="rounded-full border border-amber-500/50 px-4 py-1.5 text-xs font-bold text-amber-400 transition-colors hover:bg-amber-500/10">
            Try a sample label
          </button>
          {text && (
            <button onClick={() => setText('')} className="rounded-full border border-white/10 px-4 py-1.5 text-xs font-semibold text-slate-300 hover:text-white">
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="panel p-5 sm:p-6" aria-live="polite">
        <p className={label}>{text ? `${ids.length} found in the Atlas` : 'Results'}</p>
        {!text && <p className="mt-3 text-sm text-slate-400">Names, E-numbers and INS codes are all recognised, such as “INS 471”, “E-951” or “(322)”.</p>}
        {text && !ids.length && <p className="mt-3 text-sm text-slate-400">Nothing recognised yet. Check the spelling, or search the name above.</p>}
        <ul className="mt-3 divide-y divide-white/[0.06]">
          {ids.map((id) => {
            const [lv, note] = (BY[id] as Ingredient).r[group];
            return (
              <li key={id}>
                <button onClick={() => onOpen(id)} className="group w-full py-3 text-left">
                  <span className="flex items-start justify-between gap-3">
                    <span className="text-sm font-semibold text-white group-hover:text-amber-300">{BY[id].name}</span>
                    <LevelPill level={lv} />
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-slate-400">{note}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export const AtlasPage: React.FC = () => {
  const [tab, setTab] = useState<Tab>('products');
  const [group, setGroup] = useState<GroupId>('mid');
  const [mode, setMode] = useState<ColourMode>('type');
  const [sel, setSel] = useState<string | null>('maltodextrin');
  const [catF, setCatF] = useState('all');
  const [query, setQuery] = useState('');
  const [find, setFind] = useState('');
  const [visible, setVisible] = useState<Set<string>>(() => new Set(Object.keys(BY)));
  const [checkSel, setCheckSel] = useState('maltodextrin');
  const tabsRef = useRef<HTMLDivElement>(null);
  const g = GR.find((x) => x.id === group)!;

  const matchIds = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? [...visible].filter((id) => hay(BY[id]).includes(q)) : null;
  }, [query, visible]);

  const found = useMemo(() => {
    const q = find.trim().toLowerCase();
    return q ? Object.values(BY).filter((x) => hay(x).includes(q)).sort(byName).slice(0, 8) : [];
  }, [find]);

  const select = (id: string) => {
    if (!visible.has(id)) setCatF('all');
    setSel(id);
  };

  // When a group filter hides the selection, fall back to the first ingredient in that group.
  const onFiltered = useCallback((vis: Set<string>) => {
    setVisible(vis);
    setSel((cur) => (cur && vis.has(cur) ? cur : ING.filter((i) => vis.has(i.id)).sort(byName)[0]?.id ?? null));
  }, []);

  const showTabs = () => requestAnimationFrame(() => tabsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));

  const openCheck = (id: string) => {
    setCheckSel(id);
    setTab('check');
    showTabs();
  };

  // Concerns live on the map; ingredients and dishes open the safety check
  const goTo = (id: string) => {
    setFind('');
    if (BY[id].kind === 'con') { setCatF('all'); setSel(id); setTab('map'); showTabs(); }
    else openCheck(id);
  };

  const stats: [number, string][] = [
    [ING.length, 'ingredients and additives'],
    [DISH.length, 'products and dishes'],
    [CODES.size, 'INS codes decoded'],
    [CON.length, 'health concerns'],
  ];

  return (
    <div className="pb-20">
      {/* Hero */}
      <section className="atlas-hero container relative pt-12 sm:pt-16">
        <div aria-hidden="true" className="absolute inset-0 hidden lg:block">
          {FLOATING.map(([t, pos, d]) => (
            <span key={t} className={`float-tag ${pos}`} style={{ '--d': d } as React.CSSProperties}>{t}</span>
          ))}
        </div>

        <p className="reveal font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-500">
          Interactive · {ING.length} ingredients · {DISH.length} products
        </p>
        <h1 className="reveal display-title mt-4 text-[clamp(2rem,10.5vw,8rem)] text-white" style={{ '--d': '80ms' } as React.CSSProperties}>
          Ingredient <span className="accent">Atlas</span>
        </h1>
        <p className="reveal mt-6 max-w-2xl text-lg leading-relaxed text-slate-300" style={{ '--d': '160ms' } as React.CSSProperties}>
          Pick a product you buy, or an ingredient on its label. See every sugar, sweetener, colour, preservative and
          E-number inside, and what it means for infants, youth, middle-aged and older adults.
        </p>

        {/* Search */}
        <div className="reveal relative z-30 mt-8 max-w-2xl" style={{ '--d': '220ms' } as React.CSSProperties}>
          <Search className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-500" />
          <input
            type="search"
            value={find}
            onChange={(e) => setFind(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && found[0]) goTo(found[0].id); }}
            placeholder="Search Diet Coke, maltodextrin, E951, 635…"
            aria-label="Search products, ingredients, E-numbers or concerns"
            className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-4 pl-12 pr-4 text-base text-white shadow-xl shadow-black/20 placeholder:text-slate-500 focus:border-amber-500/70 focus:outline-none"
          />
          {found.length > 0 && (
            <ul className="panel absolute inset-x-0 top-full mt-2 overflow-hidden bg-(--bg-panel) p-1.5">
              {found.map((x) => (
                <li key={x.id}>
                  <button onClick={() => goTo(x.id)} className="flex w-full items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm text-slate-200 hover:bg-amber-500/10 hover:text-white">
                    <span>{x.name}</span>
                    <span className={label}>{x.kind === 'con' ? 'Concern' : x.kind === 'dish' ? 'Product' : 'Ingredient'}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="reveal mt-4 flex flex-wrap gap-2" style={{ '--d': '260ms' } as React.CSSProperties}>
          {QUICK.map((id) => (
            <button
              key={id}
              onClick={() => goTo(id)}
              className="rounded-full border border-white/12 bg-white/[0.04] px-3.5 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:border-amber-500/60 hover:text-amber-300"
            >
              {BY[id].name}
            </button>
          ))}
        </div>

        {/* How to use */}
        <h2 className="reveal mt-12 font-sans text-base font-bold text-white">How to use it, in 3 steps</h2>
        <ol className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={i} className="reveal panel flex items-start gap-3 p-4" style={{ '--d': `${i * 80}ms` } as React.CSSProperties}>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-[#fff] shadow-lg shadow-amber-500/30">{i + 1}</span>
              <p className="text-sm font-medium leading-snug text-slate-200">{s}</p>
            </li>
          ))}
        </ol>

        {/* Stats */}
        <dl className="reveal mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map(([n, l]) => (
            <div key={l} className="flex flex-col-reverse">
              <dt className="mt-2 text-xs text-slate-400">{l}</dt>
              <dd className="font-display text-5xl font-extrabold leading-none text-amber-500 sm:text-6xl">{n}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Sticky tabs + who's eating */}
      <div ref={tabsRef} className="sticky top-[72px] z-40 mt-14 scroll-mt-[72px] border-y border-white/[0.06] bg-(--bg-obsidian)/85 backdrop-blur-xl">
        <div className="container flex flex-col gap-3 py-3 lg:flex-row lg:items-end lg:justify-between">
          <div role="tablist" aria-label="Atlas views" className="no-scrollbar flex w-fit max-w-full gap-1 overflow-x-auto rounded-full border border-white/10 bg-white/[0.03] p-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={`shrink-0 whitespace-nowrap rounded-full px-3.5 py-2 text-[13px] font-semibold transition-colors ${
                  tab === t.id ? 'bg-amber-500 text-[#fff] shadow-lg shadow-amber-500/30' : 'text-slate-300 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="flex min-w-0 flex-col gap-1.5">
            <span className="pl-1 text-xs font-bold text-white" id="whos-eating">Who’s eating?</span>
            <div role="group" aria-labelledby="whos-eating" className="no-scrollbar flex gap-1 overflow-x-auto rounded-full border border-white/10 bg-white/[0.03] p-1">
              {GR.map((x) => (
                <button
                  key={x.id}
                  aria-pressed={group === x.id}
                  onClick={() => setGroup(x.id)}
                  className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                    group === x.id ? 'bg-amber-500 text-[#fff]' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <span aria-hidden="true">{FACE[x.id]}</span>
                  {x.name}
                  <span className="hidden text-[10px] opacity-75 xl:inline">{x.age}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container pt-8">
        {tab === 'products' && <ProductGrid group={group} groupLabel={`${g.name} (${g.age})`} onOpen={openCheck} />}

        {tab === 'check' && <SafetyCheck checkSel={checkSel} onPick={setCheckSel} focus={group} />}

        {tab === 'decode' && <LabelDecoder group={group} onOpen={openCheck} />}

        {tab === 'map' && (
          <>
            {/* Toolbar */}
            <div className="flex flex-col gap-4 pb-6 lg:flex-row lg:items-end">
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
                          ? 'border-amber-500 bg-amber-500 text-[#fff]'
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
        )}

        <div className="notice mt-14 px-5 py-4">
          <p className="text-xs leading-relaxed text-slate-400">
            General guidance based on public health advice from WHO, the NHS, paediatric bodies and food regulators. It does not
            replace a doctor or dietitian. Allergies, medicines and medical conditions change the answer for any one person.
            Additive rules differ by country, so check FSSAI rules in India. Product labels are abridged snapshots of Indian
            packs and sugar figures are approximate. Recipes change, so always read the pack in your hand.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AtlasPage;
