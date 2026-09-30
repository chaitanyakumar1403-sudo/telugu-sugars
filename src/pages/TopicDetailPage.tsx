import React from 'react';
import { getTopicBySlug, getClaims, getStories } from '../services/contentService';
import { useLanguage } from '../context/LanguageContext';
import ContentCard from '../components/cards/ContentCard';
import ClaimComparison from '../components/topics/ClaimComparison';
import { Tag, ArrowLeft, ShieldCheck } from 'lucide-react';

interface TopicDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const TopicDetailPage: React.FC<TopicDetailPageProps> = ({ slug, onNavigate }) => {
  const { language } = useLanguage();
  const topic = getTopicBySlug(slug) || getTopicBySlug('traditional-sweeteners');
  const allClaims = getClaims();
  const allStories = getStories();

  if (!topic) {
    return <div className="p-8 text-center text-white">Topic not found.</div>;
  }

  const topicClaims = allClaims.filter((c) => c.topicId === topic.id);
  const title = language === 'te' ? topic.teluguTitle : topic.title;
  const description = language === 'te' ? topic.teluguDescription : topic.description;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl flex flex-col gap-10 pb-24">
      {/* Back button */}
      <button
        onClick={() => onNavigate('/topics')}
        className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Topics</span>
      </button>

      {/* Topic Header */}
      <div className="border-b border-white/10 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3 border border-amber-500/30">
          <Tag className="w-3.5 h-3.5" />
          <span>Curated Pathway</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
          {title}
        </h1>
        <p className="text-slate-300 text-base mt-2 max-w-3xl leading-relaxed">
          {description}
        </p>
      </div>

      {/* Side-by-Side Claim Comparison Matrix (Phase 2 Spec) */}
      <ClaimComparison claims={allClaims} />

      {/* Related Stories in this Topic */}
      <div className="flex flex-col gap-4">
        <h3 className="text-xl font-bold text-white">
          Related Investigations in this Pathway
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {allStories.map((story) => (
            <ContentCard
              key={story.id}
              story={story}
              onClick={(storySlug) => onNavigate(`/stories/${storySlug}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopicDetailPage;
