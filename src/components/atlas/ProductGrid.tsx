import React, { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { BY, DISH, LV, dishRating, tsp, type Dish, type GroupId, type Ingredient, type PackShape, type Shelf } from '../../data/atlasData';
import { LevelPill } from './atlasUi';
import { useAtlasText } from './useAtlasText';

const initials = (name: string) => name.replace(/[^A-Za-z\s-]/g, '').split(/[\s-]+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
const isCode = (id: string) => (BY[id] as Ingredient).alt?.some((a) => /^e\d{3}/.test(a)) ?? false;
export const additiveCount = (d: Dish) => d.ing.filter(isCode).length;

// Body size + corner shape per pack type; colour comes from the product
const BODY: Record<PackShape, string> = {
  can: 'h-28 w-16 rounded-[14px]',
  slimcan: 'h-32 w-12 rounded-[12px]',
  pouch: 'h-24 w-24 rounded-t-[26px] rounded-b-[10px]',
  biscuit: 'h-16 w-40 rounded-xl',
  bar: 'h-14 w-40 rounded-md',
  jar: 'h-24 w-20 rounded-[18px]',
  bottle: 'h-28 w-14 rounded-t-[22px] rounded-b-[14px]',
  tub: 'h-24 w-20 rounded-b-[14px] rounded-t-md',
  loaf: 'h-20 w-32 rounded-t-[40px] rounded-b-md',
  bowl: 'h-16 w-36 rounded-b-[80px] rounded-t-md',
  plate: 'h-16 w-36 rounded-[50%]',
  mug: 'h-20 w-20 rounded-b-2xl rounded-t-md',
};

const PackArt: React.FC<{ d: Dish }> = ({ d }) => {
  const [shape, c, band] = d.art;
  return (
    <div className="relative flex h-40 items-center justify-center transition-transform duration-500 ease-[var(--ease-spring)] group-hover:-translate-y-1.5 group-hover:rotate-[-3deg]">
      {/* Steam for hot drinks */}
      {shape === 'mug' && (
        <span aria-hidden="true" className="absolute top-3 flex gap-2 text-amber-200/60">
          <span className="steam">∫</span><span className="steam">∫</span>
        </span>
      )}
      {/* Neck / cap */}
      {(shape === 'bottle' || shape === 'jar') && (
        <span className={`absolute rounded-t-md ${shape === 'bottle' ? 'h-5 w-6 bg-[#fff]' : 'h-4 w-16 bg-[#3a2a22]'}`} style={{ top: shape === 'bottle' ? 'calc(50% - 4.4rem)' : 'calc(50% - 3.6rem)' }} />
      )}
      <div
        className={`relative flex items-center justify-center overflow-hidden ${BODY[shape]}`}
        style={{ background: `linear-gradient(160deg, color-mix(in srgb, ${c} 85%, #fff), ${c} 45%, color-mix(in srgb, ${c} 65%, #000))`, boxShadow: `0 22px 40px -18px ${c}` }}
      >
        {(shape === 'can' || shape === 'slimcan' || shape === 'tub') && <span className="absolute inset-x-0 top-0 h-3 bg-gradient-to-b from-[#fff] to-[#cbd5e1]" />}
        {shape === 'pouch' && <span className="absolute inset-x-0 top-0 h-2.5 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.35)_0_3px,transparent_3px_6px)]" />}
        {band && <span className="absolute inset-x-0 top-1/2 h-[30%] -translate-y-1/2 opacity-80" style={{ background: band }} />}
        {shape === 'mug' && <span className="absolute -right-5 top-4 h-10 w-6 rounded-r-full border-[6px] border-l-0" style={{ borderColor: c }} />}
        <span className={`relative font-display font-extrabold tracking-tight drop-shadow ${band ? 'text-[color:var(--pack-ink)]' : 'text-[#fff]'} ${shape === 'slimcan' ? 'text-sm' : 'text-xl'}`} style={{ '--pack-ink': c } as React.CSSProperties}>
          {initials(d.name)}
        </span>
      </div>
    </div>
  );
};

/** One square per teaspoon of sugar, like sugar cubes. */
const SugarMeter: React.FC<{ d: Dish }> = ({ d }) => {
  const A = useAtlasText();
  const t = tsp(d.sugar);
  const cubes = Math.min(10, Math.ceil(t));
  return (
    <div className="mt-4 flex items-start gap-3">
      <div className="flex min-h-4 flex-wrap gap-1 pt-1" aria-hidden="true">
        {cubes === 0 ? <span className="h-3.5 w-3.5 rounded-[4px] border border-dashed border-white/20" /> : Array.from({ length: cubes }, (_, i) => (
          <span key={i} className="h-3.5 w-3.5 rounded-[4px] border border-white/30 bg-gradient-to-br from-[#fff]/90 to-[#ffd2ad]/60 shadow-sm" />
        ))}
      </div>
      <p className="leading-tight">
        <span className="block text-sm font-bold text-white">{d.pack ? '~' : ''}{A.t('p_tsp', { t })}</span>
        <span className="text-xs text-slate-500">{A.t('p_per', { s: A.serving(d) })}</span>
      </p>
    </div>
  );
};

type Filter = 'all' | Shelf;
type Sort = 'sugar' | 'strict' | 'additives' | 'az';
const FILTERS: Filter[] = ['all', 'drink', 'snack', 'sweet', 'mix', 'home'];
const inFilter = (f: Filter) => (d: Dish) => f === 'all' || d.shelf === f;

export const ProductGrid: React.FC<{ group: GroupId; onOpen: (id: string) => void }> = ({ group, onOpen }) => {
  const A = useAtlasText();
  const groupLabel = A.groupFor(group);
  const [filter, setFilter] = useState<Filter>('all');
  const [sort, setSort] = useState<Sort>('sugar');

  const rows = useMemo(() => {
    const list = DISH.filter(inFilter(filter)).map((d) => ({ d, r: dishRating(d, group) }));
    type Row = (typeof list)[0];
    const name = (a: Row, b: Row) => A.byName(a.d, b.d);
    const by: Record<Sort, (a: Row, b: Row) => number> = {
      sugar: (a, b) => b.d.sugar - a.d.sugar || name(a, b),
      strict: (a, b) => LV[b.r.level].o - LV[a.r.level].o || name(a, b),
      additives: (a, b) => additiveCount(b.d) - additiveCount(a.d) || name(a, b),
      az: name,
    };
    return list.sort(by[sort]);
  }, [filter, sort, group, A.te]); // A-to-Z follows the language on screen

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label={A.t('p_filter_aria')}>
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-semibold transition-all ${
                filter === f ? 'border-white bg-white text-(--bg-obsidian) shadow-lg shadow-white/10' : 'border-white/15 text-slate-200 hover:-translate-y-0.5 hover:border-amber-500/60'
              }`}
            >
              {A.t(`p_${f}`)} <span className="ml-0.5 opacity-60">{DISH.filter(inFilter(f)).length}</span>
            </button>
          ))}
        </div>
        <label className="relative">
          <span className="sr-only">{A.t('p_sort')}</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="appearance-none rounded-xl border border-white/10 bg-(--bg-panel) py-2 pl-3.5 pr-9 text-xs font-semibold text-white focus:border-amber-400/60 focus:outline-none"
          >
            <option value="sugar">{A.t('p_sort_sugar')}</option>
            <option value="strict">{A.t('p_sort_strict')}</option>
            <option value="additives">{A.t('p_sort_add')}</option>
            <option value="az">{A.t('p_sort_az')}</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
        </label>
      </div>

      <p className="mt-4 text-xs text-slate-400">
        {A.t('p_count', { n: rows.length, age: groupLabel })}
      </p>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {rows.map(({ d, r }) => {
          const tags = [...new Set(d.ing.flatMap((id) => (BY[id] as Ingredient).tags))].slice(0, 3);
          const adds = additiveCount(d);
          return (
            <button
              key={d.id}
              onClick={() => onOpen(d.id)}
              aria-label={A.t('p_aria', { name: A.name(d.id), verdict: A.level(r.level), age: groupLabel })}
              className="panel panel-hover group flex flex-col overflow-hidden text-left"
            >
              {/* Shelf: darker stage behind the pack */}
              <div className="relative bg-[radial-gradient(ellipse_at_50%_70%,rgba(255,255,255,0.06),transparent_70%)] px-4 pt-4" style={{ backgroundColor: 'color-mix(in srgb, var(--bg-obsidian) 55%, transparent)' }}>
                <div className="flex items-start justify-between gap-2">
                  <span className="rounded-md border border-white/10 bg-white/[0.05] px-2 py-1 text-xs font-bold text-slate-300">
                    {d.brand ?? A.t(d.pack ? 'p_typical' : 'p_home')}
                  </span>
                  {d.pack && (
                    <span className="rounded-full border border-dashed border-amber-500/70 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                      {A.t('p_check')}
                    </span>
                  )}
                </div>
                <PackArt d={d} />
              </div>

              <div className="flex flex-1 flex-col p-5 pt-4">
                <h3 className="font-sans text-lg font-bold leading-snug text-white transition-colors group-hover:text-amber-300">{A.name(d.id)}</h3>
                <p className="mt-0.5 text-xs text-slate-500">{A.serving(d)} · {A.t('p_ings', { n: d.ing.length })}</p>
                <SugarMeter d={d} />
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {tags.map((t) => (
                    <span key={t} className="rounded-full bg-white/[0.07] px-2.5 py-1 text-[10px] font-semibold text-slate-200">{A.name(t)}</span>
                  ))}
                </div>
                <div className="mt-auto flex items-center justify-between pt-5">
                  <LevelPill level={r.level} />
                  <span className="text-xs font-semibold text-slate-300">{adds === 1 ? A.t('p_add1') : A.t('p_adds', { n: adds })}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProductGrid;
