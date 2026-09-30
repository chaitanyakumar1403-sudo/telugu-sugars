import React from 'react';
import { getTopics } from '../services/contentService';
import { useLanguage } from '../context/LanguageContext';
import { Tag, ArrowRight } from 'lucide-react';

interface TopicsPageProps {
  onSelectTopic: (slug: string) => void;
}

export const TopicsPage: React.FC<TopicsPageProps> = ({ onSelectTopic }) => {
  const { language } = useLanguage();
  const topics = getTopics();

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl flex flex-col gap-8 pb-24">
      <div className="border-b border-white/10 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2 border border-amber-500/30">
          <Tag className="w-3.5 h-3.5" />
          <span>Curated Topic Pathways</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
          Explore by Metabolic Topic
        </h1>
        <p className="text-slate-300 text-sm mt-1 max-w-2xl">
          Editorially curated pathways navigating through traditional sweetener myths, packaged food loopholes, non-nutritive sugar substitutes, and insulin resistance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {topics.map((topic) => {
          const title = language === 'te' ? topic.teluguTitle : topic.title;
          const desc = language === 'te' ? topic.teluguDescription : topic.description;

          return (
            <div
              key={topic.id}
              onClick={() => onSelectTopic(topic.slug)}
              className="glass-card p-6 sm:p-8 cursor-pointer flex flex-col justify-between group hover:border-amber-400/50"
            >
              <div>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Tag className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    {topic.claimCount} Claims • {topic.studyCount} Studies
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white group-hover:text-amber-300 transition-colors mb-3">
                  {title}
                </h3>

                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  {desc}
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-bold text-amber-400">
                <span>Explore Pathway Dossier</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopicsPage;
