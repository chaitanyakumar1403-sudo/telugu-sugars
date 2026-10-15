import { CON, ING, DISH } from '../../data/atlasData';

export type NodeKind = 'con' | 'ing' | 'dish';

export interface GNode {
  id: string;
  kind: NodeKind;
  label: string;
  r: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  nb: Record<string, true>;
}

export interface GLink {
  s: string;
  t: string;
}

export interface Graph {
  nodes: GNode[];
  links: GLink[];
  nmap: Record<string, GNode>;
  actN: GNode[];
  actL: GLink[];
  W: number;
  H: number;
}

export function buildGraph(W: number, H: number): Graph {
  const deg: Record<string, number> = {};
  const bump = (id: string) => { deg[id] = (deg[id] || 0) + 1; };
  const links: GLink[] = [];
  ING.forEach((i) => i.tags.forEach((t) => { links.push({ s: i.id, t }); bump(i.id); bump(t); }));
  DISH.forEach((d) => d.ing.forEach((i) => { links.push({ s: d.id, t: i }); bump(d.id); bump(i); }));

  const nodes: GNode[] = [];
  const nmap: Record<string, GNode> = {};
  const add = (id: string, kind: NodeKind, label: string) => {
    const r = kind === 'con' ? Math.min(12 + (deg[id] || 0) * 0.5, 22) : kind === 'dish' ? 10 : Math.min(6 + (deg[id] || 0) * 1.1, 10);
    const n: GNode = { id, kind, label, r, x: 0, y: 0, dx: 0, dy: 0, nb: {} };
    nodes.push(n);
    nmap[id] = n;
  };
  CON.forEach((c) => add(c.id, 'con', c.name));
  ING.forEach((i) => add(i.id, 'ing', i.name));
  DISH.forEach((d) => add(d.id, 'dish', d.name));
  links.forEach((l) => { nmap[l.s].nb[l.t] = true; nmap[l.t].nb[l.s] = true; });

  const g: Graph = { nodes, links, nmap, actN: nodes.slice(), actL: links.slice(), W, H };
  seed(g);
  settle(g, 340);
  return g;
}

/** Concerns on a ring, everything else near the average of what it links to (deterministic). */
function seed(g: Graph) {
  const { nmap, W, H } = g;
  const cx = W / 2, cy = H / 2, rad = Math.min(W, H) * 0.34;
  CON.forEach((c, i) => {
    const a = (i / CON.length) * Math.PI * 2 - Math.PI / 2;
    nmap[c.id].x = cx + Math.cos(a) * rad * 1.15;
    nmap[c.id].y = cy + Math.sin(a) * rad;
  });
  const avg = (keys: string[]) => {
    let x = 0, y = 0, c = 0;
    keys.forEach((k) => { if (nmap[k].x) { x += nmap[k].x; y += nmap[k].y; c++; } });
    return c ? [x / c, y / c] : [cx, cy];
  };
  let s = 7;
  const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280 - 0.5; };
  ING.forEach((i) => { const a = avg(i.tags); nmap[i.id].x = a[0] + rnd() * 90; nmap[i.id].y = a[1] + rnd() * 90; });
  DISH.forEach((d) => { const a = avg(d.ing); nmap[d.id].x = a[0] + rnd() * 50; nmap[d.id].y = a[1] + rnd() * 50; });
}

export function clamp(g: Graph, a: GNode) {
  // labels sit under nodes and can be ~110px wide, so keep centres clear of the side edges
  const p = a.r + 14, px = a.kind === 'con' ? a.r + 54 : a.r + 52;
  a.x = Math.max(px, Math.min(g.W - px, a.x));
  a.y = Math.max(p, Math.min(g.H - p - 18, a.y));
}

export function step(g: Graph, temp: number, pinned?: GNode) {
  const { actN, actL, nmap, W, H } = g;
  const n = actN.length, k = Math.sqrt((W * H) / Math.max(n, 1)) * 0.8, k2 = k * k;
  for (const a of actN) { a.dx = 0; a.dy = 0; }
  for (let i = 0; i < n; i++) {
    const a = actN[i];
    for (let j = i + 1; j < n; j++) {
      const b = actN[j];
      let dx = a.x - b.x, dy = a.y - b.y;
      const d = Math.sqrt(dx * dx + dy * dy) || 0.1;
      let f = k2 / d;
      const min = a.r + b.r + 10;
      if (d < min) f += (min - d) * 3;
      dx /= d; dy /= d;
      a.dx += dx * f; a.dy += dy * f; b.dx -= dx * f; b.dy -= dy * f;
    }
  }
  for (const l of actL) {
    const a = nmap[l.s], b = nmap[l.t];
    let dx = a.x - b.x, dy = a.y - b.y;
    const d = Math.sqrt(dx * dx + dy * dy) || 0.1;
    const f = ((d * d) / k) * 0.9;
    dx /= d; dy /= d;
    a.dx -= dx * f; a.dy -= dy * f; b.dx += dx * f; b.dy += dy * f;
  }
  for (const a of actN) {
    a.dx += (W / 2 - a.x) * 0.05;
    a.dy += (H / 2 - a.y) * 0.07;
    if (a === pinned) continue;
    const d = Math.sqrt(a.dx * a.dx + a.dy * a.dy) || 0.1;
    const m = Math.min(d, temp);
    a.x += (a.dx / d) * m;
    a.y += (a.dy / d) * m;
    clamp(g, a);
  }
}

export function settle(g: Graph, iter: number) {
  let t = Math.max(g.W, g.H) / 9;
  for (let i = 0; i < iter; i++) { step(g, t); t = Math.max(t * 0.975, 0.4); }
}

/** Rescale positions to a new stage size and relax briefly. */
export function resize(g: Graph, w: number, h: number) {
  const sx = w / g.W, sy = h / g.H;
  g.nodes.forEach((n) => { n.x *= sx; n.y *= sy; });
  g.W = w; g.H = h;
  for (let i = 0; i < 30; i++) step(g, 3);
}

/** Restrict the active set to one category plus its concerns and dishes. Returns the visible id set. */
export function applyFilter(g: Graph, catF: string): Set<string> {
  const vis = new Set<string>();
  if (catF === 'all') g.nodes.forEach((n) => vis.add(n.id));
  else {
    ING.forEach((i) => { if (i.cat === catF) vis.add(i.id); });
    g.links.forEach((l) => {
      if (g.nmap[l.t].kind === 'con' && vis.has(l.s)) vis.add(l.t);
      if (g.nmap[l.s].kind === 'dish' && vis.has(l.t)) vis.add(l.s);
    });
  }
  g.actN = g.nodes.filter((n) => vis.has(n.id));
  g.actL = g.links.filter((l) => vis.has(l.s) && vis.has(l.t));
  settle(g, 260);
  return vis;
}
