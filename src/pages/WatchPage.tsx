import React, { useState } from 'react';
import { getStories, getPapers } from '../services/contentService';
import { useLanguage } from '../context/LanguageContext';
import VideoPlayer from '../components/watch/VideoPlayer';
import ChapterList from '../components/watch/ChapterList';
import InteractiveTranscript from '../components/watch/InteractiveTranscript';
import KeyTakeaways from '../components/watch/KeyTakeaways';
import { Film, UserCheck, Calendar } from 'lucide-react';

interface WatchPageProps {
  episodeSlug?: string;
}

export const WatchPage: React.FC<WatchPageProps> = ({ episodeSlug }) => {
  const { language } = useLanguage();
  const allStories = getStories();
  const allPapers = getPapers();

  const episode =
    allStories.find((s) => s.slug === episodeSlug && s.type === 'Video') ||
    allStories.find((s) => s.type === 'Video') ||
    allStories[0];

  const citedPapers = allPapers.filter((p) => episode.citedPaperIds?.includes(p.id));

  const [currentTime, setCurrentTime] = useState(0);

  const title = language === 'te' ? episode.teluguTitle : episode.title;
  const summary = language === 'te' ? episode.teluguSummary : episode.summary;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl flex flex-col gap-10 pb-24">
      {/* Title & Metadata Header */}
      <div className="flex flex-col gap-3 border-b border-white/10 pb-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-500/30 flex items-center gap-1.5">
            <Film className="w-3.5 h-3.5" />
            <span>Episode 01 • Video Investigation</span>
          </span>
          <span className="text-xs text-slate-400 font-mono">
            {episode.readTime}
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
          {title}
        </h1>

        <p className="text-slate-300 text-base sm:text-lg max-w-3xl leading-relaxed">
          {summary}
        </p>

        {/* Verification provenance */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2 font-mono">
          <span className="flex items-center gap-1 text-teal-400">
            <UserCheck className="w-4 h-4" /> Reviewed by {episode.reviewer} ({episode.reviewerCredentials})
          </span>
          <span className="flex items-center gap-1 text-slate-500">
            <Calendar className="w-3.5 h-3.5" /> Last Verified: {episode.lastReviewedDate}
          </span>
        </div>
      </div>

      {/* Main Video & Chapters Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left / Top: Video Player & Interactive Transcript */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <VideoPlayer
            src={episode.videoUrl || ''}
            poster={episode.featuredImage}
            title={title}
            currentTime={currentTime}
            onTimeUpdate={setCurrentTime}
            onSeek={setCurrentTime}
          />

          {episode.transcript && (
            <InteractiveTranscript
              transcript={episode.transcript}
              currentTime={currentTime}
              onSeek={setCurrentTime}
            />
          )}
        </div>

        {/* Right / Side: Interactive Chapters & Cited References */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {episode.chapters && (
            <ChapterList
              chapters={episode.chapters}
              currentTime={currentTime}
              onSelectChapter={setCurrentTime}
            />
          )}

          <KeyTakeaways
            takeaways={episode.keyTakeaways}
            teluguTakeaways={episode.teluguTakeaways}
            citedPapers={citedPapers}
          />
        </div>
      </div>
    </div>
  );
};

export default WatchPage;
