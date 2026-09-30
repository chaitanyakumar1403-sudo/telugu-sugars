import React from 'react';
import { TranscriptSegment } from '../../types/content';
import { useLanguage } from '../../context/LanguageContext';
import { FileText, MessageSquareQuote } from 'lucide-react';

interface InteractiveTranscriptProps {
  transcript: TranscriptSegment[];
  currentTime: number;
  onSeek: (time: number) => void;
}

export const InteractiveTranscript: React.FC<InteractiveTranscriptProps> = ({
  transcript,
  currentTime,
  onSeek,
}) => {
  const { language } = useLanguage();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div
      data-testid="transcript-container"
      className="glass-card p-6 rounded-2xl flex flex-col gap-4 max-h-[380px] overflow-y-auto"
    >
      <div className="flex items-center justify-between border-b border-white/10 pb-3 sticky top-0 bg-[#101317] z-10">
        <h4 className="text-xs font-bold text-teal-400 uppercase tracking-widest flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5" />
          <span>Synchronized Transcript (Click to Seek)</span>
        </h4>
        <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">
          Bilingual Telugu & English
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {transcript.map((seg) => {
          const isLive = currentTime >= seg.startTime && currentTime <= seg.endTime;
          const text = language === 'te' ? seg.textTe : seg.textEn;

          return (
            <div
              key={seg.id}
              onClick={() => onSeek(seg.startTime)}
              className={`p-3 rounded-xl cursor-pointer text-xs transition-all flex flex-col gap-1 ${
                isLive
                  ? 'bg-teal-500/20 border-l-4 border-teal-400 text-white shadow-md'
                  : 'hover:bg-white/5 text-slate-300 border-l-2 border-transparent'
              }`}
              title="Click to jump video to this point"
            >
              <div className="flex items-center justify-between font-mono text-[10px] text-slate-400">
                <span className="font-bold text-amber-300">{seg.speaker}</span>
                <span>{formatTime(seg.startTime)}</span>
              </div>
              <p className="leading-relaxed">{text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InteractiveTranscript;
