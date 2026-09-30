import React, { useEffect } from 'react';
import { Paper, Relationship } from '../../types/content';
import { useLanguage } from '../../context/LanguageContext';
import { X, ExternalLink, Calendar, Users, FlaskConical, AlertCircle, CheckCircle, UserCheck } from 'lucide-react';

interface PaperDrawerProps {
  paper: Paper | null;
  relationship?: Relationship | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PaperDrawer: React.FC<PaperDrawerProps> = ({
  paper,
  relationship,
  isOpen,
  onClose,
}) => {
  const { t } = useLanguage();

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !paper) return null;

  const relBadgeColor =
    relationship?.relationshipType === 'supports'
      ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
      : relationship?.relationshipType === 'challenges'
      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
      : 'bg-amber-500/20 text-amber-300 border-amber-500/40';

  return (
    <div
      data-testid="paper-drawer"
      className="fixed inset-y-0 right-0 z-50 w-full max-w-xl bg-[#0d1014] border-l border-white/10 shadow-2xl flex flex-col justify-between overflow-y-auto transform transition-transform duration-300 ease-out"
      role="dialog"
      aria-modal="true"
      aria-label="Research Study Inspection Dossier"
    >
      <div className="p-6 sm:p-8 flex flex-col gap-6">
        {/* Drawer Header */}
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/10 text-slate-300 border border-white/10">
                {paper.studyType}
              </span>
              {relationship && (
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${relBadgeColor}`}>
                  {relationship.relationshipType}
                </span>
              )}
            </div>
            <span className="text-xs font-mono text-amber-400">
              {paper.journal} • {paper.year}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            aria-label="Close study drawer (Escape)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Paper Title */}
        <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
          {paper.title}
        </h3>

        {/* Authors */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Users className="w-4 h-4 text-slate-500 flex-shrink-0" />
          <span>{paper.authors.join(', ')}</span>
        </div>

        {/* Population & Sample Details */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/5 flex flex-col gap-2.5 text-xs">
          <div className="flex items-center justify-between text-slate-300">
            <span className="font-semibold text-slate-400 flex items-center gap-1.5">
              <FlaskConical className="w-3.5 h-3.5 text-amber-400" />
              Trial Cohort:
            </span>
            <span className="font-mono text-amber-300">{paper.sampleSize}</span>
          </div>
          <div className="text-slate-300 leading-relaxed">
            <strong className="text-slate-400">Demographic:</strong> {paper.population}
          </div>
        </div>

        {/* Findings (PDF Section 4: What the study found) */}
        <div className="flex flex-col gap-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4" />
            <span>{t('what_study_found')}</span>
          </h4>
          <p className="text-sm text-slate-200 bg-teal-500/10 border-l-2 border-teal-500 p-3 rounded-r-lg leading-relaxed">
            {paper.mainFinding}
          </p>
        </div>

        {/* Crucial Limitations (PDF Section 6: Limitations) */}
        <div className="flex flex-col gap-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4" />
            <span>Study Limitations & Confounders</span>
          </h4>
          <p className="text-sm text-slate-200 bg-rose-500/10 border-l-2 border-rose-500 p-3 rounded-r-lg leading-relaxed">
            {paper.limitations}
          </p>
        </div>

        {/* Editorial Rationale */}
        {relationship && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-xs">
            <strong className="text-amber-300 block mb-1">Editorial Graph Connection:</strong>
            <p className="text-slate-300 leading-relaxed">{relationship.editorialRationale}</p>
          </div>
        )}
      </div>

      {/* Drawer Footer with Reviewer Credentials and Direct DOI Link */}
      <div className="p-6 bg-black/60 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-col gap-0.5 text-slate-400">
          <span className="flex items-center gap-1 text-[11px] font-mono">
            <UserCheck className="w-3.5 h-3.5 text-teal-400" /> Verified by {paper.reviewedBy}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-slate-500">
            <Calendar className="w-3 h-3" /> Checked: {paper.sourceCheckDate}
          </span>
        </div>

        <a
          href={paper.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs shadow-md transition-colors"
        >
          <span>Open Full DOI Paper</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};

export default PaperDrawer;
