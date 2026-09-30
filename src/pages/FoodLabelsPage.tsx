import React, { useState } from 'react';
import { FoodLabelHotspot } from '../types/content';
import { getFoodLabelGuides } from '../services/contentService';
import InteractiveLabel from '../components/foodlabels/InteractiveLabel';
import LabelHotspotDetail from '../components/foodlabels/LabelHotspotDetail';
import { Sparkles, ShieldCheck, Eye } from 'lucide-react';

export const FoodLabelsPage: React.FC = () => {
  const guides = getFoodLabelGuides();
  const currentGuide = guides[0];

  const [selectedHotspot, setSelectedHotspot] = useState<FoodLabelHotspot | null>(
    currentGuide.hotspots[1] // Default to hotspot 2: Added sugars
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl flex flex-col gap-10 pb-24">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 text-rose-300 text-xs font-bold uppercase tracking-wider mb-3 border border-rose-500/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Consumer Defense Tool</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
          Interactive Food Label Walkthrough
        </h1>
        <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
          Click the numbered pulsating hotspots on the mock packaged food label below to discover how modern food processors hide high-glycemic sugars behind traditional health claims.
        </p>
      </div>

      {/* Main Interactive Stage: Mock Label on Left/Top, Hotspot Detail on Right/Bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Mock Packaging Label Graphic */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <span className="text-xs font-bold text-amber-400 mb-3 tracking-widest uppercase flex items-center gap-1.5">
            <Eye className="w-4 h-4" /> Tap numbered pins on label to inspect
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
          <div className="glass-card p-6 rounded-2xl bg-[#0f1217]">
            <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Common Sugar Aliases Found in Telugu Supermarkets</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded bg-white/5 border border-white/5">
                <span className="font-bold text-amber-300 block">Maltodextrin</span>
                <span className="text-[11px] text-slate-400">Starch derivative • GI ~130</span>
              </div>
              <div className="p-2 rounded bg-white/5 border border-white/5">
                <span className="font-bold text-amber-300 block">Invert Sugar</span>
                <span className="text-[11px] text-slate-400">Cleaved liquid sucrose • GI ~65</span>
              </div>
              <div className="p-2 rounded bg-white/5 border border-white/5">
                <span className="font-bold text-amber-300 block">Dextrose / Corn Syrup</span>
                <span className="text-[11px] text-slate-400">Pure glucose syrup • GI ~100</span>
              </div>
              <div className="p-2 rounded bg-white/5 border border-white/5">
                <span className="font-bold text-amber-300 block">Date / Rice Syrup</span>
                <span className="text-[11px] text-slate-400">Concentrated free sugar • GI ~80</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodLabelsPage;
