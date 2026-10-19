import React, { useState } from 'react';
import { FoodLabelHotspot } from '../types/content';
import { getFoodLabelGuides } from '../services/contentService';
import InteractiveLabel from '../components/foodlabels/InteractiveLabel';
import LabelHotspotDetail from '../components/foodlabels/LabelHotspotDetail';
import { Sparkles, ShieldCheck, Eye } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const FoodLabelsPage: React.FC = () => {
  const { t } = useLanguage();
  const guides = getFoodLabelGuides();
  const currentGuide = guides[0];

  const [selectedHotspot, setSelectedHotspot] = useState<FoodLabelHotspot | null>(
    currentGuide.hotspots[1] // Default to hotspot 2: Added sugars
  );

  return (
    <div className="container flex flex-col gap-14 pb-28 pt-12 sm:pt-16">
      {/* Header */}
      <header className="reveal max-w-3xl">
        <p className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-amber-500">
          <Sparkles className="h-3.5 w-3.5" /> {t('fl_kicker')}
        </p>
        <h1 className="display-title mt-3 text-6xl text-white sm:text-8xl">
          {t('fl_title')} <span className="accent">{t('fl_accent')}</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
          {t('fl_lead')}
        </p>
      </header>

      {/* Main Interactive Stage: Mock Label on Left/Top, Hotspot Detail on Right/Bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Mock Packaging Label Graphic */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-400 ring-1 ring-inset ring-amber-500/30">
            <Eye className="w-4 h-4" /> {t('fl_tap')}
          </span>
          <InteractiveLabel
            guide={currentGuide}
            selectedHotspot={selectedHotspot}
            onSelectHotspot={setSelectedHotspot}
          />
        </div>

        {/* Hotspot Scientific Deconstruction Sheet */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <LabelHotspotDetail
            hotspot={selectedHotspot}
            onClose={() => setSelectedHotspot(null)}
          />

          {/* Quick Guide: Disguised Sugar Aliases */}
          <div className="panel p-6">
            <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>{t('fl_aliases')}</span>
            </h4>
            <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3 transition-colors hover:border-amber-500/40">
                  <span className="font-bold text-amber-300 block">{t(`fl_a${n}`)}</span>
                  <span className="text-[11px] text-slate-400">{t(`fl_a${n}d`)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodLabelsPage;
