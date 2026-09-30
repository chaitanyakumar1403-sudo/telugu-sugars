import React from 'react';
import { ShieldCheck, UserCheck, AlertTriangle, FileText, CheckCircle2, History } from 'lucide-react';

export const EditorialStandardsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl flex flex-col gap-10 pb-24">
      {/* Header */}
      <div className="border-b border-white/10 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/15 text-teal-300 text-xs font-bold uppercase tracking-wider mb-3 border border-teal-500/30">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Institutional Transparency</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
          Editorial & Scientific Standards
        </h1>
        <p className="text-slate-300 text-base mt-2 leading-relaxed">
          How Telugu Sugars conducts forensic dietary investigations, verifies clinical studies, manages corrections, and protects scientific integrity.
        </p>
      </div>

      {/* 1. Conflict of Interest Disclosure */}
      <section className="glass-card p-6 sm:p-8 rounded-2xl bg-[#0f1217] flex flex-col gap-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-teal-400" />
          <span>Conflict of Interest Disclosure</span>
        </h2>
        <div className="text-xs sm:text-sm text-slate-300 leading-relaxed flex flex-col gap-3">
          <p>
            Telugu Sugars maintains an impenetrable editorial firewall. We do not accept advertising, sponsorships, gifts, or financial subsidies from:
          </p>
          <ul className="list-disc pl-5 flex flex-col gap-1.5 text-slate-400">
            <li>Packaged food, snack, or confectionery manufacturers</li>
            <li>Commercial jaggery, palm sugar, or cane processing conglomerates</li>
            <li>Artificial or non-nutritive sweetener producers</li>
            <li>Dietary supplement or multi-level marketing (MLM) wellness brands</li>
          </ul>
          <p>
            All investigative reports, video scripts, and research graph connections are produced independently by our editorial team and reviewed by qualified biochemists and physicians.
          </p>
        </div>
      </section>

      {/* 2. Peer Review & Evidence Sourcing Protocol */}
      <section className="glass-card p-6 sm:p-8 rounded-2xl bg-[#0f1217] flex flex-col gap-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-amber-400" />
          <span>Peer Review Protocol & Evidence Hierarchy</span>
        </h2>
        <div className="text-xs sm:text-sm text-slate-300 leading-relaxed flex flex-col gap-3">
          <p>
            We prioritize peer-reviewed evidence according to a strict methodological hierarchy:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
              <strong className="text-teal-300 block mb-1">Tier 1: High-Confidence Clinical</strong>
              <span className="text-xs text-slate-400">Systematic Reviews, Meta-Analyses, and Double-Blind Randomized Controlled Trials (RCTs) in human cohorts.</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
              <strong className="text-amber-300 block mb-1">Tier 2: Observational / Prospective</strong>
              <span className="text-xs text-slate-400">Longitudinal cohort studies with continuous glucose monitor (CGM) validation, explicitly noting confounding factors.</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
              <strong className="text-blue-300 block mb-1">Tier 3: Mechanistic & In-Vitro</strong>
              <span className="text-xs text-slate-400">Laboratory chemical assays and cell cultures, always tagged with limitation disclaimers.</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
              <strong className="text-rose-300 block mb-1">Rejected as Evidence</strong>
              <span className="text-xs text-slate-400">Uncontrolled anecdotal testimonials, corporate press releases, and unvalidated traditional claims without biochemical corroboration.</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Formal Corrections Policy */}
      <section className="glass-card p-6 sm:p-8 rounded-2xl bg-[#0f1217] flex flex-col gap-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <History className="w-5 h-5 text-rose-400" />
          <span>Formal Corrections Policy & Public Audit Trail</span>
        </h2>
        <div className="text-xs sm:text-sm text-slate-300 leading-relaxed flex flex-col gap-3">
          <p>
            Scientific accuracy is our foremost commitment. When errors of fact, misquoted data, or outdated studies are identified:
          </p>
          <ul className="list-disc pl-5 flex flex-col gap-1.5 text-slate-400">
            <li>We do not stealthily edit articles without disclosure.</li>
            <li>A prominent timestamped correction box is appended to the top of the affected article or claim dossier detailing what changed and why.</li>
            <li>Readers can submit correction queries directly via <code className="text-amber-300 font-mono">corrections@telugusugars.org</code>.</li>
          </ul>
        </div>
      </section>

      {/* 4. Safety Guardrails (PDF Section 5 Directive) */}
      <section className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col gap-3 text-xs sm:text-sm text-slate-200">
        <h3 className="font-bold text-amber-300 flex items-center gap-2 text-base">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          <span>Strict Public Health Safety Guardrails</span>
        </h3>
        <p className="leading-relaxed">
          As mandated by our medical ethics charter, Telugu Sugars strictly avoids:
        </p>
        <ul className="list-disc pl-5 flex flex-col gap-1 text-slate-300">
          <li>Unvalidated food "toxicity" or "danger" scores that induce unnecessary eating anxiety.</li>
          <li>Personalized dietary or medical prescriptions for individual patients.</li>
          <li>Unmoderated health claims or raw AI-generated evidence summaries without expert human verification.</li>
        </ul>
      </section>
    </div>
  );
};

export default EditorialStandardsPage;
