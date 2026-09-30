import React, { useState, useEffect } from 'react';
import { Story, GlossaryTerm } from '../../types/content';
import { useLanguage } from '../../context/LanguageContext';
import GlossaryPopover from './GlossaryPopover';
import AudioNarrator from './AudioNarrator';
import { Type, SunMedium, Moon, BookOpen, Share2, Check } from 'lucide-react';

interface StoryReaderProps {
  story: Story;
  glossaryTerms: GlossaryTerm[];
}

export const StoryReader: React.FC<StoryReaderProps> = ({ story, glossaryTerms }) => {
  const { language } = useLanguage();
  const [fontSize, setFontSize] = useState<'normal' | 'lg' | 'xl'>('normal');
  const [highContrast, setHighContrast] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const title = language === 'te' ? story.teluguTitle : story.title;
  const summary = language === 'te' ? story.teluguSummary : story.summary;
  const bodyHtml = language === 'te' ? story.bodyHtmlTe : story.bodyHtmlEn;

  const fontClasses =
    fontSize === 'normal'
      ? 'text-base sm:text-lg'
      : fontSize === 'lg'
      ? 'text-lg sm:text-xl'
      : 'text-xl sm:text-2xl';

  return (
    <article
      className={`relative max-w-3xl mx-auto flex flex-col gap-8 pb-16 ${
        highContrast ? 'reading-mode-high-contrast text-white' : ''
      }`}
    >
      {/* Reading Progress Top Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-amber-400 to-amber-600 z-50 transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Reader Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
            <Type className="w-3.5 h-3.5 text-amber-400" /> Font:
          </span>
          <button
            onClick={() => setFontSize('normal')}
            className={`px-2.5 py-1 rounded font-bold ${
              fontSize === 'normal' ? 'bg-amber-400 text-black' : 'bg-white/5 text-slate-300'
            }`}
            aria-label="Normal Font Size"
          >
            A
          </button>
          <button
            onClick={() => setFontSize('lg')}
            className={`px-2.5 py-1 rounded font-bold ${
              fontSize === 'lg' ? 'bg-amber-400 text-black' : 'bg-white/5 text-slate-300'
            }`}
            aria-label="Increase Font A+"
          >
            A+
          </button>
          <button
            onClick={() => setFontSize('xl')}
            className={`px-2.5 py-1 rounded font-bold ${
              fontSize === 'xl' ? 'bg-amber-400 text-black' : 'bg-white/5 text-slate-300'
            }`}
            aria-label="Increase Font A++"
          >
            A++
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setHighContrast((prev) => !prev)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 font-medium"
            aria-label="Toggle High Contrast Mode"
          >
            {highContrast ? <SunMedium className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
            <span>{highContrast ? 'Standard' : 'High Contrast'}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 font-bold"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Audio Narrator Bar */}
      {story.audioUrl && (
        <AudioNarrator audioUrl={story.audioUrl} storyTitle={title} />
      )}

      {/* Title & Byline */}
      <header className="flex flex-col gap-4 border-b border-white/10 pb-6">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight font-display">
          {title}
        </h1>

        <p className="text-lg sm:text-xl text-slate-300 font-serif italic leading-relaxed">
          {summary}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-slate-400 font-mono">
          <div>By {story.author}</div>
          <div>Reviewed by {story.reviewer}</div>
        </div>
      </header>

      {/* Hero Image */}
      <div className="w-full aspect-[21/9] rounded-2xl overflow-hidden border border-white/10 shadow-xl">
        <img src={story.featuredImage} alt={title} className="w-full h-full object-cover" />
      </div>

      {/* Interactive Glossary Banner */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-slate-300 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span>Interactive terms in article:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {glossaryTerms.map((term) => (
            <GlossaryPopover key={term.id} term={term}>
              {term.term}
            </GlossaryPopover>
          ))}
        </div>
      </div>

      {/* Article Body */}
      <div
        data-testid="story-content"
        className={`leading-relaxed text-slate-200 font-serif flex flex-col gap-6 ${fontClasses}`}
        dangerouslySetInnerHTML={{ __html: bodyHtml }}
      />
    </article>
  );
};

export default StoryReader;
