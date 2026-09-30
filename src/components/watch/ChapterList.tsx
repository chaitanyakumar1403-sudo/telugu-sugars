import React from 'react';
import { VideoChapter } from '../../types/content';
import { useLanguage } from '../../context/LanguageContext';
import { PlayCircle, Clock } from 'lucide-react';

interface ChapterListProps {
  chapters: VideoChapter[];
  currentTime: number;
  onSelectChapter: (time: number) => void;
}

export const ChapterList: React.FC<ChapterListProps> = ({
  chapters,
  currentTime,
  onSelectChapter,
}) => {
  const { language } = useLanguage();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Find active chapter index
  let activeIndex = 0;
  for (let i = chapters.length - 1; i >= 0; i--) {
    if (currentTime >= chapters[i].startTime) {
      activeIndex = i;
      break;
    }
  }

  return (
    <div className="glass-card p-5 rounded-2xl flex flex-col gap-3">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span>Interactive Chapters</span>
        </h4>
        <span className="text-[11px] text-slate-400 font-mono">
          {chapters.length} Key Segments
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        {chapters.map((ch, idx) => {
          const isActive = idx === activeIndex;
          const title = language === 'te' ? ch.teluguTitle : ch.title;

          return (
            <button
              key={ch.id}
              onClick={() => onSelectChapter(ch.startTime)}
              data-testid={isActive ? 'active-chapter' : undefined}
              className={`flex items-start gap-3 p-3 rounded-xl text-left transition-all ${
                isActive
                  ? 'bg-amber-500/20 border border-amber-500/40 text-white shadow-md'
                  : 'hover:bg-white/5 text-slate-300 border border-transparent'
              }`}
            >
              <span
                className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                  isActive ? 'bg-amber-400 text-black' : 'bg-white/10 text-slate-400'
                }`}
              >
                {formatTime(ch.startTime)}
              </span>

              <div className="flex flex-col gap-0.5 flex-grow">
                <span className="text-xs sm:text-sm font-bold leading-tight">
                  {title}
                </span>
                <span className="text-[11px] text-slate-400 line-clamp-1">
                  {ch.description}
                </span>
              </div>

              {isActive && (
                <PlayCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ChapterList;
