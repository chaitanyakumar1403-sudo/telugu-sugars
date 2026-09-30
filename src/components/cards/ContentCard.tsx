import React from 'react';
import { Story } from '../../types/content';
import { useLanguage } from '../../context/LanguageContext';
import { Clock, Play, ArrowUpRight } from 'lucide-react';

interface ContentCardProps {
  story: Story;
  onClick: (slug: string) => void;
}

export const ContentCard: React.FC<ContentCardProps> = ({ story, onClick }) => {
  const { language } = useLanguage();

  const title = language === 'te' ? story.teluguTitle : story.title;
  const summary = language === 'te' ? story.teluguSummary : story.summary;

  const badgeClass =
    story.type === 'Video'
      ? 'badge-video'
      : story.type === 'Research Dossier'
      ? 'badge-research'
      : 'badge-explainer';

  return (
    <article
      onClick={() => onClick(story.slug)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(story.slug);
        }
      }}
      tabIndex={0}
      role="button"
      className="glass-card group flex flex-col justify-between p-6 cursor-pointer focus-visible:outline-none"
      aria-label={`${story.type}: ${title}`}
    >
      <div>
        {/* Card Header: Type Badge & Read Time */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className={`tag-badge ${badgeClass}`}>
            {story.type === 'Video' && <Play className="w-3 h-3 fill-current" />}
            {story.type}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <Clock className="w-3.5 h-3.5" />
            {story.readTime}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-amber-300 transition-colors leading-snug mb-3 flex items-start justify-between gap-2">
          <span>{title}</span>
          <ArrowUpRight className="w-5 h-5 text-slate-500 group-hover:text-amber-400 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0" />
        </h3>

        {/* One-Sentence Summary */}
        <p className="text-sm text-slate-300 leading-relaxed line-clamp-3 mb-5">
          {summary}
        </p>
      </div>

      {/* Footer Tags & Reviewer Info */}
      <div className="pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
        <div className="flex flex-wrap gap-1.5">
          {story.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded bg-white/5 text-[11px] text-slate-300 border border-white/5"
            >
              #{tag}
            </span>
          ))}
        </div>
        <span className="text-[11px] text-slate-400 font-mono">
          Reviewed by {story.reviewer.split(',')[0]}
        </span>
      </div>
    </article>
  );
};

export default ContentCard;
