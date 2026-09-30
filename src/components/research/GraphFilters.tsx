import React from 'react';
import { LayoutList, Network, Filter } from 'lucide-react';

interface GraphFiltersProps {
  studyTypeFilter: string;
  onStudyTypeChange: (type: string) => void;
  relationshipFilter: string;
  onRelationshipChange: (rel: string) => void;
  isTableView: boolean;
  onToggleTableView: () => void;
}

export const GraphFilters: React.FC<GraphFiltersProps> = ({
  studyTypeFilter,
  onStudyTypeChange,
  relationshipFilter,
  onRelationshipChange,
  isTableView,
  onToggleTableView,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-white/5 border border-white/10 text-xs">
      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 font-bold text-slate-300">
          <Filter className="w-3.5 h-3.5 text-amber-400" />
          <span>Filters:</span>
        </div>

        {/* Study Design Filter */}
        <select
          value={studyTypeFilter}
          onChange={(e) => onStudyTypeChange(e.target.value)}
          className="bg-black/50 border border-white/15 text-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium focus:border-amber-400 focus:outline-none"
          aria-label="Filter studies by design"
        >
          <option value="all">All Study Designs</option>
          <option value="Randomized Controlled Trial (RCT)">Human RCTs</option>
          <option value="Systematic Review / Meta-Analysis">Meta-Analyses</option>
          <option value="Prospective Cohort Study">Cohort Studies</option>
          <option value="Mechanistic / In-Vitro">Mechanistic / In-Vitro</option>
        </select>

        {/* Relationship Filter */}
        <select
          value={relationshipFilter}
          onChange={(e) => onRelationshipChange(e.target.value)}
          className="bg-black/50 border border-white/15 text-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium focus:border-amber-400 focus:outline-none"
          aria-label="Filter by relationship"
        >
          <option value="all">All Relationships</option>
          <option value="supports">Supports Claim</option>
          <option value="challenges">Challenges / Refutes</option>
          <option value="context">Contextual / Assay</option>
        </select>
      </div>

      {/* View Switcher: Interactive Graph vs Accessible Table */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleTableView}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold bg-white/10 hover:bg-white/15 text-white border border-white/10 transition-colors"
          aria-label={isTableView ? 'Switch to Graph View' : 'Switch to Table View'}
        >
          {isTableView ? (
            <>
              <Network className="w-3.5 h-3.5 text-amber-400" />
              <span>Interactive Graph View</span>
            </>
          ) : (
            <>
              <LayoutList className="w-3.5 h-3.5 text-teal-400" />
              <span>Accessible Table View</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default GraphFilters;
