import React, { useRef, useState } from 'react';
import { Volume2, Play, Pause, RotateCcw } from 'lucide-react';

interface AudioNarratorProps {
  audioUrl?: string;
  storyTitle: string;
}

export const AudioNarrator: React.FC<AudioNarratorProps> = ({ audioUrl, storyTitle }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (!audioUrl) return null;

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const cycleSpeed = () => {
    const nextRate = playbackRate === 1 ? 1.25 : playbackRate === 1.25 ? 1.5 : 1;
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 backdrop-blur-md">
      <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} />

      <div className="flex items-center gap-3">
        <button
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-amber-400 hover:bg-amber-300 text-black flex items-center justify-center shadow-md transition-transform"
          aria-label={isPlaying ? 'Pause audio narration' : 'Play audio narration'}
        >
          {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
        </button>

        <div className="flex flex-col">
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Audio Narration Mode</span>
          </span>
          <span className="text-[11px] text-slate-400 truncate max-w-xs">
            Listen to full story in English & Telugu
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={cycleSpeed}
          className="px-2 py-1 rounded bg-black/40 text-[11px] font-mono font-bold text-amber-300 border border-white/10"
          title="Change playback speed"
        >
          {playbackRate}x
        </button>
      </div>
    </div>
  );
};

export default AudioNarrator;
