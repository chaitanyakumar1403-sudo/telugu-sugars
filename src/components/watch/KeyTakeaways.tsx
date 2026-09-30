import React, { useState } from 'react';
import { Paper } from '../../types/content';
import { useLanguage } from '../../context/LanguageContext';
import { CheckCircle2, BookmarkCheck, Share2, ExternalLink, Check } from 'lucide-react';

interface KeyTakeawaysProps {
  takeaways: string[];
  teluguTakeaways: string[];
  citedPapers: Paper[];
}

export const KeyTakeaways: React.FC<KeyTakeawaysProps> = ({
  takeaways,
  teluguTakeaways,
  citedPapers,
}) => {
  const { language } = useLanguage();
  const [copied, setCopied] = useState(false);

  const items = language === 'te' ? teluguTakeaways : takeaways;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Key Takeaways Card */}
      <div className="glass-card p-6 rounded-2xl bg-gradient-to-br from-[#10141a] to-[#0c0e12] border-amber-500/20">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
          <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
            <BookmarkCheck className="w-4 h-4" />
            <span>Key Takeaways for Telugu Households</span>
          </h4>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white/10 hover:bg-white/15 text-white transition-colors"
            title="Copy deep link to share"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Link Copied' : 'Share Episode'}</span>
          </button>
        </div>

        <ul className="flex flex-col gap-3">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200 leading-relaxed">
              <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Cited Peer-Reviewed References (PDF Section 5) */}
      <div
        data-testid="episode-references"
        className="glass-card p-6 rounded-2xl bg-[#0e1116]"
      >
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
          Cited Clinical Studies & Papers ({citedPapers.length})
        </h4>

        <div className="flex flex-col gap-3">
          {citedPapers.map((paper) => (
            <div
              key={paper.id}
              className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-1 text-xs"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-white text-xs leading-snug">
                  {paper.title}
                </span>
                <a
                  href={paper.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-mono text-[11px] flex-shrink-0"
                  title="Open DOI paper"
                >
                  <span>DOI</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                {paper.authors.join(', ')} • {paper.journal} ({paper.year})
              </div>
              <div className="text-[11px] text-teal-300/90 mt-1">
                <strong>Finding:</strong> {paper.mainFinding}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KeyTakeaways;
