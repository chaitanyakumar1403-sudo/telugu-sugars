import React from 'react';
import { Paper, Relationship } from '../../types/content';
import { ExternalLink } from 'lucide-react';

interface AccessibleListViewProps {
  papers: Paper[];
  relationships: Relationship[];
  onSelectPaper: (paper: Paper) => void;
}

export const AccessibleListView: React.FC<AccessibleListViewProps> = ({
  papers,
  relationships,
  onSelectPaper,
}) => {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-white/10 bg-black/40">
      <table className="w-full text-left text-xs text-slate-300" aria-label="Evidence Studies Table">
        <thead className="bg-white/5 border-b border-white/10 text-slate-400 font-bold uppercase tracking-wider">
          <tr>
            <th scope="col" className="p-4">Study / Paper Title</th>
            <th scope="col" className="p-4">Study Design</th>
            <th scope="col" className="p-4">Cohort Size</th>
            <th scope="col" className="p-4">Relationship</th>
            <th scope="col" className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {papers.map((paper) => {
            const rel = relationships.find((r) => r.paperId === paper.id);
            const relType = rel?.relationshipType || 'context';

            const badgeColor =
              relType === 'supports'
                ? 'text-teal-400 bg-teal-500/10 border-teal-500/30'
                : relType === 'challenges'
                ? 'text-rose-400 bg-rose-500/10 border-rose-500/30'
                : 'text-amber-400 bg-amber-500/10 border-amber-500/30';

            return (
              <tr key={paper.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4 font-semibold text-white max-w-xs">
                  <div>{paper.title}</div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {paper.authors[0]} et al. • {paper.journal} ({paper.year})
                  </div>
                </td>
                <td className="p-4">
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                    {paper.studyType}
                  </span>
                </td>
                <td className="p-4 font-mono text-slate-400">{paper.sampleSize}</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded-full uppercase text-[10px] font-bold border ${badgeColor}`}>
                    {relType}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectPaper(paper)}
                      className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold transition-colors"
                    >
                      Inspect
                    </button>
                    <a
                      href={paper.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-slate-400 hover:text-white"
                      title="Open DOI Link"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AccessibleListView;
