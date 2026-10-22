import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../context/LanguageContext';
import ListenButton from '../components/common/ListenButton';
import { INSTAGRAM_URL } from '../components/common/InstagramLink';
import portrait from '../assets/portrait.webp';
import { ART } from './founder/art';
import { mountFounder } from './founder/stage';
import './founder/founder.css';

interface FounderPageProps {
  onNavigate: (path: string) => void;
}

/** Six work labels, numbered with Telugu letters (never 1 2 3). `to` is an app path or an in-page anchor. */
const WORKS: { k: string; art: string; to?: string; cta?: string; soon?: boolean }[] = [
  { k: 'w1', art: 'play', to: '/watch' },
  { k: 'w6', art: 'stage', to: '/creators', cta: 'fd.c.join' },
  { k: 'w2', art: 'atlas', to: '/atlas' },
  { k: 'w3', art: 'frames' },
  { k: 'w4', art: 'te', to: '/' },
  { k: 'w5', art: 'truck', soon: true },
];
const LETTERS = ['అ', 'ఆ', 'ఇ', 'ఈ', 'ఉ', 'ఊ'];
const ROT = [-3, 2.2, -1.4, 2.8, -2.2, 1.6];
const ACTS: [string, string][] = [['s-hero', 'అ'], ['a2', 'ఆ'], ['a3', 'ఇ'], ['s-rules', 'ఈ'], ['a5', 'ఉ']];
const DAY1 = new Date(2026, 8, 28); // first daily video

const X_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
);

/** "Six things *I'm building.*" → word spans; *stars* mark the accent. Words tilt into place on scroll (stage.ts). */
const Say: React.FC<{ text: string; n: number; id?: string }> = ({ text, n, id }) => {
  let on = false;
  const words = text.split(/\s+/).map((w, i) => {
    let o = on;
    if (w.startsWith('*')) { o = on = true; w = w.slice(1); }
    if (w.endsWith('*')) { w = w.slice(0, -1); on = false; }
    const r = (((i * 37 + n * 11) % 9) - 4) * 3 || 6;
    return (
      <React.Fragment key={i}>
        {i > 0 && ' '}
        <span className={o ? 'w o' : 'w'} data-r={r}>{w}</span>
      </React.Fragment>
    );
  });
  return <p className="say-l" id={id} data-say="">{words}</p>;
};

/** The work label's "Work Facts" box, like the nutrition panel on a food packet. */
const Facts: React.FC<{ w: (typeof WORKS)[number] }> = ({ w }) => {
  const { t } = useLanguage();
  return (
    <div className="facts">
      <h3>{t('fd.facts')}</h3>
      <div className="serv">{t(`fd.${w.k}.t`)}</div>
      <hr />
      <dl>
        <div><dt>{t('fd.row.role')}</dt><dd>{t(`fd.${w.k}.role`)}</dd></div>
        <div><dt>{t('fd.row.type')}</dt><dd>{t(`fd.${w.k}.type`)}</dd></div>
        <div><dt>{t('fd.row.status')}</dt><dd><span className={w.soon ? 'dot soon' : 'dot'} />{t(`fd.${w.k}.status`)}</dd></div>
      </dl>
      <hr className="thin" />
      <p className="ing"><b>{t('fd.row.ing')}</b> {t(`fd.${w.k}.ing`)}</p>
    </div>
  );
};

/**
 * Founder portfolio, "The Table Theatre": a curtain opens on Dheeraj's table (ikat cloth, props you can drag,
 * a photo that flips into a postcard), then five acts numbered అ ఆ ఇ ఈ ఉ. React renders every word in the
 * reader's language; ./founder/stage.ts runs the scroll camera and the table's physics on the rendered DOM.
 */
export const FounderPage: React.FC<FounderPageProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const rootRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDialogElement>(null);
  const billRef = useRef<HTMLDialogElement>(null);
  const [work, setWork] = useState<number | null>(null);
  const [printed, setPrinted] = useState(() => new Date());
  const [read, setRead] = useState<'full' | 'short'>(() => {
    try { return localStorage.getItem('fd-read') === 'short' ? 'short' : 'full'; } catch { return 'full'; }
  });

  useEffect(() => { try { localStorage.setItem('fd-read', read); } catch { /* private mode */ } }, [read]);
  useEffect(() => { document.title = t('fd.doc'); }, [t, language]);

  // The stage runs on the rendered page and starts again when the language changes (new words to animate).
  useLayoutEffect(() => {
    const root = rootRef.current, cursor = cursorRef.current;
    if (!root || !cursor) return;
    return mountFounder(root, {
      cursor,
      t,
      lang: language,
      reprint: () => setPrinted(new Date()),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  useEffect(() => {
    const d = sheetRef.current;
    if (!d) return;
    if (work !== null && !d.open) d.showModal();
    if (work === null && d.open) d.close();
  }, [work]);

  const go = (to: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (to.startsWith('#')) document.getElementById(to.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else onNavigate(to);
  };
  const jump = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    billRef.current?.close();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const receipt = useMemo(() => {
    const today = new Date(printed); today.setHours(0, 0, 0, 0);
    const days = Math.max(1, Math.round((+today - +DAY1) / 864e5) + 1);
    const loc = language === 'te' ? 'te-IN' : 'en-GB';
    const fmt = (d: Date) => d.toLocaleDateString(loc, { day: '2-digit', month: 'short', year: 'numeric' });
    return { days, date: `${fmt(today)} ${printed.toLocaleTimeString(loc, { hour: '2-digit', minute: '2-digit' })}`, day1: fmt(DAY1) };
  }, [printed, language]);
  const row = (l: string, v: React.ReactNode, cls = '') => <div className={cls ? `r ${cls}` : 'r'}><span>{l}</span><span>{v}</span></div>;

  const readSwitch = (
    <span className="readsw" role="group" aria-label={t('fd.read.q')}>
      {(['full', 'short'] as const).map((m) => (
        <button key={m} type="button" aria-pressed={read === m} onClick={() => setRead(m)}>{t(`fd.read.${m}`)}</button>
      ))}
    </span>
  );
  const w = work === null ? null : WORKS[work];

  return (
    <div ref={rootRef} className="fd fd-js" data-read={read}>
      <div className="cloth" id="cloth" aria-hidden="true" />
      <div className="fan" aria-hidden="true">
        <svg viewBox="-100 -100 200 200"><g fill="#2b1d16"><circle r="9" /><path id="fd-blade" d="M6 -4 C 30 -14, 80 -16, 96 -6 C 98 2, 80 8, 6 4Z" /><use href="#fd-blade" transform="rotate(120)" /><use href="#fd-blade" transform="rotate(240)" /></g></svg>
      </div>
      <div className="lamp" id="lamp" aria-hidden="true" />
      {createPortal(<div id="cursor" ref={cursorRef} aria-hidden="true"><span className="cur-label" /></div>, document.body)}

      <div id="curtain" aria-hidden="true">
        <div className="cu cu-l" /><div className="cu cu-r" /><div className="valance" />
        <div className="usher"><small>{t('fd.cu.presents')}</small><b>{t('fd.name')}</b><i className="hand">{t('fd.cu.acts')}</i><span>{t('fd.cu.seat')}</span></div>
      </div>
      <div id="narr" aria-hidden="true"><small>{t('fd.nar.k')}</small><p id="narrLine" /></div>

      <nav className="rail" id="rail" aria-label={t('fd.nav.aria')}>
        {ACTS.map(([id, l], i) => <a key={id} href={`#${id}`} onClick={jump(id)}><b>{l}</b><span>{t(`fd.nav.${i + 1}`)}</span></a>)}
      </nav>
      <nav className="prog" id="prog" aria-label={t('fd.nav.aria')}>
        <button className="pg-btn" type="button" aria-haspopup="dialog" onClick={() => billRef.current?.showModal()}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h10" /></svg>
          <span>{t('fd.pg.btn')}</span>
        </button>
        <div className="pg-ruler" id="ruler">
          {ACTS.map(([id, l], i) => <a key={id} href={`#${id}`} onClick={jump(id)}><b>{l}</b><span>{t(`fd.nav.${i + 1}`)}</span></a>)}
          <i className="needle" id="needle" aria-hidden="true" />
        </div>
      </nav>
      <dialog className="bill-dlg" id="playbill" ref={billRef} aria-labelledby="pbTitle" onClick={(e) => { if (e.target === e.currentTarget) billRef.current?.close(); }}>
        <button className="x" type="button" aria-label={t('fd.close')} onClick={() => billRef.current?.close()}>{X_ICON}</button>
        <small>{t('fd.cu.presents')}</small>
        <h2 id="pbTitle">{t('fd.pg.btn')}</h2>
        <p className="lede">{t('fd.pg.sub')}</p>
        <ol>
          {ACTS.map(([id, l], i) => (
            <li key={id}><a href={`#${id}`} onClick={jump(id)}><b aria-hidden="true">{l}</b><strong>{t(`fd.nav.${i + 1}`)}</strong><span>{t(`fd.nar.${i + 1}`)}</span></a></li>
          ))}
        </ol>
        <div className="readrow"><span>{t('fd.read.q')}</span>{readSwitch}</div>
      </dialog>

      {/* అ: the table, and the photo that flips into a postcard */}
      <section className="scene" id="s-hero" aria-labelledby="fdName">
        <div className="stage" id="heroStage">
          <h1 className="sr-only" id="fdName">{t('fd.doc')}</h1>
          <canvas id="ants" aria-hidden="true" />

          <div className="nametag" aria-hidden="true">
            <div className="selbox"><i /><i /><i /><i /><span className="tc" id="tc">00:00:00:00</span></div>
            <span className="tape deep">{t('fd.name')}</span>
            <span className="tape white">{t('fd.role')}</span>
          </div>
          <div className="drag-hint hand" aria-hidden="true">
            <span>{t('fd.drag')}</span>
            <svg viewBox="0 0 46 30" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M3 6c10 16 24 20 38 16" /><path d="m34 16 7 6-8 4" /></svg>
          </div>

          <div className="prop p-coffee" data-dx="1" data-dy="-.6" data-rot="0" aria-hidden="true"><div className="davara" /><div className="tumbler"><div className="coffee" /></div><div className="steam" /></div>
          <div className="prop p-sugar" id="sugar" data-dx="-.9" data-dy=".7" aria-hidden="true"><span className="cube" /><span className="cube" /><span className="cube" /></div>
          <div className="prop p-jaggery" data-dx="-.4" data-dy="1" data-rot="18" aria-hidden="true"><div className="bellam" /></div>
          <div className="prop p-note" data-dx="-1.1" data-dy="-.2" data-rot="-9" aria-hidden="true">
            <div className="nb">
              <p className="h">Ep. ideas ✎</p>
              <p><mark>maltodextrin</mark> = sugar? ✓</p>
              <p>"no added sugar" ≠ sugar-free</p>
              <p>ask Dr: bellam vs sugar</p>
              <p className="t">అ · ఆ · ఇ · ఈ</p>
              <p>monk fruit → read label!</p>
              <p><s>E951</s> check age limits</p>
            </div>
          </div>
          <div className="prop p-pen" data-dx="-.7" data-dy="-.9" data-rot="58" aria-hidden="true"><div className="pen" /></div>
          <div className="prop p-sticker" data-dx="-.3" data-dy="-1" data-rot="-14" aria-hidden="true"><div className="sticker"><div><b>తెలుగు</b><span>Sugars</span></div></div></div>
          <div className="prop p-label" id="label" data-dx="1.2" data-dy=".1" data-norot="" aria-hidden="true">
            <div className="ilbl" id="lblIn"><b>INGREDIENTS:</b> Refined wheat flour (maida), <mark>sugar</mark>, edible vegetable oil (palm), <mark>invert sugar syrup</mark>, <mark>maltodextrin</mark>, milk solids, emulsifier (INS 471), raising agent [INS 500(ii)], iodised salt, <mark>dextrose</mark>, flavour (vanilla).<i>Contains wheat, milk. May contain soy.</i></div>
          </div>
          <div className="prop p-lens" id="lens" data-dx="1.3" data-dy=".3" data-norot="" aria-hidden="true"><div className="handle" /><div className="glass" id="glass"><div className="view" id="lensView" /></div></div>
          <div className="prop p-phone" data-dx="1" data-dy=".8" data-rot="13" aria-hidden="true">
            <div className="phone"><div className="scr"><span className="notch" /><span className="rec"><i />REC</span><span className="tm" id="tm">00:00</span><div className="logo"><div><b>తెలుగు</b><span>Sugars</span></div></div><div className="wave">{Array.from({ length: 9 }, (_, i) => <i key={i} style={{ '--i': i } as React.CSSProperties} />)}</div></div></div>
          </div>
          <div className="antnote hand" id="antnote" aria-hidden="true">{t('fd.ants')}</div>

          <div className="card-wrap" id="card">
            <div className="ctag" id="ctag" aria-hidden="true"><svg viewBox="0 0 20 20"><path d="M3 2l13 7-5.6 1.6L8 16z" fill="#fd6a02" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" /></svg><span>{t('fd.tag')}</span></div>
            <div className="flipper" id="flipper">
              <div className="face front" id="front" role="button" tabIndex={0} aria-label={t('fd.flip')}>
                <span className="tapebit" aria-hidden="true" />
                <div className="ph"><img src={portrait} alt={t('fd.alt')} fetchPriority="high" /></div>
                <span className="psst hand" aria-hidden="true">{t('fd.psst')}</span>
                <div className="cap hand"><span>{t('fd.caption')}</span><small>TS · 2026</small></div>
              </div>
              <article className="face back" aria-labelledby="pcHi">
                <div className="pc">
                  <div className="pc-msg">
                    <div className="pc-kick"><span>{t('fd.pc.kicker')}</span>{readSwitch}</div>
                    <h2 className="pc-hi" id="pcHi">{t('fd.pc.hi')}</h2>
                    <p className="pc-body long">{t('fd.pc.body')}</p>
                    <p className="pc-body short">{t('fd.pc.short')}</p>
                    <div className="pc-foot">
                      <span className="pc-sign hand">{t('fd.pc.sign')}</span>
                      <ListenButton rec="founder" text={t('fd.listen')} className="say" />
                    </div>
                  </div>
                  <div className="pc-side">
                    <div className="stamp" aria-hidden="true"><div className="in"><small>₹5</small><b>తెలుగు</b><i>SUGARS</i><em>INDIA</em></div></div>
                    <div className="postmark" aria-hidden="true"><svg viewBox="0 0 100 100"><defs><path id="fd-pmArc" d="M50 50 m-36 0 a36 36 0 1 1 72 0" /></defs><circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="2.5" /><circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="1.5" /><text fontFamily="Space Mono, monospace" fontSize="9" fontWeight="700" fill="currentColor" letterSpacing="1.5"><textPath href="#fd-pmArc" startOffset="50%" textAnchor="middle">TELUGU SUGARS</textPath></text><text x="50" y="48" textAnchor="middle" fontFamily="Space Mono, monospace" fontSize="10" fontWeight="700" fill="currentColor">28·IX·26</text><text x="50" y="61" textAnchor="middle" fontFamily="Space Mono, monospace" fontSize="7" fill="currentColor">DAY 1</text><path d="M96 34c14-6 26 6 40 0s26 6 40 0M96 50c14-6 26 6 40 0s26 6 40 0M96 66c14-6 26 6 40 0s26 6 40 0" fill="none" stroke="currentColor" strokeWidth="2.5" /></svg></div>
                    <div className="pc-to hand"><span>{t('fd.pc.to')}</span><span>{t('fd.pc.addr')}</span><span>&nbsp;</span></div>
                    <div className="stickers">
                      {([['🔬', 'research'], ['✍️', 'scripts'], ['🎥', 'videos'], ['🍽️', 'food']] as const).map(([e, k]) => (
                        <div className="stk" key={k}><i aria-hidden="true">{e}</i><span>{t(`fd.st.${k}`)}</span></div>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>

          <div className="hint" id="hint" aria-hidden="true"><span className="mouse" /><span>{t('fd.scroll')}</span></div>
        </div>
      </section>

      {/* ఆ */}
      <section className="act" id="a2" aria-labelledby="a2say">
        <span className="act-ghost" aria-hidden="true">ఆ</span>
        <p className="act-k"><b aria-hidden="true">ఆ</b>{t('fd.act')} · {t('fd.nav.2')}</p>
        <Say text={t('fd.say.2')} n={0} id="a2say" />
      </section>

      <section className="scene" id="s-work" aria-labelledby="workTitle">
        <div className="wstage">
          <div className="whead">
            <h2 className="tapes" id="workTitle"><span className="tape">{t('fd.work.t1')}</span><span className="tape deep">{t('fd.work.t2')}</span></h2>
            <p className="sub">{t('fd.work.sub')}</p>
          </div>
          <div className="track-wrap">
            <div className="track" id="track">
              {WORKS.map((wk, i) => (
                <article
                  key={wk.k}
                  className="wcard"
                  role="button"
                  tabIndex={0}
                  style={{ '--rot': `${ROT[i]}deg` } as React.CSSProperties}
                  onClick={() => setWork(i)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setWork(i); } }}
                >
                  <span className="wbadge" aria-hidden="true">{LETTERS[i]}</span>
                  <div className="wart" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ART[wk.art] }} />
                  <Facts w={wk} />
                  <span className="wopen">{t('fd.open')}</span>
                </article>
              ))}
            </div>
          </div>
          <div className="wdots" id="wdots" aria-hidden="true">{LETTERS.map((l) => <i key={l}>{l}</i>)}</div>
        </div>
      </section>
      <dialog className="sheet" ref={sheetRef} onClose={() => setWork(null)} onClick={(e) => { if (e.target === e.currentTarget) setWork(null); }}>
        {w && work !== null && (
          <>
            <button className="x" type="button" aria-label={t('fd.close')} onClick={() => setWork(null)}>{X_ICON}</button>
            <div className="wart" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ART[w.art] }} />
            <div className="in">
              <span className="wbadge" aria-hidden="true">{LETTERS[work]}</span>
              <h3>{t(`fd.${w.k}.t`)}</h3>
              <p>{t(`fd.${w.k}.what`)}</p>
              <p className="long">{t(`fd.${w.k}.more`)}</p>
              <Facts w={w} />
              <div className="row">
                {w.to && (
                  <a className="btn btn-primary" href={w.to} onClick={(e) => { setWork(null); go(w.to!)(e); }}>
                    <span>{t(w.cta || 'fd.visit')}</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10" /></svg>
                  </a>
                )}
                <button className="btn btn-ghost" type="button" onClick={() => setWork(null)}>{t('fd.close')}</button>
              </div>
            </div>
          </>
        )}
      </dialog>

      {/* ఇ */}
      <section className="act a-white" id="a3" aria-labelledby="a3say">
        <span className="act-ghost" aria-hidden="true">ఇ</span>
        <p className="act-k"><b aria-hidden="true">ఇ</b>{t('fd.act')} · {t('fd.nav.3')}</p>
        <Say text={t('fd.say.3')} n={1} id="a3say" />
      </section>

      <section className="container" id="s-bill" aria-labelledby="billTitle">
        <div className="bill">
          <div className="bill-head">
            <h2 className="tapes" id="billTitle"><span className="tape">{t('fd.bill.t1')}</span><span className="tape white">{t('fd.bill.t2')}</span></h2>
            <span className="sub hand">{t('fd.bill.sub')}</span>
          </div>
          <div className="printer-wrap" id="printer">
            <div className="printer"><span>TS-58</span><i className="led" /></div>
            <div className="paper-clip">
              <div className="receipt" id="receipt" role="group" aria-labelledby="billTitle">
                <div className="c big">TELUGU SUGARS</div><div className="c">{t('fd.r.head')}</div><hr />
                {row(t('fd.r.date'), receipt.date)}{row(t('fd.r.day'), `#${receipt.days}`)}<hr />
                {row(t('fd.r.l1'), receipt.day1)}{row(t('fd.r.l2'), receipt.days)}
                {row(t('fd.r.l3'), t('fd.r.v3'))}{row(t('fd.r.l4'), t('fd.r.v4'))}
                {row(t('fd.r.l5'), "₹0.00")}{row(t('fd.r.l6'), "0")}<hr />
                {row(t('fd.r.next'), t('fd.r.vnext'))}{row(t('fd.r.then'), t('fd.r.vthen'))}<hr />
                {row(t('fd.r.total'), t('fd.r.vtotal'), "tot")}<hr />
                <div className="c">{t('fd.r.thanks')}</div>
                <div className="barcode" aria-hidden="true" />
                <div className="c" style={{ fontSize: 10, letterSpacing: '.3em' }}>TS-{String(receipt.days).padStart(4, '0')}</div>
              </div>
            </div>
            <button className="tear hand" id="tear" type="button"><span aria-hidden="true">✂</span><span>{t('fd.r.tear')}</span></button>
          </div>
        </div>
      </section>

      {/* ఈ: the rules, one poster each */}
      <section id="s-rules" aria-labelledby="rulesTitle">
        <h2 className="sr-only" id="rulesTitle">{t('fd.rules.t')}</h2>
        <ul className="rstack">
          {['అ', 'ఆ', 'ఇ', 'ఈ'].map((l, i) => (
            <li className="rule" key={l}>
              <p className="act-k" aria-hidden="true"><b>ఈ</b><span>{t('fd.rules.t')}</span></p>
              <Say text={t(`fd.r${i + 1}`)} n={i + 2} />
              <p className="hand" aria-hidden="true">{t('fd.rule')} {l}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ఉ */}
      <section className="act a-ink" id="a5" aria-labelledby="a5say">
        <span className="act-ghost" aria-hidden="true">ఉ</span>
        <p className="act-k"><b aria-hidden="true">ఉ</b>{t('fd.act')} · {t('fd.nav.5')}</p>
        <Say text={t('fd.say.5')} n={6} id="a5say" />
      </section>

      <section className="container" id="s-contact" aria-labelledby="letterTitle">
        <div className="contact-head tapes"><span className="tape white">{t('fd.c.kicker')}</span></div>
        <div className="env" id="env">
          <div className="env-back" />
          <div className="slot">
            <div className="letter" id="letter">
              <h2 id="letterTitle">{t('fd.c.title')}</h2>
              <p>{t('fd.c.body')}</p>
              <ul className="links">
                <li><a href="/creators" onClick={go('/creators')}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg><span>{t('fd.c.join')}</span></a></li>
                <li><a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" /></svg><span>{t('fd.c.insta')}</span></a></li>
                <li><a href="/watch" onClick={go('/watch')}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="4" /><path d="m10 9 5 3-5 3z" /></svg><span>{t('fd.c.watch')}</span></a></li>
                <li><a href="/atlas" onClick={go('/atlas')}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></svg><span>{t('fd.c.atlas')}</span></a></li>
              </ul>
            </div>
          </div>
          <div className="env-front" />
          <div className="env-flap" />
          <button className="seal" id="seal" type="button" aria-label={t('fd.c.open')}>TS</button>
        </div>
        <button className="again" type="button" id="again"><span>{t('fd.back')}</span> <span aria-hidden="true">↑</span></button>
      </section>
    </div>
  );
};

export default FounderPage;
