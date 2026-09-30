import React from 'react';
import { getStories } from '../services/contentService';
import ContentCard from '../components/cards/ContentCard';
import { BookOpen } from 'lucide-react';

interface StoriesIndexPageProps {
  onSelectStory: (slug: string) => void;
}

export const StoriesIndexPage: React.FC<StoriesIndexPageProps> = ({ onSelectStory }) => {
  const stories = getStories();

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl flex flex-col gap-8 pb-24">
      <div className="border-b border-white/10 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2 border border-amber-500/30">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Investigative Catalog</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
          All Stories & Explainers
        </h1>
        <p className="text-slate-300 text-sm mt-1 max-w-2xl">
          In-depth cultural journalism, forensic lab tests, and peer-reviewed clinical breakdowns on sugars, sweeteners, and metabolic health.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stories.map((story) => (
          <ContentCard
            key={story.id}
            story={story}
            onClick={onSelectStory}
          />
        ))}
      </div>
    </div>
  );
};

export default StoriesIndexPage;
