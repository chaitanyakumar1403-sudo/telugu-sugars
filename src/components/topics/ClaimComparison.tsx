import React, { useState } from 'react';
import { Claim } from '../../types/content';
import { useLanguage } from '../../context/LanguageContext';
import { CheckCircle2, AlertTriangle, HelpCircle, ArrowRightLeft, ShieldCheck } from 'lucide-react';

interface ClaimComparisonProps {
  claims: Claim[];
}

export const ClaimComparison: React.FC<ClaimComparisonProps> = ({ claims }) => {
  const { language } = useLanguage();
  const [claimAId, setClaimAId] = useState(claims[0]?.id || 'claim-1');
  const [claimBId, setClaimBId] = useState(claims[1]?.id || 'claim-2');

  const claimA = claims.find((c) => c.id === claimAId) || claims[0];
  const claimB = claims.find((c) => c.id === claimBId) || claims[1];

  const getComparisonData = (claim: Claim) => {
    return {
      text: language === 'te' ? claim.teluguClaimText : claim.claimText,
      supports: claim.summary,
      limits: claim.caveats,
      unknowns: claim.whatThisDoesNotProve,
    };
  };

  const dataA = getComparisonData(claimA);
  const dataB = getComparisonData(claimB);

  return (
    <div className="glass-card p-6 sm:p-8 rounded-2xl bg-[#0e1117] flex flex-col gap-8 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2 border border-amber-500/30">
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Interactive Scientific Comparison</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            Compare Two Claims Side-by-Side
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Examine the empirical boundaries, clinical limitations, and scientific unknowns between two popular dietary claims.
          </p>
        </div>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Claim A:
          </label>
          <select
            value={claimAId}
            onChange={(e) => setClaimAId(e.target.value)}
            className="bg-black/60 border border-amber-500/40 text-amber-200 rounded-xl p-3 text-xs focus:outline-none"
            aria-label="Select Claim A"
          >
            {claims.map((c) => (
              <option key={c.id} value={c.id}>
                {c.claimText.slice(0, 50)}...
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-teal-400 uppercase tracking-wider">
            Claim B:
          </label>
          <select
            value={claimBId}
            onChange={(e) => setClaimBId(e.target.value)}
            className="bg-black/60 border border-teal-500/40 text-teal-200 rounded-xl p-3 text-xs focus:outline-none"
            aria-label="Select Claim B"
          >
            {claims.map((c) => (
              <option key={c.id} value={c.id}>
                {c.claimText.slice(0, 50)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Comparative Matrix (PDF Page 3: supports, limits, remains unknown) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Column 1: What Evidence Supports */}
        <div className="p-5 rounded-xl bg-teal-500/10 border border-teal-500/30 flex flex-col gap-3">
          <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
            <span>What Evidence Supports</span>
          </h4>
          <div className="flex flex-col gap-4 text-xs divide-y divide-teal-500/20">
            <div className="pt-2">
              <strong className="text-amber-300 block mb-1">Claim A:</strong>
              <p className="text-slate-200 leading-relaxed">{dataA.supports}</p>
            </div>
            <div className="pt-3">
              <strong className="text-teal-300 block mb-1">Claim B:</strong>
              <p className="text-slate-200 leading-relaxed">{dataB.supports}</p>
            </div>
          </div>
        </div>

        {/* Column 2: Where Evidence Reaches Its Limits */}
        <div className="p-5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col gap-3">
          <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Where Evidence Reaches Its Limits</span>
          </h4>
          <div className="flex flex-col gap-4 text-xs divide-y divide-amber-500/20">
            <div className="pt-2">
              <strong className="text-amber-300 block mb-1">Claim A Limits:</strong>
              <p className="text-slate-200 leading-relaxed">{dataA.limits}</p>
            </div>
            <div className="pt-3">
              <strong className="text-teal-300 block mb-1">Claim B Limits:</strong>
              <p className="text-slate-200 leading-relaxed">{dataB.limits}</p>
            </div>
          </div>
        </div>

        {/* Column 3: What Remains Unknown */}
        <div className="p-5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex flex-col gap-3">
          <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-rose-400" />
            <span>What Remains Unknown</span>
          </h4>
          <div className="flex flex-col gap-4 text-xs divide-y divide-rose-500/20">
            <div className="pt-2">
              <strong className="text-amber-300 block mb-1">Claim A Unknowns:</strong>
              <p className="text-slate-200 leading-relaxed">{dataA.unknowns}</p>
            </div>
            <div className="pt-3">
              <strong className="text-teal-300 block mb-1">Claim B Unknowns:</strong>
              <p className="text-slate-200 leading-relaxed">{dataB.unknowns}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimComparison;
