import React from 'react';
import HomeHero from '../components/home/HomeHero';
import ContentCard from '../components/cards/ContentCard';
import EvidenceCard from '../components/cards/EvidenceCard';
import { getStories, getClaims, getPapers, getTopics } from '../services/contentService';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, Sparkles, Film, Compass, ChevronRight, Tag } from 'lucide-react';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const stories = getStories();
  const claims = getClaims();
  const papers = getPapers();
  const topics = getTopics();

  const heroVideoStory = stories.find((s) => s.type === 'Video') || stories[0];

  return (
    <div className="w-full flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <HomeHero onNavigate={onNavigate} />

      {/* Featured Video Episode Banner (PDF Section 5) */}
      <section className="container mx-auto px-4" aria-label="Featured Investigation Episode">
        <div className="relative rounded-2xl overflow-hidden border border-amber-500/30 bg-gradient-to-br from-[#12161c] via-[#0d1014] to-[#08090b] p-6 sm:p-10 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider w-fit border border-amber-500/30">
                <Film className="w-3.5 h-3.5" />
                <span>Featured Video Episode</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                {language === 'te' ? heroVideoStory.teluguTitle : heroVideoStory.title}
              </h2>

              <p className="text-slate-300 text-base leading-relaxed">
                {language === 'te' ? heroVideoStory.teluguSummary : heroVideoStory.summary}
              </p>

              {/* Chapters Preview */}
              {heroVideoStory.chapters && (
                <div className="flex flex-col gap-2 pt-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Interactive Chapters:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {heroVideoStory.chapters.slice(0, 3).map((ch, idx) => (
                      <span
                        key={ch.id}
                        className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300 flex items-center gap-1.5"
                      >
                        <span className="text-amber-400 font-mono font-bold">0{idx + 1}</span>
                        <span>{language === 'te' ? ch.teluguTitle : ch.title}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 flex items-center gap-4">
                <button
                  onClick={() => onNavigate(`/watch/${heroVideoStory.slug}`)}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-sm transition-all shadow-md shadow-amber-500/20"
                >
                  <Film className="w-4 h-4" />
                  <span>Watch with Synchronized Transcript</span>
                </button>
              </div>
            </div>

            {/* Video Thumbnail Graphic */}
            <div
              onClick={() => onNavigate(`/watch/${heroVideoStory.slug}`)}
              className="lg:col-span-5 relative group cursor-pointer aspect-video rounded-xl overflow-hidden border border-white/10 shadow-xl"
            >
              <img
                src={heroVideoStory.featuredImage}
                alt={heroVideoStory.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-amber-400 text-black flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Film className="w-7 h-7 fill-current ml-0.5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stories & Explainers Grid */}
      <section className="container mx-auto px-4" aria-label="Latest Investigative Stories">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              Investigative Journalism
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
              Latest Stories & Clinical Explainers
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/stories')}
            className="flex items-center gap-2 text-sm font-semibold text-amber-400 hover:text-amber-300"
          >
            <span>View All Stories</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {stories.map((story) => (
            <ContentCard
              key={story.id}
              story={story}
              onClick={(slug) => onNavigate(`/stories/${slug}`)}
            />
          ))}
        </div>
      </section>

      {/* Interactive Evidence Layer Teaser (PDF Section 4 & 6) */}
      <section className="container mx-auto px-4" aria-label="Evidence Cards & Research Dossier">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-400 uppercase tracking-widest">
              <Compass className="w-4 h-4" />
              <span>Evidence Layer</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
              Verified Claims & Peer-Reviewed Studies
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/research')}
            className="flex items-center gap-2 text-sm font-semibold text-teal-400 hover:text-teal-300"
          >
            <span>Launch Research Explorer Graph</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {claims.slice(0, 2).map((claim) => {
            const paper = papers.find((p) => p.id === 'paper-1');
            return (
              <EvidenceCard
                key={claim.id}
                claim={claim}
                paper={paper}
                onExploreGraph={() => onNavigate(`/research`)}
              />
            );
          })}
        </div>
      </section>

      {/* Interactive Food Label Deception Walkthrough Teaser (PDF Section 5) */}
      <section className="container mx-auto px-4" aria-label="Food Labels Deception Tool">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-[#12161c] to-[#181c22] p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold uppercase tracking-wider mb-4 border border-rose-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Simulator</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
              Deconstruct Deceptive Packaged Food Labels
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
              Learn to spot how brands disguise 40+ grams of high-glycemic maltodextrin and invert syrups behind "Traditional Millet" and "No Added Sugar" badges.
            </p>
            <button
              onClick={() => onNavigate('/food-labels')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-sm shadow-md shadow-amber-500/20 transition-all"
            >
              <span>Launch Label Hotspot Walkthrough</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="w-full md:w-72 bg-black/60 border border-amber-500/40 rounded-xl p-5 font-mono text-xs shadow-xl">
            <div className="text-amber-400 font-bold border-b border-white/10 pb-2 mb-3">
              Nutrition Facts (Mock Label)
            </div>
            <div className="flex justify-between py-1 border-b border-white/5 text-slate-300">
              <span>Serving Size</span>
              <span>1 cookie (12g)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5 text-rose-400 font-bold">
              <span>Added Sugars</span>
              <span>28g / 100g</span>
            </div>
            <div className="flex justify-between py-1 text-amber-300">
              <span>Hidden Maltodextrin</span>
              <span>GI: 130</span>
            </div>
          </div>
        </div>
      </section>

      {/* Curated Topic Pathways (PDF Section 5) */}
      <section className="container mx-auto px-4" aria-label="Curated Topic Pathways">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
            Curated Pathways
          </span>
          <h2 className="text-3xl font-extrabold text-white mt-1">
            Browse by Metabolic Topic
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topics.map((topic) => (
            <div
              key={topic.id}
              onClick={() => onNavigate(`/topics/${topic.slug}`)}
              className="glass-card p-5 cursor-pointer hover:border-amber-400/50 flex flex-col justify-between group"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Tag className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors mb-2">
                  {language === 'te' ? topic.teluguTitle : topic.title}
                </h4>
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {language === 'te' ? topic.teluguDescription : topic.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                <span>{topic.claimCount} Claims</span>
                <span className="text-amber-400 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
