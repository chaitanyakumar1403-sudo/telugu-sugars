import React, { useState } from 'react';
import { GlossaryTerm } from '../../types/content';
import { useLanguage } from '../../context/LanguageContext';
import { BookOpen, X, Volume2 } from 'lucide-react';

interface GlossaryPopoverProps {
  term: GlossaryTerm;
  children: React.ReactNode;
}

export const GlossaryPopover: React.FC<GlossaryPopoverProps> = ({ term, children }) => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const definition = language === 'te' ? term.teluguDefinition : term.plainLanguageDefinition;

  return (
    <span className="relative inline-block">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        data-testid={`glossary-trigger-${term.term.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
        className="underline decoration-amber-400/80 decoration-wavy underline-offset-4 text-amber-300 font-medium hover:text-amber-200 transition-colors"
        aria-expanded={isOpen}
        aria-label={`Definition for ${term.term} (${term.teluguRendering})`}
      >
        {children}
      </button>

      {isOpen && (
        <span
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 sm:w-80 p-4 rounded-xl bg-[#12161f] border border-amber-500/40 shadow-2xl text-left z-40 block"
          role="tooltip"
        >
          <span className="flex items-start justify-between gap-2 border-b border-white/10 pb-2 mb-2">
            <div>
              <span className="text-xs font-bold text-white block">
                {term.term}
              </span>
              <span className="text-xs text-amber-300 font-telugu block">
                {term.teluguRendering}
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-0.5 text-slate-400 hover:text-white"
              aria-label="Close glossary popover"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </span>

          <span className="text-[10px] text-slate-400 font-mono block mb-1.5">
            Phonetic: /{term.phoneticGuide}/
          </span>

          <span className="text-xs text-slate-200 leading-relaxed block mb-2">
            {definition}
          </span>

          {term.examples.length > 0 && (
            <span className="text-[10px] text-slate-400 block pt-1 border-t border-white/5">
              <strong>Examples:</strong> {term.examples.join(', ')}
            </span>
          )}
        </span>
      )}
    </span>
  );
};

export default GlossaryPopover;
