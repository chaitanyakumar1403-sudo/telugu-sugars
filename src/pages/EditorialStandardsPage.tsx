import React from 'react';
import { ShieldCheck, UserCheck, AlertTriangle, CheckCircle2, History } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const COPY = {
  en: {
    kicker: 'Institutional Transparency',
    title: 'Editorial & Scientific Standards',
    lead: 'How Telugu Sugars conducts forensic dietary investigations, verifies clinical studies, manages corrections, and protects scientific integrity.',
    coiTitle: 'Conflict of Interest Disclosure',
    coiIntro: 'Telugu Sugars maintains an impenetrable editorial firewall. We do not accept advertising, sponsorships, gifts, or financial subsidies from:',
    coiList: [
      'Packaged food, snack, or confectionery manufacturers',
      'Commercial jaggery, palm sugar, or cane processing conglomerates',
      'Artificial or non-nutritive sweetener producers',
      'Dietary supplement or multi-level marketing (MLM) wellness brands',
    ],
    coiOutro: 'All investigative reports, video scripts, and research graph connections are produced independently by our editorial team and reviewed by qualified biochemists and physicians.',
    peerTitle: 'Peer Review Protocol & Evidence Hierarchy',
    peerIntro: 'We prioritize peer-reviewed evidence according to a strict methodological hierarchy:',
    tiers: [
      ['Tier 1: High-Confidence Clinical', 'Systematic Reviews, Meta-Analyses, and Double-Blind Randomized Controlled Trials (RCTs) in human cohorts.'],
      ['Tier 2: Observational / Prospective', 'Longitudinal cohort studies with continuous glucose monitor (CGM) validation, explicitly noting confounding factors.'],
      ['Tier 3: Mechanistic & In-Vitro', 'Laboratory chemical assays and cell cultures, always tagged with limitation disclaimers.'],
      ['Rejected as Evidence', 'Uncontrolled anecdotal testimonials, corporate press releases, and unvalidated traditional claims without biochemical corroboration.'],
    ],
    fixTitle: 'Formal Corrections Policy & Public Audit Trail',
    fixIntro: 'Scientific accuracy is our foremost commitment. When errors of fact, misquoted data, or outdated studies are identified:',
    fixList: [
      'We do not stealthily edit articles without disclosure.',
      'A prominent timestamped correction box is appended to the top of the affected article or claim dossier detailing what changed and why.',
    ],
    fixMail: 'Readers can submit correction queries directly via',
    safeTitle: 'Strict Public Health Safety Guardrails',
    safeIntro: 'As mandated by our medical ethics charter, Telugu Sugars strictly avoids:',
    safeList: [
      'Unvalidated food "toxicity" or "danger" scores that induce unnecessary eating anxiety.',
      'Personalized dietary or medical prescriptions for individual patients.',
      'Unmoderated health claims or raw AI-generated evidence summaries without expert human verification.',
    ],
  },
  te: {
    kicker: 'పూర్తి పారదర్శకత',
    title: 'మా సంపాదకీయ, శాస్త్రీయ నియమాలు',
    lead: 'తెలుగు సుగర్స్ ఆహారం గురించి ఎలా పరిశోధిస్తుంది, వైద్య పరిశోధనలను ఎలా సరిచూస్తుంది, తప్పులను ఎలా సరిదిద్దుతుంది, సైన్స్ నిజాయితీని ఎలా కాపాడుతుందో ఇక్కడ చూడండి.',
    coiTitle: 'ఎవరి ప్రభావమూ లేదు',
    coiIntro: 'మా సంపాదకీయ నిర్ణయాల్లో ఎవరి జోక్యమూ ఉండదు. కింది వాళ్ళ నుంచి మేము ప్రకటనలు, స్పాన్సర్‌షిప్‌లు, బహుమతులు, ఆర్థిక సాయం ఏవీ తీసుకోం:',
    coiList: [
      'ప్యాకెట్ ఆహారం, స్నాక్స్, స్వీట్లు తయారు చేసే కంపెనీలు',
      'బెల్లం, తాటి బెల్లం, చెరకు ప్రాసెసింగ్ చేసే పెద్ద వ్యాపార సంస్థలు',
      'కృత్రిమ స్వీటెనర్లు, కేలరీలు లేని తీపి పదార్థాలు తయారు చేసేవాళ్ళు',
      'సప్లిమెంట్ కంపెనీలు, మల్టీ-లెవల్ మార్కెటింగ్ (MLM) వెల్‌నెస్ బ్రాండ్లు',
    ],
    coiOutro: 'మా పరిశోధన కథనాలు, వీడియో స్క్రిప్ట్‌లు, పరిశోధనల మధ్య సంబంధాలు అన్నీ మా బృందమే స్వతంత్రంగా తయారు చేస్తుంది. అర్హత ఉన్న బయోకెమిస్టులు, డాక్టర్లు వాటిని సరిచూస్తారు.',
    peerTitle: 'ఆధారాలను ఎలా ఎంచుకుంటాం',
    peerIntro: 'నిపుణులు సరిచూసిన పరిశోధనలకే ప్రాధాన్యం ఇస్తాం, ఈ కఠినమైన వరుసలో:',
    tiers: [
      ['స్థాయి 1: బలమైన వైద్య ఆధారాలు', 'మనుషుల మీద చేసిన సిస్టమాటిక్ రివ్యూలు, మెటా-అనాలిసిస్‌లు, డబుల్-బ్లైండ్ ర్యాండమైజ్డ్ కంట్రోల్డ్ ట్రయల్స్ (RCTలు).'],
      ['స్థాయి 2: దీర్ఘకాల పరిశీలన', 'చాలా కాలం పాటు ప్రజలను గమనించిన అధ్యయనాలు, షుగర్ మానిటర్ (CGM) తో సరిచూసినవి. ఫలితాన్ని ప్రభావితం చేసే ఇతర అంశాలను స్పష్టంగా చెబుతాం.'],
      ['స్థాయి 3: ల్యాబ్ పరీక్షలు', 'ల్యాబ్‌లో చేసే రసాయన పరీక్షలు, కణాల మీద ప్రయోగాలు. వీటి పరిమితులను ఎప్పుడూ స్పష్టంగా రాస్తాం.'],
      ['ఆధారంగా అంగీకరించనివి', 'పరీక్షించని వ్యక్తిగత అనుభవాలు, కంపెనీల ప్రెస్ రిలీజ్‌లు, సైన్స్ ఆధారం లేని సంప్రదాయ వాదనలు.'],
    ],
    fixTitle: 'తప్పులు సరిదిద్దే విధానం',
    fixIntro: 'సైన్స్ కచ్చితత్వమే మా మొదటి బాధ్యత. వాస్తవాల్లో తప్పు, తప్పుగా చెప్పిన సమాచారం, పాతబడిన పరిశోధన కనిపిస్తే:',
    fixList: [
      'ఎవరికీ చెప్పకుండా కథనాలను రహస్యంగా మార్చం.',
      'ఆ కథనం పైభాగంలో తేదీ, సమయంతో ఒక సవరణ పెట్టె పెడతాం — ఏం మారిందో, ఎందుకు మారిందో అందులో రాస్తాం.',
    ],
    fixMail: 'తప్పులు కనిపిస్తే పాఠకులు నేరుగా ఈ ఈమెయిల్‌కి రాయొచ్చు:',
    safeTitle: 'ప్రజారోగ్యం కోసం మేము పాటించే జాగ్రత్తలు',
    safeIntro: 'మా వైద్య నైతిక నియమాల ప్రకారం, తెలుగు సుగర్స్ వీటికి పూర్తిగా దూరంగా ఉంటుంది:',
    safeList: [
      'అనవసర భయం పుట్టించే, ఆధారం లేని ఆహార "విషం" లేదా "ప్రమాదం" స్కోర్లు.',
      'ఒక్కో వ్యక్తికి ప్రత్యేకంగా ఆహారం లేదా మందుల సలహాలు.',
      'నిపుణులు సరిచూడని ఆరోగ్య వాదనలు, AI రాసిన సమాచారాన్ని మనిషి చూడకుండా ప్రచురించడం.',
    ],
  },
};

const TIER_COLOURS = ['text-teal-300', 'text-amber-300', 'text-blue-300', 'text-rose-300'];

export const EditorialStandardsPage: React.FC = () => {
  const { language } = useLanguage();
  const c = COPY[language];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl flex flex-col gap-10 pb-24">
      {/* Header */}
      <div className="border-b border-white/10 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/15 text-teal-300 text-xs font-bold uppercase tracking-wider mb-3 border border-teal-500/30">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{c.kicker}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
          {c.title}
        </h1>
        <p className="text-slate-300 text-base mt-2 leading-relaxed">
          {c.lead}
        </p>
      </div>

      {/* 1. Conflict of Interest Disclosure */}
      <section className="glass-card p-6 sm:p-8 rounded-2xl bg-(--bg-panel) flex flex-col gap-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-teal-400" />
          <span>{c.coiTitle}</span>
        </h2>
        <div className="text-xs sm:text-sm text-slate-300 leading-relaxed flex flex-col gap-3">
          <p>{c.coiIntro}</p>
          <ul className="list-disc pl-5 flex flex-col gap-1.5 text-slate-400">
            {c.coiList.map((x) => <li key={x}>{x}</li>)}
          </ul>
          <p>{c.coiOutro}</p>
        </div>
      </section>

      {/* 2. Peer Review & Evidence Sourcing Protocol */}
      <section className="glass-card p-6 sm:p-8 rounded-2xl bg-(--bg-panel) flex flex-col gap-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-amber-400" />
          <span>{c.peerTitle}</span>
        </h2>
        <div className="text-xs sm:text-sm text-slate-300 leading-relaxed flex flex-col gap-3">
          <p>{c.peerIntro}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {c.tiers.map(([title, body], i) => (
              <div key={title} className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                <strong className={`${TIER_COLOURS[i]} block mb-1`}>{title}</strong>
                <span className="text-xs text-slate-400">{body}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Formal Corrections Policy */}
      <section className="glass-card p-6 sm:p-8 rounded-2xl bg-(--bg-panel) flex flex-col gap-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <History className="w-5 h-5 text-rose-400" />
          <span>{c.fixTitle}</span>
        </h2>
        <div className="text-xs sm:text-sm text-slate-300 leading-relaxed flex flex-col gap-3">
          <p>{c.fixIntro}</p>
          <ul className="list-disc pl-5 flex flex-col gap-1.5 text-slate-400">
            {c.fixList.map((x) => <li key={x}>{x}</li>)}
            <li>{c.fixMail} <code className="text-amber-300 font-mono">corrections@telugusugars.org</code>.</li>
          </ul>
        </div>
      </section>

      {/* 4. Safety Guardrails (PDF Section 5 Directive) */}
      <section className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col gap-3 text-xs sm:text-sm text-slate-200">
        <h3 className="font-bold text-amber-300 flex items-center gap-2 text-base">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          <span>{c.safeTitle}</span>
        </h3>
        <p className="leading-relaxed">{c.safeIntro}</p>
        <ul className="list-disc pl-5 flex flex-col gap-1 text-slate-300">
          {c.safeList.map((x) => <li key={x}>{x}</li>)}
        </ul>
      </section>
    </div>
  );
};

export default EditorialStandardsPage;
