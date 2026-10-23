import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ChevronDown, ScanLine, ScanText, Search } from 'lucide-react';
import { BY, CATS, CODES, CON, DISH, GR, ING, byName, decodeLabel, hay, tsp, type GroupId, type Ingredient } from '../data/atlasData';
import AtlasMap, { type ColourMode } from '../components/atlas/AtlasMap';
import AtlasDetail from '../components/atlas/AtlasDetail';
import SafetyCheck from '../components/atlas/SafetyCheck';
import ProductGrid from '../components/atlas/ProductGrid';
import { LevelPill } from '../components/atlas/atlasUi';
import { useAtlasText } from '../components/atlas/useAtlasText';
import AgeVerdicts, { ageRows } from '../components/atlas/AgeVerdicts';
import Scanner, { type BarcodeResult } from '../components/atlas/Scanner';
import ShareButton from '../components/atlas/ShareButton';
import ListenButton from '../components/common/ListenButton';
import { lookupBarcode } from '../lib/scan';

type Tab = 'products' | 'check' | 'decode' | 'map';

const TABS: Tab[] = ['products', 'check', 'decode', 'map'];
const MODES: ColourMode[] = ['type', 'inf', 'youth', 'mid', 'old'];

const QUICK = ['d-maggi', 'd-dietcoke', 'sugar', 'maltodextrin', 'aspartame', 'c-glycemic'];
const FACE: Record<GroupId, string> = { inf: '👶', youth: '🧒', mid: '🧑', old: '🧓' };
const STEP = ['అ', 'ఆ', 'ఇ']; // steps are lettered, never numbered (house style)
const SAMPLE = 'Refined wheat flour (maida), palm oil, salt, flavour enhancer (INS 627, INS 631), sugar, maltodextrin, antioxidant (INS 319), colour (150d)';

const label = 'text-xs text-slate-500';

/** Where the decoder text came from, when it wasn't typed: a photo of the pack, or a barcode lookup. */
export type LabelSource = { kind: 'photo'; sugar100: number | null } | { kind: 'off'; code: string; name: string; sugar100: number | null } | null;

/** Paste, type or scan an ingredient list; every Atlas ingredient found is rated for every age. */
const LabelDecoder: React.FC<{
  group: GroupId;
  onOpen: (id: string) => void;
  text: string;
  setText: (s: string) => void;
  source: LabelSource;
  onScan: () => void;
}> = ({ group, onOpen, text, setText, source, onScan }) => {
  const A = useAtlasText();
  const ids = useMemo(() => decodeLabel(text), [text]);
  const name = source?.kind === 'off' ? source.name : A.t('card_label');
  const sugar = source?.sugar100 ?? null;
  const spoken = () => `${name}. ` + ageRows(ids).map((r) => `${A.groupName(r.id)}: ${A.level(r.level)}.`).join(' ');
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      <div className="panel flex flex-col p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onScan}
            className="inline-flex min-h-12 items-center gap-2 rounded-full bg-amber-500 px-5 py-3 text-sm font-bold text-[#fff] transition"
          >
            <ScanLine className="h-5 w-5" /> {A.t('x_scan')}
          </button>
          <span className="min-w-48 flex-1 text-xs leading-relaxed text-slate-400">{A.t('x_or')}</span>
        </div>
        <label htmlFor="decode" className="flex items-center gap-2 text-sm font-bold text-white">
          <ScanText className="h-4 w-4 text-amber-500" /> {A.t('x_label')}
        </label>
        <textarea
          id="decode"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          placeholder={A.t('x_ph')}
          className="mt-3 w-full flex-1 resize-y rounded-xl border border-white/10 bg-scrim/30 p-4 text-base text-white placeholder:text-slate-500 focus:border-amber-400/60 focus:outline-none sm:text-sm"
        />
        {source && (
          <p className="mt-3 rounded-xl bg-amber-500/10 px-4 py-2.5 text-xs leading-relaxed text-amber-200">
            {source.kind === 'photo' ? A.t('src_photo') : A.t('src_off', { code: source.code, name: source.name })}
          </p>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          <button onClick={() => setText(SAMPLE)} className="rounded-full border border-amber-500/50 px-4 py-1.5 text-xs font-bold text-amber-400 transition-colors hover:bg-amber-500/10">
            {A.t('x_try')}
          </button>
          {text && (
            <button onClick={() => setText('')} className="rounded-full border border-white/10 px-4 py-1.5 text-xs font-semibold text-slate-300 hover:text-white">
              {A.t('x_clear')}
            </button>
          )}
        </div>
      </div>

      <div className="panel p-5 sm:p-6" aria-live="polite">
        <p className={label}>{text ? A.t('x_found', { n: ids.length }) : A.t('x_results')}</p>
        {!text && <p className="mt-3 text-sm text-slate-400">{A.t('x_hint')}</p>}
        {text && !ids.length && <p className="mt-3 text-sm text-slate-400">{A.t('x_none')}</p>}
        {text && sugar != null && (
          <div className="mt-3 flex items-center gap-4 rounded-2xl bg-amber-500/10 p-4">
            <span className="font-display text-4xl font-extrabold leading-none text-amber-400">{tsp(sugar)}</span>
            <span className="text-sm text-slate-200">
              <b>{A.t('sug_title')}</b> · {A.t('sug_tsp', { g: Math.round(sugar * 10) / 10 })}
              <small className="mt-1 block text-xs text-slate-400">{A.t(source?.kind === 'photo' ? 'sug_photo' : 'sug_off')}</small>
            </span>
          </div>
        )}
        {ids.length > 0 && <AgeVerdicts ids={ids} focus={group} />}
        <ul className="mt-3 divide-y divide-white/[0.06]">
          {ids.map((id) => {
            const lv = (BY[id] as Ingredient).r[group][0];
            return (
              <li key={id}>
                <button onClick={() => onOpen(id)} className="group w-full py-3 text-left">
                  <span className="flex items-start justify-between gap-3">
                    <span className="text-sm font-semibold text-white group-hover:text-amber-300">{A.name(id)}</span>
                    <LevelPill level={lv} />
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-slate-400">{A.note(id, group)}</span>
                </button>
              </li>
            );
          })}
        </ul>
        {ids.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <ShareButton
              path="/atlas"
              slug={source?.kind === 'off' ? source.name : 'label'}
              card={() => ({
                title: name,
                source: A.t(source?.kind === 'photo' ? 'card_src_photo' : source?.kind === 'off' ? 'card_src_off' : 'card_src_atlas'),
                tsp: sugar != null ? sugar / 4 : null,
                tspLabel: A.t('card_tsp100'),
                rows: ageRows(ids).map((r) => ({
                  age: A.groupName(r.id), level: r.level, word: A.level(r.level),
                  why: r.why.length ? A.t('ages_why', { list: r.why.map(A.name).join(', ') }) : '',
                })),
              })}
            />
            <ListenButton text={spoken} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-bold text-white transition hover:border-amber-500/60" />
          </div>
        )}
      </div>
    </div>
  );
};

export const AtlasPage: React.FC = () => {
  const A = useAtlasText();
  const [tab, setTab] = useState<Tab>('products');
  const [group, setGroup] = useState<GroupId>('mid');
  const [mode, setMode] = useState<ColourMode>('type');
  const [sel, setSel] = useState<string | null>('maltodextrin');
  const [catF, setCatF] = useState('all');
  const [query, setQuery] = useState('');
  const [find, setFind] = useState('');
  const [visible, setVisible] = useState<Set<string>>(() => new Set(Object.keys(BY)));
  const [checkSel, setCheckSel] = useState('maltodextrin');
  const [decodeText, setDecodeText] = useState('');
  const [source, setSource] = useState<LabelSource>(null);
  const [scanning, setScanning] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);

  const matchIds = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? [...visible].filter((id) => hay(BY[id]).includes(q)) : null;
  }, [query, visible]);

  const found = useMemo(() => {
    const q = find.trim().toLowerCase();
    return q ? Object.values(BY).filter((x) => hay(x).includes(q)).sort(A.byName).slice(0, 8) : [];
  }, [find, A.te]); // results are sorted by the name on screen

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

  // A scanned or looked-up label lands in the decoder.
  const fillDecoder = (text: string, src: LabelSource) => {
    setDecodeText(text);
    setSource(src);
    setTab('decode');
    showTabs();
  };
  // A barcode: our own packs first (Dish.ean, from a pack in hand), then Open Food Facts.
  const onBarcode = async (code: string): Promise<BarcodeResult> => {
    const mine = DISH.find((d) => d.ean?.includes(code));
    if (mine) { openCheck(mine.id); return true; }
    const r = await lookupBarcode(code);
    if (r.status === 'found') { fillDecoder(r.text, { kind: 'off', code, name: r.name, sugar100: r.sugar100 }); return true; }
    if (r.status === 'noing') return { name: r.name };
    if (r.status === 'offline') return { offline: true };
    return false;
  };

  // Concerns live on the map; ingredients and dishes open the safety check
  const goTo = (id: string) => {
    setFind('');
    if (BY[id].kind === 'con') { setCatF('all'); setSel(id); setTab('map'); showTabs(); }
    else openCheck(id);
  };

  const stats: [number, string][] = [
    [ING.length, A.t('a_stat_i')],
    [DISH.length, A.t('a_stat_p')],
    [CODES.size, A.t('a_stat_ins')],
    [CON.length, A.t('a_stat_c')],
  ];

  return (
    <div className="pb-20">
      {/* Hero */}
      <section className="container relative pt-12 sm:pt-16">

        <p className="text-sm font-semibold text-amber-400">
          {A.t('a_kicker', { i: ING.length, p: DISH.length })}
        </p>
        <h1 className="display-title mt-2 text-[clamp(2.5rem,10.5vw,6.5rem)] text-white">
          {A.t('a_title')} <span className="accent">{A.t('a_accent')}</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
          {A.t('a_lede')}
        </p>

        {/* Search */}
        <div className="relative z-30 mt-8 max-w-2xl">
          <Search className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-500" />
          <input
            type="search"
            value={find}
            onChange={(e) => setFind(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && found[0]) goTo(found[0].id); }}
            placeholder={A.t('a_search_ph')}
            aria-label={A.t('a_search_aria')}
            className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-4 pl-12 pr-4 text-base text-white placeholder:text-slate-500 focus:border-amber-500/70 focus:outline-none"
          />
          {found.length > 0 && (
            <ul className="panel absolute inset-x-0 top-full mt-2 overflow-hidden p-1.5" style={{ background: 'var(--bg-panel)' }}>
              {found.map((x) => (
                <li key={x.id}>
                  <button onClick={() => goTo(x.id)} className="flex w-full items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm text-slate-200 hover:bg-amber-500/10 hover:text-white">
                    <span>{A.name(x.id)}</span>
                    <span className={label}>{A.t(`a_kind_${x.kind}`)}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {QUICK.map((id) => (
            <button
              key={id}
              onClick={() => goTo(id)}
              className="rounded-full border border-white/12 bg-white/[0.04] px-3.5 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:border-amber-500/60 hover:text-amber-300"
            >
              {A.name(id)}
            </button>
          ))}
        </div>

        {/* How to use */}
        <h2 className="mt-12 font-sans text-base font-bold text-white">{A.t('a_how')}</h2>
        <ol className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          {[A.t('a_how1'), A.t('a_how2'), A.t('a_how3')].map((s, i) => (
            <li key={i} className="panel flex items-start gap-3 p-4">
              <span aria-hidden="true" className="w-6 shrink-0 font-telugu text-xl font-bold leading-none text-amber-500">{STEP[i]}</span>
              <p className="text-sm font-medium leading-snug text-slate-200">{s}</p>
            </li>
          ))}
        </ol>

        {/* Stats */}
        <dl className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map(([n, l]) => (
            <div key={l} className="flex flex-col-reverse">
              <dt className="mt-2 text-xs text-slate-400">{l}</dt>
              <dd className="font-display text-5xl font-extrabold leading-none text-amber-500 sm:text-6xl">{n}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Sticky tabs + who's eating */}
      <div ref={tabsRef} className="sticky top-[72px] z-40 mt-14 scroll-mt-[72px] border-y border-white/[0.06] bg-(--bg-obsidian)">
        <div className="container flex flex-col gap-3 py-3 lg:flex-row lg:items-end lg:justify-between">
          <div role="tablist" aria-label={A.t('a_tabs_aria')} className="no-scrollbar flex w-fit max-w-full gap-1 overflow-x-auto rounded-full border border-white/10 bg-white/[0.03] p-1">
            {TABS.map((id) => (
              <button
                key={id}
                role="tab"
                aria-selected={tab === id}
                onClick={() => setTab(id)}
                className={`shrink-0 whitespace-nowrap rounded-full px-3.5 py-2 text-[13px] font-semibold transition-colors ${
                  tab === id ? 'bg-amber-500 text-[#fff]' : 'text-slate-300 hover:text-white'
                }`}
              >
                {A.t(`a_tab_${id}`)}
              </button>
            ))}
          </div>
          <div className="flex min-w-0 flex-col gap-1.5">
            <span className="pl-1 text-xs font-bold text-white" id="whos-eating">{A.t('a_whos_eating')}</span>
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
                  {A.groupName(x.id)}
                  <span className="hidden text-[10px] opacity-75 xl:inline">{A.groupAge(x.id)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container pt-8">
        {tab === 'products' && <ProductGrid group={group} onOpen={openCheck} />}

        {tab === 'check' && <SafetyCheck checkSel={checkSel} onPick={setCheckSel} focus={group} />}

        {tab === 'decode' && (
          <LabelDecoder
            group={group}
            onOpen={openCheck}
            text={decodeText}
            setText={(v) => { setDecodeText(v); if (!v.trim()) setSource(null); }}
            source={source}
            onScan={() => setScanning(true)}
          />
        )}

        {tab === 'map' && (
          <>
            {/* Toolbar */}
            <div className="flex flex-col gap-4 pb-6 lg:flex-row lg:items-end">
              <label className="flex flex-1 flex-col gap-1.5 lg:max-w-sm">
                <span className={label}>{A.t('m_search')}</span>
                <span className="relative">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && matchIds?.length) { select(matchIds[0]); setQuery(''); }
                    }}
                    placeholder={A.t('m_search_ph')}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-24 text-base text-white placeholder:text-slate-500 focus:border-amber-400/60 focus:outline-none sm:text-sm"
                  />
                  {matchIds && (
                    <span aria-live="polite" className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[11px] text-amber-300/80">
                      {A.t(matchIds.length === 1 ? 'm_match' : 'm_matches', { n: matchIds.length })}
                    </span>
                  )}
                </span>
              </label>

              <label className="flex flex-col gap-1.5">
                <span className={label}>{A.t('m_group')}</span>
                <span className="relative">
                  <select
                    value={catF}
                    onChange={(e) => setCatF(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-white/10 bg-(--bg-panel) py-2.5 pl-3.5 pr-10 text-sm text-white focus:border-amber-400/60 focus:outline-none lg:w-64"
                  >
                    <option value="all">{A.t('m_all_groups', { n: ING.length })}</option>
                    {CATS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {A.cat(c.id)} ({ING.filter((i) => i.cat === c.id).length})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                </span>
              </label>

              <div className="flex flex-col gap-1.5">
                <span className={label} id="colour-by">{A.t('m_colour_by')}</span>
                <div role="group" aria-labelledby="colour-by" className="flex flex-wrap gap-1.5">
                  {MODES.map((m) => (
                    <button
                      key={m}
                      aria-pressed={mode === m}
                      onClick={() => setMode(m)}
                      className={`rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors ${
                        mode === m
                          ? 'border-amber-500 bg-amber-500 text-[#fff]'
                          : 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/25 hover:text-white'
                      }`}
                    >
                      {m === 'type' ? A.t('m_type') : A.groupName(m)}
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
            {A.t('a_note')}
          </p>
        </div>
      </div>

      {/* Scan a pack, from any tab */}
      <button
        type="button"
        onClick={() => setScanning(true)}
        className="fixed bottom-[calc(16px+env(safe-area-inset-bottom,0px))] right-4 z-40 inline-flex min-h-13 items-center gap-2 rounded-full bg-amber-500 px-5 py-3 text-[15px] font-extrabold text-[#fff] transition lg:bottom-6"
      >
        <ScanLine className="h-5 w-5" /> {A.t('x_scan_short')}
      </button>
      <Scanner
        open={scanning}
        onClose={() => setScanning(false)}
        onBarcode={onBarcode}
        onText={(text, sugar100) => fillDecoder(text, { kind: 'photo', sugar100 })}
      />
    </div>
  );
};

export default AtlasPage;
