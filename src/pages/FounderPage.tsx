import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { INSTAGRAM_URL } from '../components/common/InstagramLink';
import { useVoice } from '../lib/useVoice';
import portrait from '../assets/portrait.webp';
import { ART } from './founder/art';
import './founder/founder.css';

interface FounderPageProps {
  onNavigate: (path: string) => void;
}

const YOUTUBE_URL = 'https://www.youtube.com/@TeluguSugars';

/** Six work labels, numbered with Telugu letters (never 1 2 3). `to` is an app path. */
const WORKS: { k: string; art: string; to?: string; cta?: string; soon?: boolean }[] = [
  { k: 'w1', art: 'play', to: '/watch' },
  { k: 'w6', art: 'stage', to: '/creators', cta: 'fd.c.join' },
  { k: 'w2', art: 'atlas', to: '/atlas' },
  { k: 'w3', art: 'frames' },
  { k: 'w4', art: 'te', to: '/' },
  { k: 'w5', art: 'truck', soon: true },
];
const LETTERS = ['అ', 'ఆ', 'ఇ', 'ఈ', 'ఉ', 'ఊ'];
const DAY1 = new Date(2026, 8, 28); // first daily video
const GRID = 35; // field-notes grid: the last five weeks, one square a day

type Obj = 'card' | 'notes' | 'record';

const X_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
);
const ARROW = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10" /></svg>
);

/** "Six things *I’m building.*" → the starred words in tiger orange. */
const accent = (text: string) =>
  text.split(/(\*[^*]+\*)/).map((p, i) => (p.startsWith('*') ? <em key={i}>{p.slice(1, -1)}</em> : <React.Fragment key={i}>{p}</React.Fragment>));

/** The work label's "Work Facts" box, like the nutrition panel on a food packet. */
const Facts: React.FC<{ w: (typeof WORKS)[number] }> = ({ w }) => {
  const { t } = useLanguage();
  return (
    <div className="facts">
      <h3>{t('fd.facts')}</h3>
      <div className="serv">{t(`fd.${w.k}.t`)}</div>
      <dl>
        <div><dt>{t('fd.row.role')}</dt><dd>{t(`fd.${w.k}.role`)}</dd></div>
        <div><dt>{t('fd.row.type')}</dt><dd>{t(`fd.${w.k}.type`)}</dd></div>
        <div><dt>{t('fd.row.status')}</dt><dd><span className={w.soon ? 'dot soon' : 'dot'} />{t(`fd.${w.k}.status`)}</dd></div>
      </dl>
      <p className="ing"><b>{t('fd.row.ing')}</b> {t(`fd.${w.k}.ing`)}</p>
    </div>
  );
};

/** Section heading: a Telugu letter, a mono label, then the line itself. */
const Head: React.FC<{ l: string; k: string; id: string; children: React.ReactNode; sub?: React.ReactNode }> = ({ l, k, id, children, sub }) => (
  <header className="sh">
    <p className="k"><b aria-hidden="true">{l}</b>{k}::</p>
    <h2 id={id}>{children}</h2>
    {sub && <p className="sub">{sub}</p>}
  </header>
);

/**
 * Founder portfolio, "the desk": one calm screen with three objects (a postcard with Dheeraj's stamp, his field
 * notes, a record player with his own voice). Tap one to bring it closer. Below it: the work, the bill, the rules
 * and a way to write to him, lettered అ ఆ ఇ ఈ.
 */
export const FounderPage: React.FC<FounderPageProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const [now, setNow] = useState(() => new Date());
  const [focus, setFocus] = useState<Obj | null>(null);
  const [work, setWork] = useState<number | null>(null);
  const sheetRef = useRef<HTMLDialogElement>(null);
  const letterRef = useRef<HTMLDialogElement>(null);
  const deskRef = useRef<HTMLDivElement>(null);
  const voice = useVoice('founder', () => t('fd.listen'));

  useEffect(() => { document.title = t('fd.doc'); }, [t, language]);
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(id);
  }, []);
  // A focused card glides to the middle of the desk (the postcard already sits there).
  useLayoutEffect(() => {
    const desk = deskRef.current;
    if (!desk) return;
    desk.querySelectorAll<HTMLElement>('.o-notes, .o-record').forEach((el) => { el.style.translate = ''; });
    const el = focus && focus !== 'card' ? desk.querySelector<HTMLElement>(`.o-${focus}`) : null;
    if (!el) return;
    const d = desk.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    el.style.translate = `${Math.round(d.left + d.width / 2 - (r.left + r.width / 2))}px ${Math.round(d.top + d.height / 2 - (r.top + r.height / 2))}px`;
  }, [focus]);
  useEffect(() => {
    if (!focus) return;
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setFocus(null); };
    addEventListener('keydown', esc);
    return () => removeEventListener('keydown', esc);
  }, [focus]);
  useEffect(() => {
    const d = sheetRef.current;
    if (!d) return;
    if (work !== null && !d.open) d.showModal();
    if (work === null && d.open) d.close();
  }, [work]);

  const loc = language === 'te' ? 'te-IN' : 'en-GB';
  const ist = now.toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' });
  const days = useMemo(() => {
    const today = new Date(now); today.setHours(0, 0, 0, 0);
    return Math.max(1, Math.round((+today - +DAY1) / 864e5) + 1);
  }, [now]);
  const receiptDate = useMemo(() => new Date(), []);
  const fmt = (d: Date) => d.toLocaleDateString(loc, { day: '2-digit', month: 'short', year: 'numeric' });
  const row = (l: string, v: React.ReactNode, cls = '') => <div className={cls ? `r ${cls}` : 'r'}><span>{l}</span><span>{v}</span></div>;

  const go = (to: string) => (e: React.MouseEvent) => { e.preventDefault(); onNavigate(to); };
  const jump = (id: string) => () => { setFocus(null); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  // Tap a card (not one of its buttons or links) to bring it closer; on phones the cards already sit full width.
  const pick = (o: Obj) => (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('a, button')) return;
    if (!matchMedia('(min-width: 900px)').matches) return;
    setFocus((f) => (f === o ? null : o));
  };
  const objProps = (o: Obj) => ({
    className: `obj o-${o}${focus === o ? ' on' : ''}`,
    onClick: pick(o),
    title: focus === o ? undefined : t('fd.d.focus'),
  });
  const w = work === null ? null : WORKS[work];
  const playing = voice.state !== 'idle';

  return (
    <div className="fdk">
      {/* The desk */}
      <section className="desk-wrap" aria-labelledby="fdName">
        <h1 className="sr-only" id="fdName">{t('fd.doc')}</h1>
        <ul className="strip" aria-label={t('fd.d.notes')}>
          <li><span>IST::</span>{ist}</li>
          <li><span>{t('fd.d.base')}::</span>{t('fd.d.vizag')}</li>
          <li><span>{t('fd.d.day')}::</span>#{days}</li>
          <li><span>{t('fd.d.lang')}::</span>TE · EN</li>
        </ul>

        <div ref={deskRef} className={focus ? 'desk is-focus' : 'desk'}>
          {/* The postcard: Dheeraj on a stamp */}
          <article {...objProps('card')}>
            <svg className="clip" viewBox="0 0 40 92" aria-hidden="true"><path d="M27 62V18a8 8 0 0 0-16 0v52a12 12 0 0 0 24 0V22" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" /></svg>
            <div className="pc">
              <figure className="stamp">
                <div className="ph"><img src={portrait} alt={t('fd.alt')} fetchPriority="high" /></div>
                <figcaption><span>{t('fd.name')}</span><svg viewBox="0 0 30 10" aria-hidden="true"><path d="M1 3c4-3 7 3 11 0s7 3 11 0 5 2 6 1M1 7c4-3 7 3 11 0s7 3 11 0 5 2 6 1" fill="none" stroke="currentColor" strokeWidth="1.2" /></svg></figcaption>
              </figure>
              <div className="pc-r">
                <div className="pc-top">
                  <svg className="pmark" viewBox="0 0 200 100" aria-hidden="true">
                    <defs><path id="fdk-arc" d="M50 50 m-36 0 a36 36 0 1 1 72 0" /></defs>
                    <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="2.4" />
                    <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="1.4" />
                    <text fontSize="9" fontWeight="700" fill="currentColor" letterSpacing="1.6"><textPath href="#fdk-arc" startOffset="50%" textAnchor="middle">VIZAG · AP</textPath></text>
                    <text x="50" y="49" textAnchor="middle" fontSize="10" fontWeight="700" fill="currentColor">28·IX·26</text>
                    <text x="50" y="62" textAnchor="middle" fontSize="7" fill="currentColor">DAY 1</text>
                    <path d="M98 34c14-6 26 6 40 0s26 6 40 0 16 4 20 2M98 50c14-6 26 6 40 0s26 6 40 0 16 4 20 2M98 66c14-6 26 6 40 0s26 6 40 0 16 4 20 2" fill="none" stroke="currentColor" strokeWidth="2.4" />
                  </svg>
                  <div className="ibtns">
                    <button type="button" onClick={jump('s-work')} aria-label={t('fd.d.toWork')} title={t('fd.d.toWork')}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="7" width="18" height="13" rx="2.5" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 12h18" /></svg>
                    </button>
                    <button type="button" onClick={jump('s-bill')} aria-label={t('fd.d.toBill')} title={t('fd.d.toBill')}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6" /></svg>
                    </button>
                  </div>
                </div>
                <p className="to"><span>{t('fd.role')}</span></p>
                <div className="pc-bot">
                  <div className="soc">
                    <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label={t('fd.d.insta')}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" /></svg>
                    </a>
                    <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" aria-label={t('fd.d.yt')}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="4" /><path d="m10 9 5 3-5 3z" fill="currentColor" /></svg>
                    </a>
                  </div>
                  <div className="cta">
                    <button type="button" className="about" onClick={() => letterRef.current?.showModal()}>{t('fd.d.about')}</button>
                    <span className="route">{t('fd.d.route')}</span>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Field notes: what is true right now */}
          <aside {...objProps('notes')}>
            <p className="nk"><span>{t('fd.d.notes')}::</span><b><i />{t('fd.d.live')}</b></p>
            <dl className="kv">
              <div><dt>{t('fd.d.time')}::</dt><dd>{ist} IST</dd></div>
              <div><dt>{t('fd.d.pos')}::</dt><dd>N 17°41′ / E 83°13′</dd></div>
              <div><dt>{t('fd.d.role')}::</dt><dd>{t('fd.d.vrole')}</dd></div>
              <div><dt>{t('fd.d.next')}::</dt><dd>{t('fd.r.vnext')}</dd></div>
            </dl>
            <div className="grid" role="img" aria-label={`${t('fd.d.grid')}: ${days}`}>
              {Array.from({ length: GRID }, (_, i) => <i key={i} className={i >= GRID - Math.min(days, GRID) ? 'on' : ''} />)}
            </div>
          </aside>

          {/* The record player: Dheeraj's own voice */}
          <aside {...objProps('record')} data-playing={playing || undefined}>
            <div className="deck">
              <div className="vinyl" aria-hidden="true"><div className="lab"><b>తెలుగు</b><span>Sugars</span></div></div>
              <span className="arm" aria-hidden="true" />
            </div>
            <div className="meta">
              <p className="nk"><span>{playing ? t('fd.d.air') : t('fd.d.off')}::</span></p>
              <p className="trk">{t('fd.d.track')}</p>
              <p className="art">{t('fd.d.artist')}</p>
            </div>
            {voice.available ? (
              <button type="button" className="play" onClick={voice.toggle} aria-pressed={playing}>
                {playing
                  ? <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" /></svg>
                  : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor" /></svg>}
                <span>{playing ? t('fd.d.stop') : t('fd.d.play')}</span>
              </button>
            ) : (
              <p className="nov">{t('fd.d.novoice')}</p>
            )}
            {voice.state === 'rec' && <span className="prog" aria-hidden="true"><span style={{ width: `${Math.round(voice.pct * 100)}%` }} /></span>}
          </aside>

          {focus && <button type="button" className="unfocus" aria-label={t('fd.close')} onClick={() => setFocus(null)}>{X_ICON}</button>}
        </div>
      </section>

      {/* The letter, from "About me" */}
      <dialog className="fdk-dlg letter" ref={letterRef} aria-labelledby="ltHi" onClick={(e) => { if (e.target === e.currentTarget) letterRef.current?.close(); }}>
        <button className="x" type="button" aria-label={t('fd.close')} onClick={() => letterRef.current?.close()}>{X_ICON}</button>
        <p className="nk"><span>{t('fd.d.letter')} ::</span></p>
        <h2 id="ltHi">{t('fd.pc.hi')}</h2>
        <p>{t('fd.pc.body')}</p>
        <p className="sign">{t('fd.pc.sign')}</p>
      </dialog>

      {/* అ: the work, labelled like food packets */}
      <section className="sec" id="s-work" aria-labelledby="workTitle">
        <Head l="అ" k={t('fd.s.work')} id="workTitle" sub={t('fd.work.sub')}>{accent(t('fd.say.2'))}</Head>
        <div className="works">
          {WORKS.map((wk, i) => (
            <button key={wk.k} type="button" className="wcard" onClick={() => setWork(i)}>
              <span className="wbadge" aria-hidden="true">{LETTERS[i]}</span>
              <span className="wart" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ART[wk.art] }} />
              <Facts w={wk} />
              <span className="wopen">{t('fd.open')}</span>
            </button>
          ))}
        </div>
      </section>
      <dialog className="fdk-dlg sheet" ref={sheetRef} onClose={() => setWork(null)} onClick={(e) => { if (e.target === e.currentTarget) setWork(null); }}>
        {w && work !== null && (
          <>
            <button className="x" type="button" aria-label={t('fd.close')} onClick={() => setWork(null)}>{X_ICON}</button>
            <div className="wart" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ART[w.art] }} />
            <p className="nk"><span>{LETTERS[work]} · {t('fd.s.work')} ::</span></p>
            <h3>{t(`fd.${w.k}.t`)}</h3>
            <p>{t(`fd.${w.k}.what`)}</p>
            <p>{t(`fd.${w.k}.more`)}</p>
            <Facts w={w} />
            <div className="row">
              {w.to && (
                <a className="btn primary" href={w.to} onClick={(e) => { setWork(null); go(w.to!)(e); }}>
                  <span>{t(w.cta || 'fd.visit')}</span>{ARROW}
                </a>
              )}
              <button className="btn" type="button" onClick={() => setWork(null)}>{t('fd.close')}</button>
            </div>
          </>
        )}
      </dialog>

      {/* ఆ: the bill */}
      <section className="sec bill" id="s-bill" aria-labelledby="billTitle">
        <Head l="ఆ" k={t('fd.s.bill')} id="billTitle" sub={t('fd.bill.sub')}>{accent(t('fd.say.3'))}</Head>
        <div className="receipt" role="group" aria-labelledby="billTitle">
          <div className="c big">TELUGU SUGARS</div><div className="c">{t('fd.r.head')}</div><hr />
          {row(t('fd.r.date'), fmt(receiptDate))}{row(t('fd.r.day'), `#${days}`)}<hr />
          {row(t('fd.r.l1'), fmt(DAY1))}{row(t('fd.r.l2'), days)}
          {row(t('fd.r.l3'), t('fd.r.v3'))}{row(t('fd.r.l4'), t('fd.r.v4'))}
          {row(t('fd.r.l5'), '₹0.00')}{row(t('fd.r.l6'), '0')}<hr />
          {row(t('fd.r.next'), t('fd.r.vnext'))}{row(t('fd.r.then'), t('fd.r.vthen'))}<hr />
          {row(t('fd.r.total'), t('fd.r.vtotal'), 'tot')}<hr />
          <div className="c">{t('fd.r.thanks')}</div>
          <div className="barcode" aria-hidden="true" />
          <div className="c code">TS-{String(days).padStart(4, '0')}</div>
        </div>
      </section>

      {/* ఇ: the rules */}
      <section className="sec" id="s-rules" aria-labelledby="rulesTitle">
        <Head l="ఇ" k={t('fd.s.rules')} id="rulesTitle">{t('fd.rules.t')}</Head>
        <ol className="rules">
          {[1, 2, 3, 4].map((n, i) => <li key={n}><b aria-hidden="true">{LETTERS[i]}</b><span>{t(`fd.r${n}`)}</span></li>)}
        </ol>
      </section>

      {/* ఈ: write to me */}
      <section className="sec write" id="s-contact" aria-labelledby="writeTitle">
        <Head l="ఈ" k={t('fd.s.write')} id="writeTitle" sub={t('fd.c.body')}>{t('fd.c.title')}</Head>
        <ul className="links">
          <li><a href="/creators" onClick={go('/creators')}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg><span>{t('fd.c.join')}</span></a></li>
          <li><a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" /></svg><span>{t('fd.c.insta')}</span></a></li>
          <li><a href="/watch" onClick={go('/watch')}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="4" /><path d="m10 9 5 3-5 3z" /></svg><span>{t('fd.c.watch')}</span></a></li>
          <li><a href="/atlas" onClick={go('/atlas')}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></svg><span>{t('fd.c.atlas')}</span></a></li>
        </ul>
      </section>
    </div>
  );
};

export default FounderPage;
