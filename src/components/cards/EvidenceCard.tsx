import React from 'react';
import { Paper, Claim } from '../../types/content';
import { useLanguage } from '../../context/LanguageContext';
import { ExternalLink, CheckCircle2, AlertTriangle, FileText, UserCheck } from 'lucide-react';

interface EvidenceCardProps {
  claim: Claim;
  paper?: Paper;
  onExploreGraph?: (claimId: string) => void;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({ claim, paper, onExploreGraph }) => {
  const { language, t } = useLanguage();

  const claimText = language === 'te' ? claim.teluguClaimText : claim.claimText;
  const summary = language === 'te' ? claim.teluguSummary : claim.summary;

  const gradeColor =
    claim.evidenceGrade === 'Robust'
      ? 'text-teal-400 bg-teal-500/10 border-teal-500/30'
      : claim.evidenceGrade === 'Refuted'
      ? 'text-rose-400 bg-rose-500/10 border-rose-500/30'
      : 'text-amber-400 bg-amber-500/10 border-amber-500/30';

  return (
    <div className="glass-card p-6 flex flex-col justify-between border-l-4 border-l-amber-500/60 shadow-lg">
      <div>
        {/* Header: Evidence Grade Pill & Source Year */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${gradeColor}`}>
            Status: {claim.evidenceGrade}
          </span>
          {paper && (
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              {paper.journal} ({paper.year})
            </span>
          )}
        </div>

        {/* Claim Text */}
        <h4 className="text-lg sm:text-xl font-bold text-white mb-2 leading-snug">
          "{claimText}"
        </h4>

        {/* Summary Description */}
        <p className="text-sm text-slate-300 leading-relaxed mb-4">
          {summary}
        </p>

        {/* PDF Section 7 Requirement: Distinct "What the study found" vs "What it cannot tell us" */}
        <div className="evidence-split text-xs">
          <div className="found-box">
            <div className="flex items-center gap-1.5 font-bold text-teal-300 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
              <span>{t('what_study_found')}</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {paper ? paper.mainFinding : claim.summary}
            </p>
          </div>

          <div className="cannot-tell-box">
            <div className="flex items-center gap-1.5 font-bold text-rose-300 mb-1">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>{t('what_cannot_tell')}</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {claim.whatThisDoesNotProve}
            </p>
          </div>
        </div>
      </div>

      {/* Footer: Reviewer Role, Date & DOI External Link */}
      <div className="mt-5 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-1.5 font-mono">
          <UserCheck className="w-3.5 h-3.5 text-slate-500" />
          <span>
            {claim.reviewerName} • {claim.reviewerRole}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {paper && (
            <a
              href={paper.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 font-semibold"
              title="Open verified study via DOI link"
            >
              <span>DOI Citation</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}

          {onExploreGraph && (
            <button
              onClick={() => onExploreGraph(claim.id)}
              className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold transition-colors"
            >
              Explore Graph →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EvidenceCard;
