import React from 'react';
import { getStoryBySlug, getGlossaryTerms } from '../services/contentService';
import StoryReader from '../components/stories/StoryReader';
import { ArrowLeft } from 'lucide-react';

interface StoryDetailPageProps {
  slug: string;
  onBack?: () => void;
}

export const StoryDetailPage: React.FC<StoryDetailPageProps> = ({ slug, onBack }) => {
  const story = getStoryBySlug(slug) || getStoryBySlug('the-jaggery-health-halo-myth');
  const glossaryTerms = getGlossaryTerms();

  if (!story) {
    return <div className="p-8 text-center text-white">Story not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {onBack && (
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Stories</span>
        </button>
      )}

      <StoryReader story={story} glossaryTerms={glossaryTerms} />
    </div>
  );
};

export default StoryDetailPage;
