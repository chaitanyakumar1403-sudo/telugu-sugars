import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { BY, LVK, levelFor, type GroupId } from '../../data/atlasData';
import { applyFilter, buildGraph, clamp, resize, step, type Graph, type GNode } from './forceLayout';
import { LEVEL_FILL, TYPE_FILL } from './atlasUi';
import { useAtlasText } from './useAtlasText';

export type ColourMode = 'type' | GroupId;

interface AtlasMapProps {
  mode: ColourMode;
  sel: string | null;
  catF: string;
  matchIds: string[] | null;
  onSelect: (id: string) => void;
  onFiltered: (visible: Set<string>) => void;
}

export const AtlasMap: React.FC<AtlasMapProps> = ({ mode, sel, catF, matchIds, onSelect, onFiltered }) => {
  const A = useAtlasText();
  const stageRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const graph = useRef<Graph | null>(null);
  const drag = useRef<{ n: GNode; sx: number; sy: number; moved: boolean } | null>(null);
  const [, setTick] = useState(0);
  const redraw = () => setTick((t) => t + 1);

  // Build once the stage has a size; rescale on later resizes.
  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const measure = () => {
      const w = stage.clientWidth, h = stage.clientHeight;
      if (!w || !h) return;
      if (!graph.current) graph.current = buildGraph(w, h);
      else if (w !== graph.current.W || h !== graph.current.H) resize(graph.current, w, h);
      redraw();
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stage);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!graph.current) return;
    onFiltered(applyFilter(graph.current, catF));
    redraw();
    // onFiltered is a parent callback; re-running on its identity would re-settle the layout needlessly
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catF, graph.current]);

  const g = graph.current;

  const pt = (e: React.PointerEvent) => {
    const r = svgRef.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    const id = (e.target as Element).closest('[data-id]')?.getAttribute('data-id');
    if (!id || !g) return;
    const p = pt(e);
    drag.current = { n: g.nmap[id], sx: p.x, sy: p.y, moved: false };
    try { svgRef.current!.setPointerCapture(e.pointerId); } catch { /* capture is best-effort */ }
  };
  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const d = drag.current;
    if (!d || !g) return;
    const p = pt(e);
    if (!d.moved && Math.abs(p.x - d.sx) + Math.abs(p.y - d.sy) < 5) return;
    d.moved = true;
    d.n.x = p.x; d.n.y = p.y;
    clamp(g, d.n);
    for (let i = 0; i < 3; i++) step(g, 4, d.n);
    redraw();
  };
  const onPointerUp = () => {
    const d = drag.current;
    drag.current = null;
    if (d && !d.moved) onSelect(d.n.id);
  };

  // Highlight: search matches win, otherwise the selection and its neighbours.
  let set: Set<string> | null = null;
  if (matchIds) set = new Set(matchIds);
  else if (sel && g?.nmap[sel]) set = new Set([sel, ...Object.keys(g.nmap[sel].nb)]);

  const visible = new Set(g?.actN.map((n) => n.id));
  const crowded = (g?.actN.filter((n) => n.kind === 'ing').length ?? 0) > 34;
  const fillFor = (n: GNode) =>
    mode === 'type' || n.kind === 'con' ? TYPE_FILL[n.kind] : LEVEL_FILL[levelFor(BY[n.id], mode)!];
  const groupName = mode === 'type' ? '' : A.groupName(mode);

  return (
    <div
      ref={stageRef}
      className="relative h-[clamp(460px,72vh,820px)] overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(ellipse_at_center,var(--map-a)_0%,var(--map-b)_75%)]"
      style={{ touchAction: 'pan-y pinch-zoom' }}
    >
      {g && (
        <svg
          ref={svgRef}
          className="block h-full w-full select-none"
          role="img"
          aria-label={A.t('m_aria')}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={() => { drag.current = null; }}
          onKeyDown={(e) => {
            const id = (e.target as Element).closest('[data-id]')?.getAttribute('data-id');
            if (id && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onSelect(id); }
          }}
        >
          <g>
            {g.actL.map((l) => {
              const a = g.nmap[l.s], b = g.nmap[l.t];
              const on = !set || (matchIds ? set.has(l.s) && set.has(l.t) : l.s === sel || l.t === sel);
              return (
                <line
                  key={l.s + '>' + l.t}
                  x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                  className={`atlas-link ${on ? (set ? 'is-on' : '') : 'is-dim'}`}
                />
              );
            })}
          </g>
          <g>
            {g.nodes.filter((n) => visible.has(n.id)).map((n) => {
              const hl = set?.has(n.id);
              const cls = [
                'atlas-node',
                `k-${n.kind}`,
                n.id === sel && 'is-sel',
                set && !hl && 'is-dim',
                crowded && n.kind === 'ing' && !hl && n.id !== sel && 'no-label',
              ].filter(Boolean).join(' ');
              return (
                <g key={n.id} data-id={n.id} className={cls} transform={`translate(${n.x.toFixed(1)},${n.y.toFixed(1)})`} tabIndex={0} role="button" aria-label={A.name(n.id)}>
                  <circle className="hit" r={n.r + 8} />
                  {n.kind === 'dish'
                    ? <rect className="shape" x={-n.r} y={-n.r} width={n.r * 2} height={n.r * 2} rx={4} fill={fillFor(n)} />
                    : <circle className="shape" r={n.r} fill={fillFor(n)} />}
                  <text y={n.r + 13}>{A.name(n.id)}</text>
                </g>
              );
            })}
          </g>
        </svg>
      )}

      <div className="pointer-events-none absolute right-4 top-3 font-mono text-[11px] text-slate-500">
        {A.t('m_hint')}
      </div>

      <div className="pointer-events-none absolute inset-x-4 bottom-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
        {mode === 'type' ? (
          <>
            <Swatch color={TYPE_FILL.ing}>{A.t('m_leg_ing')}</Swatch>
            <Swatch color={TYPE_FILL.dish} square>{A.t('m_leg_dish')}</Swatch>
            <Swatch color={TYPE_FILL.con}>{A.t('m_leg_con')}</Swatch>
          </>
        ) : (
          <>
            <span className="font-semibold text-slate-300">{groupName}:</span>
            {LVK.map((k) => <Swatch key={k} color={LEVEL_FILL[k]}>{A.level(k)}</Swatch>)}
          </>
        )}
      </div>
    </div>
  );
};

const Swatch: React.FC<{ color: string; square?: boolean; children: React.ReactNode }> = ({ color, square, children }) => (
  <span className="inline-flex items-center gap-1.5">
    <i className={`inline-block h-2.5 w-2.5 ${square ? 'rounded-[2px]' : 'rounded-full'}`} style={{ background: color }} />
    {children}
  </span>
);

export default AtlasMap;
