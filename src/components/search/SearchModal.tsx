import React, { useState, useEffect, useRef } from 'react';
import { searchAll } from '../../services/contentService';
import { useLanguage } from '../../context/LanguageContext';
import SearchResultItem, { UnifiedSearchItem } from './SearchResultItem';
import { Search, X, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const { language } = useLanguage();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'story' | 'claim' | 'paper' | 'glossary'>('all');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const suggestedQueries = [
    'Jaggery blood sugar spike',
    'Hidden maltodextrin in biscuits',
    'Stevia gut microbiome',
    'Glycemic Index Telugu sweets',
  ];

  // Focus input when opened & listen for Escape
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const rawResults = searchAll(query);

  // Normalize into unified items
  const unifiedItems: UnifiedSearchItem[] = [
    ...rawResults.stories.map((s) => ({
      id: s.id,
      type: 'story' as const,
      title: language === 'te' ? s.teluguTitle : s.title,
      subtitle: language === 'te' ? s.teluguSummary : s.summary,
      badge: s.type,
      targetPath: s.type === 'Video' ? `/watch/${s.slug}` : `/stories/${s.slug}`,
    })),
    ...rawResults.claims.map((c) => ({
      id: c.id,
      type: 'claim' as const,
      title: language === 'te' ? c.teluguClaimText : c.claimText,
      subtitle: `Evidence Grade: ${c.evidenceGrade} • Reviewed by ${c.reviewerName}`,
      badge: 'Claim',
      targetPath: `/research`,
    })),
    ...rawResults.papers.map((p) => ({
      id: p.id,
      type: 'paper' as const,
      title: p.title,
      subtitle: `${p.journal} (${p.year}) • ${p.studyType}`,
      badge: 'Paper',
      targetPath: `/research`,
    })),
    ...rawResults.glossary.map((g) => ({
      id: g.id,
      type: 'glossary' as const,
      title: `${g.term} (${g.teluguRendering})`,
      subtitle: language === 'te' ? g.teluguDefinition : g.plainLanguageDefinition,
      badge: 'Glossary',
      targetPath: `/stories`,
    })),
  ];

  const filteredItems =
    activeTab === 'all'
      ? unifiedItems
      : unifiedItems.filter((item) => item.type === activeTab);

  const handleSelect = (path: string) => {
    onNavigate(path);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center p-4 sm:p-6 sm:pt-20"
      role="dialog"
      aria-modal="true"
      aria-label="Universal Search Engine"
    >
      <div className="w-full max-w-2xl bg-[#0e1117] border border-white/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <Search className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles, studies, food labels..."
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none"
            aria-label="Search articles, studies, food labels"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 rounded-lg text-xs font-mono bg-white/5 text-slate-400 hover:text-white"
          >
            ESC
          </button>
        </div>

        {/* Category Tabs */}
        {query && (
          <div className="flex items-center gap-1.5 px-4 py-2 border-b border-white/5 bg-black/30 overflow-x-auto text-xs">
            {(['all', 'story', 'claim', 'paper', 'glossary'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded-lg font-bold capitalize transition-colors ${
                  activeTab === tab
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab} ({tab === 'all' ? unifiedItems.length : unifiedItems.filter((i) => i.type === tab).length})
              </button>
            ))}
          </div>
        )}

        {/* Results Stream or Suggested Searches */}
        <div className="p-4 overflow-y-auto flex-grow flex flex-col gap-2">
          {!query ? (
            <div className="flex flex-col gap-3 py-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Suggested Clinical Queries</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {suggestedQueries.map((suggested) => (
                  <button
                    key={suggested}
                    onClick={() => setQuery(suggested)}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-slate-300 text-left flex items-center gap-1.5 transition-colors"
                  >
                    <span>{suggested}</span>
                    <ArrowRight className="w-3 h-3 text-slate-500" />
                  </button>
                ))}
              </div>
            </div>
          ) : filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <SearchResultItem
                key={`${item.type}-${item.id}`}
                item={item}
                onSelect={handleSelect}
              />
            ))
          ) : (
            /* No Results Help (PDF Section 5 Requirement) */
            <div className="text-center py-10 flex flex-col items-center gap-3">
              <HelpCircle className="w-8 h-8 text-amber-400" />
              <h4 className="text-base font-bold text-white">No Direct Matches Found</h4>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                We couldn't find studies or articles matching "<strong>{query}</strong>". Try searching for related keywords like <em>Jaggery</em>, <em>Maltodextrin</em>, <em>Stevia</em>, or <em>Glycemic Index</em>.
              </p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-black/40 border-t border-white/10 text-center text-[11px] text-slate-400">
          Search indexed across peer-reviewed papers, video transcripts, and Telugu food labels.
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
