import React, { useState } from 'react';
import { Paper } from '../types/content';
import { getClaims, getPapers, getRelationships } from '../services/contentService';
import { useLanguage } from '../context/LanguageContext';
import GraphCanvas from '../components/research/GraphCanvas';
import GraphFilters from '../components/research/GraphFilters';
import AccessibleListView from '../components/research/AccessibleListView';
import PaperDrawer from '../components/research/PaperDrawer';
import { Compass, ShieldAlert, ChevronRight } from 'lucide-react';

export const ResearchPage: React.FC = () => {
  const { language } = useLanguage();
  const claims = getClaims();
  const allPapers = getPapers();
  const allRelationships = getRelationships();

  const [selectedClaimId, setSelectedClaimId] = useState<string>(claims[0]?.id || 'claim-1');
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isTableView, setIsTableView] = useState(false);
  const [studyTypeFilter, setStudyTypeFilter] = useState('all');
  const [relationshipFilter, setRelationshipFilter] = useState('all');

  const currentClaim = claims.find((c) => c.id === selectedClaimId) || claims[0];
  const claimRelationships = allRelationships.filter((r) => r.claimId === currentClaim.id);

  // Filter papers for current claim
  const currentPapers = allPapers.filter((p) =>
    claimRelationships.some((r) => r.paperId === p.id)
  );

  // Apply filters
  const filteredPapers = currentPapers.filter((p) => {
    const matchesType = studyTypeFilter === 'all' || p.studyType === studyTypeFilter;
    const rel = claimRelationships.find((r) => r.paperId === p.id);
    const matchesRel = relationshipFilter === 'all' || rel?.relationshipType === relationshipFilter;
    return matchesType && matchesRel;
  });

  const handleSelectPaper = (paper: Paper) => {
    setSelectedPaper(paper);
    setIsDrawerOpen(true);
  };

  const currentRelationship = selectedPaper
    ? claimRelationships.find((r) => r.paperId === selectedPaper.id)
    : null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl flex flex-col gap-8 pb-24">
      {/* Header & Page Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/15 text-teal-300 text-xs font-bold uppercase tracking-wider mb-2 border border-teal-500/30">
            <Compass className="w-3.5 h-3.5" />
            <span>Research Explorer (Connected Papers Engine)</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
            Interactive Evidence Network
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Trace health claims to primary clinical evidence. Visual proximity serves as a navigation aid to explore peer-reviewed studies without sensational verdicts.
          </p>
        </div>

        {/* Claim Selector Dropdown */}
        <div className="flex flex-col gap-1 w-full sm:w-auto">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Select Active Claim:
          </label>
          <select
            value={selectedClaimId}
            onChange={(e) => {
              setSelectedClaimId(e.target.value);
              setSelectedPaper(null);
              setIsDrawerOpen(false);
            }}
            className="bg-[#12151c] border border-amber-500/40 text-amber-300 font-semibold rounded-xl px-4 py-2.5 text-xs focus:outline-none"
            aria-label="Select claim to explore"
          >
            {claims.map((c) => (
              <option key={c.id} value={c.id}>
                {c.claimId.replace('claim-', '').replace(/-/g, ' ').toUpperCase()}: {c.claimText.slice(0, 48)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected Claim Banner */}
      <div className="p-6 rounded-2xl bg-[#10141b] border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Center Claim Node:
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                currentClaim.evidenceGrade === 'Robust'
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                  : currentClaim.evidenceGrade === 'Refuted'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}
            >
              Grade: {currentClaim.evidenceGrade}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
            "{language === 'te' ? currentClaim.teluguClaimText : currentClaim.claimText}"
          </h2>
          <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
            {language === 'te' ? currentClaim.teluguSummary : currentClaim.summary}
          </p>
        </div>

        <div className="flex-shrink-0 text-right text-xs text-slate-400 font-mono">
          <div>Last Reviewed: {currentClaim.lastReviewedDate}</div>
          <div className="text-amber-400">{currentClaim.reviewerName}</div>
        </div>
      </div>

      {/* Filters & View Toggle Bar */}
      <GraphFilters
        studyTypeFilter={studyTypeFilter}
        onStudyTypeChange={setStudyTypeFilter}
        relationshipFilter={relationshipFilter}
        onRelationshipChange={setRelationshipFilter}
        isTableView={isTableView}
        onToggleTableView={() => setIsTableView((prev) => !prev)}
      />

      {/* Main View Area: Canvas vs Accessible Table */}
      {isTableView ? (
        <AccessibleListView
          papers={filteredPapers}
          relationships={claimRelationships}
          onSelectPaper={handleSelectPaper}
        />
      ) : (
        <div className="flex flex-col gap-4">
          <GraphCanvas
            claim={currentClaim}
            papers={filteredPapers}
            relationships={claimRelationships}
            onSelectPaper={handleSelectPaper}
            selectedPaper={selectedPaper}
          />

          {/* Mobile-Friendly Study Carousel (PDF Section 7 requirement) */}
          <div className="md:hidden flex flex-col gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Swipeable Studies for This Claim:
            </span>
            <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
              {filteredPapers.map((paper) => {
                const rel = claimRelationships.find((r) => r.paperId === paper.id);
                return (
                  <div
                    key={paper.id}
                    onClick={() => handleSelectPaper(paper)}
                    className="min-w-[260px] snap-start glass-card p-4 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-center text-[10px] text-amber-400 font-mono mb-1">
                        <span>{paper.year}</span>
                        <span className="uppercase font-bold">{rel?.relationshipType}</span>
                      </div>
                      <h4 className="text-xs font-bold text-white line-clamp-2 mb-2">
                        {paper.title}
                      </h4>
                      <p className="text-[11px] text-slate-300 line-clamp-2">
                        {paper.mainFinding}
                      </p>
                    </div>
                    <button className="mt-3 text-xs text-amber-400 font-bold flex items-center gap-1">
                      <span>View Full Paper Dossier</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Evidence Language & Scientific Standard Disclosure (PDF Section 6) */}
      <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-400 flex items-start gap-3">
        <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Evidence Language Standard:</strong> Telugu Sugars avoids unvalidated universal danger scores. We report study design categories (Randomized Trial, Cohort, In-Vitro), sample demographics, and clinical uncertainty. Summaries state populations, caveats, and limitations without promotional hyperbole.
        </p>
      </div>

      {/* Slide-out Paper Detail Drawer */}
      <PaperDrawer
        paper={selectedPaper}
        relationship={currentRelationship}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
};

export default ResearchPage;
