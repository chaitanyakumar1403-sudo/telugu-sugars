// The founder page's stage: scroll camera, curtain, narrator, draggable props, ants, magnifier, receipt,
// envelope. It works on the DOM that FounderPage renders and returns a cleanup that removes every
// listener, timer, observer and frame it started.
import type { Language } from '../../types/content';

interface StageEnv {
  /** The cursor ring (portalled to <body>, so it sits above the site header) */
  cursor: HTMLElement;
  t: (key: string) => string;
  lang: Language;
  /** Ask React for a fresh receipt (new time) after it's torn off */
  reprint: () => void;
}

interface Prop {
  el: HTMLElement; x: number; y: number; vx: number; vy: number; r: number; s: number; drag: boolean;
  dx: number; dy: number; rot: number; norot: boolean; delay: number; ox: number; oy: number; lx: number; ly: number;
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ss = (a: number, b: number, x: number) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const backOut = (t: number) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
const p2 = (n: number) => String(n).padStart(2, '0');
const ACTS = ['s-hero', 'a2', 'a3', 's-rules', 'a5'];

export function mountFounder(root: HTMLElement, env: StageEnv): () => void {
  const { cursor, t, lang } = env;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;
  const $ = <T extends HTMLElement = HTMLElement>(s: string) => root.querySelector(s) as T;
  const $$ = <T extends HTMLElement = HTMLElement>(s: string, r: ParentNode = root) => [...r.querySelectorAll(s)] as T[];

  // ---- everything started here is stopped by the returned cleanup ----
  const offs: (() => void)[] = [];
  const on = (target: EventTarget, type: string, fn: EventListenerOrEventListenerObject, opts?: AddEventListenerOptions) => {
    target.addEventListener(type, fn, opts);
    offs.push(() => target.removeEventListener(type, fn, opts));
  };
  const timers = new Set<number>();
  const later = (fn: () => void, ms: number) => { const id = window.setTimeout(() => { timers.delete(id); fn(); }, ms); timers.add(id); return id; };
  const every = (fn: () => void, ms: number) => { const id = window.setInterval(fn, ms); offs.push(() => clearInterval(id)); return id; };
  let raf = 0, alive = true;

  const html = document.documentElement;
  html.classList.add('fd-on'); // hides the site's own cursor ring while ours is on screen
  offs.push(() => html.classList.remove('fd-on'));
  const isDark = () => html.dataset.theme === 'dark';

  // ---------- Act statements tilt into place: word spans rendered by React ----------
  const SAYS = $$('[data-say]').map((el) => ({ el, words: $$('.w', el).map((w) => ({ w, r: +(w.dataset.r || 0) })), last: '' }));

  // ---------- Narrator: a typed line from the wings, once per act ----------
  const narr = $('#narr'), narrLine = $('#narrLine'), told: boolean[] = [];
  let narrT = 0, typeT = 0;
  function narrate(i: number) {
    if (told[i]) return;
    told[i] = true;
    const txt = t('fd.nar.' + (i + 1));
    clearInterval(typeT); clearTimeout(narrT);
    narr.classList.add('on');
    if (reduce) narrLine.textContent = txt;
    else {
      const parts = lang === 'te' ? txt.split(/(\s+)/) : [...txt];
      let k = 0;
      narrLine.textContent = '';
      typeT = window.setInterval(() => { narrLine.textContent += parts[k++] || ''; if (k >= parts.length) clearInterval(typeT); }, lang === 'te' ? 120 : 34);
    }
    narrT = window.setTimeout(() => narr.classList.remove('on'), 4200 + txt.length * 40);
  }
  offs.push(() => { clearInterval(typeT); clearTimeout(narrT); });

  // ---------- Layout ----------
  const hero = $('#s-hero'), work = $('#s-work'), stage = $('#heroStage'), track = $('#track');
  const cloth = $('#cloth'), card = $('#card'), flipper = $('#flipper'), hint = $('#hint');
  let vw = innerWidth, vh = innerHeight, mobile = vw < 760, PS = 1, tops = [0, 0, 0, 0, 0];
  let H = { top: 0, h: 0 };
  const W = { top: 0, h: 0, range: 0, hold: 0 };
  const docTop = (el: HTMLElement) => el.getBoundingClientRect().top + scrollY;
  function layout() {
    vw = innerWidth; vh = innerHeight; mobile = vw < 760;
    if (mobile) work.style.height = '';
    else {
      W.range = Math.max(0, track.scrollWidth - vw);
      W.hold = vh * 0.35;
      work.style.height = vh + W.range + W.hold + 'px';
    }
    H = { top: docTop(hero), h: hero.offsetHeight };
    W.top = docTop(work); W.h = work.offsetHeight;
    PS = mobile ? 1 : clamp(vw / 1440, .72, 1); // props shrink a little on smaller laptops
    tops = ACTS.map((id) => docTop($('#' + id)));
  }
  layout();
  on(window, 'resize', layout);
  raf = requestAnimationFrame(layout);
  document.fonts?.ready.then(() => alive && layout());

  // ---------- Props: drag with a little weight (mouse), a nudge (touch) ----------
  const props: Prop[] = $$('.prop').map((el, i) => ({
    el, x: 0, y: 0, vx: 0, vy: 0, r: 0, s: 1, drag: false, ox: 0, oy: 0, lx: 0, ly: 0,
    dx: +(el.dataset.dx || 0), dy: +(el.dataset.dy || 0), rot: +(el.dataset.rot || 0), norot: el.hasAttribute('data-norot'), delay: 150 + i * 85,
  }));
  let zTop = 12;
  props.forEach((p) => {
    const el = p.el;
    on(el, 'pointerdown', ((e: PointerEvent) => {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') { p.vx += (Math.random() - .5) * 14; p.vy -= 6 + Math.random() * 4; p.r += (Math.random() - .5) * 20; return; }
      e.preventDefault();
      el.setPointerCapture(e.pointerId);
      p.drag = true; p.ox = e.clientX - p.x; p.oy = e.clientY - p.y; p.lx = e.clientX; p.ly = e.clientY; p.vx = p.vy = 0;
      el.classList.add('lift'); el.style.zIndex = String(++zTop); cursor.classList.add('grab');
    }) as EventListener);
    on(el, 'pointermove', ((e: PointerEvent) => {
      if (!p.drag) return;
      p.vx = lerp(p.vx, e.clientX - p.lx, .5); p.vy = lerp(p.vy, e.clientY - p.ly, .5);
      p.lx = e.clientX; p.ly = e.clientY;
      p.x = e.clientX - p.ox; p.y = e.clientY - p.oy;
    }) as EventListener);
    const up = () => { if (!p.drag) return; p.drag = false; el.classList.remove('lift'); cursor.classList.remove('grab'); };
    on(el, 'pointerup', up);
    on(el, 'pointercancel', up);
  });

  // Magnifying glass: a copy of the label, scaled up, kept in line with whatever sits under the lens.
  const lblIn = $('#lblIn'), glass = $('#glass'), lensView = $('#lensView');
  const copy = lblIn.cloneNode(true) as HTMLElement;
  copy.removeAttribute('id');
  copy.style.width = lblIn.offsetWidth + 'px';
  lensView.replaceChildren(copy);
  offs.push(() => lensView.replaceChildren());
  const ZOOM = 1.9;
  function magnify() {
    if (getComputedStyle(glass).display === 'none' || !lblIn.offsetWidth) return;
    copy.style.width = lblIn.offsetWidth + 'px';
    const L = lblIn.getBoundingClientRect(), G = glass.getBoundingClientRect();
    const k = L.width / lblIn.offsetWidth, gk = G.width / glass.offsetWidth;
    const D = glass.clientWidth;
    const px = (G.left + G.width / 2 - L.left) / k, py = (G.top + G.height / 2 - L.top) / k;
    lensView.style.transform = `translate(${D / 2 - px * ZOOM * k / gk}px, ${D / 2 - py * ZOOM * k / gk}px) scale(${ZOOM * k / gk})`;
  }

  // ---------- Ants: they find the sugar, and follow it if you move it ----------
  const cv = $<HTMLCanvasElement>('#ants'), ctx = cv.getContext('2d');
  const sugar = $('#sugar'), antnote = $('#antnote');
  const N = 9, GAP = 13;
  const lead = { x: -30, y: 0, a: 0 };
  let trail: { x: number; y: number; a: number }[] = [], antsOn = true, arrivedAt = 0, dpr = 1, sw = 0, sh = 0;
  function sizeCanvas() {
    dpr = Math.min(2, devicePixelRatio || 1); sw = stage.clientWidth; sh = stage.clientHeight;
    cv.width = sw * dpr; cv.height = sh * dpr; cv.style.width = sw + 'px'; cv.style.height = sh + 'px';
    if (!trail.length) { lead.x = -30; lead.y = sh * .82; lead.a = -.2; }
  }
  sizeCanvas();
  on(window, 'resize', sizeCanvas);
  const heroIO = new IntersectionObserver((es) => { antsOn = es[0].isIntersecting; });
  heroIO.observe(stage);
  offs.push(() => heroIO.disconnect());
  function drawAnt(x: number, y: number, a: number, tt: number, col: string) {
    if (!ctx) return;
    ctx.save(); ctx.translate(x, y); ctx.rotate(a);
    ctx.strokeStyle = col; ctx.lineWidth = 0.9; ctx.lineCap = 'round';
    for (let i = -1; i <= 1; i++) {
      const w = Math.sin(tt * 22 + i * 2.1) * 1.6;
      ctx.beginPath(); ctx.moveTo(i * 1.8, 0); ctx.lineTo(i * 2.6 + w, -4.2); ctx.moveTo(i * 1.8, 0); ctx.lineTo(i * 2.6 - w, 4.2); ctx.stroke();
    }
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.ellipse(-4.6, 0, 3, 2.1, 0, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.ellipse(0, 0, 1.9, 1.3, 0, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.ellipse(3.6, 0, 1.7, 1.6, 0, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.moveTo(4.8, -.8); ctx.lineTo(7.4, -2.6); ctx.moveTo(4.8, .8); ctx.lineTo(7.4, 2.6); ctx.stroke();
    ctx.restore();
  }
  function ants(dt: number, tt: number) {
    if (!ctx) return;
    const S = stage.getBoundingClientRect(), R = sugar.getBoundingClientRect();
    const tx = R.left - S.left + R.width / 2, ty = R.top - S.top + R.height / 2;
    const dx = tx - lead.x, dy = ty - lead.y, dist = Math.hypot(dx, dy);
    const ring = Math.max(R.width, R.height) / 2 + 14;
    let want = Math.atan2(dy, dx);
    if (dist < ring + 16) want += Math.PI / 2 * (dist < ring ? 1.25 : .85);
    else want += Math.sin(tt * 2.3) * .45 + Math.sin(tt * 5.1) * .2;
    const da = ((want - lead.a + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
    lead.a += clamp(da, -3.4 * dt, 3.4 * dt);
    const v = (dist > 220 ? 52 : 34) * (mobile ? .8 : 1);
    lead.x += Math.cos(lead.a) * v * dt; lead.y += Math.sin(lead.a) * v * dt;
    const last = trail[0];
    if (!last || Math.hypot(lead.x - last.x, lead.y - last.y) > 1.5) { trail.unshift({ x: lead.x, y: lead.y, a: lead.a }); trail.length = Math.min(trail.length, N * GAP / 1.5 + 4); }
    const near = dist < ring + 30;
    if (near && !arrivedAt) arrivedAt = tt;
    if (!near) arrivedAt = 0;
    antnote.classList.toggle('on', !!arrivedAt && tt - arrivedAt > 1.2 && !mobile);
    if (antnote.classList.contains('on')) { antnote.style.left = clamp(tx + ring, 8, sw - 210) + 'px'; antnote.style.top = clamp(ty - ring - 50, 70, sh - 60) + 'px'; }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, sw, sh);
    const col = isDark() ? 'rgba(245,230,215,.85)' : '#2b1d16';
    drawAnt(lead.x, lead.y, lead.a, tt, col);
    for (let i = 1; i < N; i++) { const p = trail[Math.round(i * GAP / 1.5)]; if (p) drawAnt(p.x, p.y, p.a, tt + i * .37, col); }
  }

  // ---------- Lamp (dark) + cursor ring that names what you can do ----------
  const lamp = $('#lamp');
  on(window, 'pointermove', ((e: PointerEvent) => { lamp.style.setProperty('--lx', e.clientX + 'px'); lamp.style.setProperty('--ly', e.clientY + 'px'); }) as EventListener, { passive: true });
  if (fine && !reduce) {
    let cx = innerWidth / 2, cy = innerHeight / 2, tx = cx, ty = cy;
    const curLbl = cursor.querySelector('.cur-label') as HTMLElement;
    const CUR: [string, string][] = [['#curtain', 'fd.cur.open'], ['.prop', 'fd.cur.drag'], ['#front', 'fd.cur.flip'], ['.wcard', 'fd.cur.open'], ['#seal', 'fd.cur.open'], ['#receipt', 'fd.cur.tear']];
    const sense = (target: Element | null) => {
      if (!target || !target.closest) return;
      const inside = root.contains(target);
      const hit = inside ? CUR.find(([sel]) => target.closest(sel)) : undefined;
      if (hit) curLbl.textContent = t(hit[1]);
      cursor.classList.toggle('label', !!hit);
      cursor.classList.toggle('hot', !hit && !!target.closest('a,button,[role=button]'));
    };
    on(window, 'pointermove', ((e: PointerEvent) => { tx = e.clientX; ty = e.clientY; cursor.classList.add('on'); sense(e.target as Element); }) as EventListener, { passive: true });
    // things slide under a still mouse while scrolling, so look again
    on(window, 'scroll', () => sense(document.elementFromPoint(tx, ty)), { passive: true });
    on(document, 'pointerleave', () => cursor.classList.remove('on'));
    const follow = () => { cx += (tx - cx) * .22; cy += (ty - cy) * .22; cursor.style.transform = `translate3d(${cx}px,${cy}px,0)`; followId = requestAnimationFrame(follow); };
    let followId = requestAnimationFrame(follow);
    offs.push(() => { cancelAnimationFrame(followId); cursor.className = ''; });
  }

  // ---------- Card: click/Enter flips it by scrolling to the flip point ----------
  const front = $('#front');
  const toFlip = () => scrollTo({ top: H.top + (H.h - vh) * .5, behavior: reduce ? 'auto' : 'smooth' });
  on(front, 'click', toFlip);
  on(front, 'keydown', ((e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toFlip(); } }) as EventListener);

  // ---------- Curtain: opens once per visit; "Back to the table" closes it and plays again ----------
  let seen = false;
  try { seen = sessionStorage.getItem('fd-curtain') === '1'; } catch { /* private mode */ }
  if (!seen && !reduce) root.classList.add('cu-wait');
  offs.push(() => root.classList.remove('cu-wait', 'cu-open'));
  let tStart = root.classList.contains('cu-wait') ? Infinity : performance.now();
  let onRail = -1;
  const raise = () => {
    if (!root.classList.contains('cu-wait') || root.classList.contains('cu-open')) return;
    root.classList.add('cu-open');
    tStart = performance.now();
    try { sessionStorage.setItem('fd-curtain', '1'); } catch { /* private mode */ }
    later(() => root.classList.remove('cu-wait', 'cu-open'), 1600);
    if (vw >= 760) later(() => narrate(Math.max(0, onRail)), 2300);
  };
  if (root.classList.contains('cu-wait')) {
    ['click', 'keydown', 'wheel', 'touchstart'].forEach((ev) => on(window, ev, raise, { once: true, passive: true }));
    later(raise, 1900);
  } else if (vw >= 760) later(() => narrate(Math.max(0, onRail)), 1400);
  const curtainEl = $('#curtain');
  on($('#again'), 'click', () => {
    if (reduce) { scrollTo({ top: 0, behavior: 'auto' }); return; }
    root.classList.add('cu-wait', 'cu-open');
    void curtainEl.offsetHeight;
    root.classList.remove('cu-open');
    later(() => {
      scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      props.forEach((p) => { p.x = p.y = p.vx = p.vy = p.r = 0; });
      later(raise, 500);
    }, 1550);
  });

  // ---------- Receipt prints, letter opens, notes land ----------
  const printer = $('#printer'), head = printer.querySelector('.printer') as HTMLElement, receipt = $('#receipt');
  const env$ = $('#env'), letter = $('#letter');
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target as HTMLElement;
    if (el === head) { printer.classList.add('print'); head.classList.add('busy'); later(() => head.classList.remove('busy'), reduce ? 0 : 3000); }
    else if (el === env$) el.classList.add('open');
    io.unobserve(el);
  }), { threshold: .35 });
  io.observe(head); io.observe(env$);
  offs.push(() => io.disconnect());
  on($('#seal'), 'click', () => env$.classList.toggle('open'));
  const tearBtn = $<HTMLButtonElement>('#tear');
  let tearing = false;
  function tear() {
    if (tearing) return;
    tearing = true; tearBtn.disabled = true;
    receipt.classList.add('torn');
    later(() => {
      receipt.style.transition = 'none'; receipt.classList.remove('torn'); printer.classList.remove('print');
      void receipt.offsetHeight; receipt.style.transition = '';
      env.reprint(); printer.classList.add('print'); head.classList.add('busy');
      later(() => { head.classList.remove('busy'); tearing = false; tearBtn.disabled = false; }, reduce ? 0 : 3000);
    }, reduce ? 0 : 600);
  }
  on(receipt, 'click', tear);
  on(tearBtn, 'click', tear);
  function fitLetter() {
    const rise = Math.max(0, letter.offsetHeight - env$.offsetHeight * .12);
    env$.style.setProperty('--rise', -rise + 'px');
    env$.style.setProperty('--lift', rise + 40 + 'px');
  }
  fitLetter();
  on(window, 'resize', fitLetter);
  document.fonts?.ready.then(() => alive && fitLetter());

  // ---------- The phone's recording timer ----------
  const tm = $('#tm'), t0 = Date.now();
  every(() => { const s = Math.floor((Date.now() - t0) / 1000); tm.textContent = p2(Math.floor(s / 60)) + ':' + p2(s % 60); }, 1000);

  // ---------- One frame loop: scroll camera, flip, props, lens, ants ----------
  const rail = $$('#rail a'), ruler = $$('#ruler a'), dots = $$('#wdots i'), twrap = $('.track-wrap');
  const needle = $('#needle'), tc = $('#tc'), ctag = $('#ctag');
  // Words of each act statement tilt and drop into place as it scrolls in, then drift as it leaves.
  function says() {
    SAYS.forEach((s) => {
      const R = s.el.getBoundingClientRect();
      if (R.bottom < -40 || R.top > vh + 40) return;
      const pin = clamp((vh - R.top) / (vh * .55), 0, 1), pout = clamp((vh * .2 - R.top) / (vh * .6), 0, 1);
      const key = pin.toFixed(3) + pout.toFixed(3);
      if (key === s.last) return;
      s.last = key;
      const n = s.words.length;
      s.words.forEach(({ w, r }, i) => {
        const a = (i / Math.max(1, n)) * .45, e = ss(a, a + .55, pin);
        w.style.transform = `translate3d(0, ${(1 - e) * 70 - pout * 40}%, 0) rotate(${(1 - e) * r + pout * r * .4}deg)`;
        w.style.opacity = (.12 + e * .88).toFixed(3);
      });
    });
  }
  let last = performance.now(), lastY = scrollY, vel = 0, shp = -1, sshift = 0, onDot = -1;
  function frame(now: number) {
    if (!alive) return;
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    const y = scrollY, k = reduce ? 1 : 1 - Math.exp(-dt * 9);
    vel = lerp(vel, y - lastY, .15); lastY = y;
    const max = document.documentElement.scrollHeight - vh;

    // Pinned work: cards slide sideways (eased); the cloth pans with them.
    let pinned = clamp(y - H.top, 0, H.h - vh), shift = 0;
    if (!mobile) {
      const wy = clamp(y - W.top, 0, W.h - vh);
      pinned += wy;
      shift = clamp(wy - W.hold / 2, 0, W.range);
    }
    sshift += (shift - sshift) * k;
    track.style.transform = mobile ? '' : `translate3d(${-sshift}px,0,0) skewX(${reduce ? 0 : clamp(vel * -.06, -5, 5)}deg)`;
    // The cloth lies under the whole page and scrolls with it; while a scene is pinned it moves back by the
    // pinned distance, so the table looks still under the pinned scene.
    cloth.style.backgroundPosition = `${mobile ? 0 : -sshift}px ${pinned}px`;
    const di = Math.round((mobile ? twrap.scrollLeft / Math.max(1, twrap.scrollWidth - twrap.clientWidth) : sshift / Math.max(1, W.range)) * (dots.length - 1));
    if (di !== onDot) { dots.forEach((el, n) => el.classList.toggle('on', n === di)); onDot = di; }
    let ri = 0; tops.forEach((tp, n) => { if (y + vh * .5 >= tp) ri = n; });
    if (ri !== onRail) {
      rail.forEach((a, n) => a.classList.toggle('on', n === ri)); ruler.forEach((a, n) => a.classList.toggle('on', n === ri));
      if (onRail >= 0 && ri > 0 && !root.classList.contains('cu-wait')) narrate(ri);
      onRail = ri;
    }
    const next = ri + 1 < tops.length ? tops[ri + 1] : max + vh * .5;
    needle.style.left = ((ri + clamp((y + vh * .5 - tops[ri]) / Math.max(1, next - tops[ri]), 0, 1)) / tops.length * 100).toFixed(2) + '%';
    if (now > tStart) { const fr = Math.floor((now - tStart) / 40), sec = Math.floor(fr / 25); tc.textContent = `${p2(Math.floor(sec / 3600))}:${p2(Math.floor(sec / 60) % 60)}:${p2(sec % 60)}:${p2(fr % 25)}`; }
    if (!reduce) says();

    if (antsOn) {
      // Hero: photo flips into the postcard (eased); props drift out of the way.
      const hp = clamp((y - H.top) / Math.max(1, H.h - vh), 0, 1);
      shp = shp < 0 ? hp : shp + (hp - shp) * k;
      const f = ss(.08, .44, shp), d = ss(.04, .46, shp), lift = Math.sin(f * Math.PI);
      const ce = reduce ? 1 : clamp((now - tStart - 950) / 800, 0, 1), ceb = backOut(ce);
      card.style.opacity = String(clamp(ce * 3, 0, 1));
      card.style.transform = `translate(-50%, -50%) translateY(${-lift * 2}vh) rotate(${lerp(-4, 0, ss(0, .4, shp)) + (1 - ceb) * 6}deg) scale(${(1 + lift * .07 + f * .02) * lerp(1.25, 1, ceb)})`;
      card.style.setProperty('--sx', (100 - f * 100) + '%');
      card.style.setProperty('--so', (lift * .85).toFixed(3));
      flipper.style.transform = `rotateY(${f * 180}deg) rotateX(${lift * -6}deg)`;
      ctag.style.opacity = (clamp(ce * 2 - 1, 0, 1) * (1 - ss(.02, .14, shp))).toFixed(3);
      hint.style.opacity = String((1 - ss(.02, .08, shp)) * (reduce ? 1 : clamp((now - tStart - 1900) / 500, 0, 1)));

      props.forEach((p) => {
        if (!p.drag) {
          p.x += p.vx; p.y += p.vy; p.vx *= .9; p.vy *= .9;
          if (Math.abs(p.vx) < .01) p.vx = 0;
          if (Math.abs(p.vy) < .01) p.vy = 0;
        }
        const tilt = p.norot ? 0 : clamp((p.drag ? p.vx : p.vx * .5) * 1.4, -16, 16);
        p.r += (tilt - p.r) * .15;
        p.s += ((p.drag ? 1.07 : 1) - p.s) * .2;
        // entrance: each prop drops onto the table in turn
        const ent = reduce ? 1 : clamp((now - tStart - p.delay) / 650, 0, 1), eb = backOut(ent);
        const ox = p.dx * d * vw * .2, oy = p.dy * d * vh * .3;
        // keep it on the table
        const el = p.el, cx = el.offsetLeft + el.offsetWidth / 2 + p.x, cy = el.offsetTop + el.offsetHeight / 2 + p.y;
        if (cx < 10) { p.x += 10 - cx; p.vx = Math.abs(p.vx) * .5; } else if (cx > sw - 10) { p.x -= cx - (sw - 10); p.vx = -Math.abs(p.vx) * .5; }
        if (cy < 60) { p.y += 60 - cy; p.vy = Math.abs(p.vy) * .5; } else if (cy > sh - 10) { p.y -= cy - (sh - 10); p.vy = -Math.abs(p.vy) * .5; }
        el.style.opacity = String(clamp(ent * 3, 0, 1));
        el.style.transform = `translate3d(${ox + p.x}px, ${oy + p.y}px, 0) rotate(${p.rot + p.r + (1 - eb) * (p.norot ? 0 : 10)}deg) scale(${p.s * PS * lerp(1.45, 1, eb)})`;
      });
      magnify();
      if (!reduce) ants(dt, now / 1000);
    }
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);

  return () => {
    alive = false;
    cancelAnimationFrame(raf);
    timers.forEach((id) => clearTimeout(id));
    offs.forEach((off) => off());
  };
}
