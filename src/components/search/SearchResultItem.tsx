import React from 'react';
import { BookOpen, Compass, FileText, Sparkles, ChevronRight } from 'lucide-react';

export type SearchItemType = 'story' | 'claim' | 'paper' | 'glossary';

export interface UnifiedSearchItem {
  id: string;
  type: SearchItemType;
  title: string;
  subtitle: string;
  badge: string;
  targetPath: string;
}

interface SearchResultItemProps {
  item: UnifiedSearchItem;
  onSelect: (path: string) => void;
}

export const SearchResultItem: React.FC<SearchResultItemProps> = ({ item, onSelect }) => {
  const getIcon = () => {
    switch (item.type) {
      case 'story':
        return <BookOpen className="w-4 h-4 text-amber-400" />;
      case 'claim':
        return <Compass className="w-4 h-4 text-rose-400" />;
      case 'paper':
        return <FileText className="w-4 h-4 text-teal-400" />;
      case 'glossary':
        return <Sparkles className="w-4 h-4 text-blue-400" />;
    }
  };

  const badgeColor =
    item.type === 'story'
      ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
      : item.type === 'claim'
      ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
      : item.type === 'paper'
      ? 'bg-teal-500/15 text-teal-300 border-teal-500/30'
      : 'bg-blue-500/15 text-blue-300 border-blue-500/30';

  return (
    <div
      data-testid="search-result-item"
      onClick={() => onSelect(item.targetPath)}
      className="p-3.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 cursor-pointer transition-all flex items-center justify-between gap-3 group"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-white/5 text-slate-300 flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>

        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${badgeColor}`}>
              {item.badge}
            </span>
            <span className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors leading-snug">
              {item.title}
            </span>
          </div>

          <p className="text-xs text-slate-400 line-clamp-1">
            {item.subtitle}
          </p>
        </div>
      </div>

      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
    </div>
  );
};

export default SearchResultItem;
