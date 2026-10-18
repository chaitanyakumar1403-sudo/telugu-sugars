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
    <div className="container flex flex-col gap-14 pb-28 pt-12 sm:pt-16">
      {/* Header */}
      <header className="reveal max-w-3xl">
        <p className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-amber-500">
          <Sparkles className="h-3.5 w-3.5" /> Interactive walkthrough
        </p>
        <h1 className="display-title mt-3 text-6xl text-white sm:text-8xl">
          Read the <span className="accent">Label</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
          Tap the numbered pins to see how a “traditional” cookie hides fast sugars behind its health claims.
        </p>
      </header>

      {/* Main Interactive Stage: Mock Label on Left/Top, Hotspot Detail on Right/Bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Mock Packaging Label Graphic */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-400 ring-1 ring-inset ring-amber-500/30">
            <Eye className="w-4 h-4" /> Tap a numbered pin
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
              <span>Common Sugar Aliases Found in Telugu Supermarkets</span>
            </h4>
            <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3 transition-colors hover:border-amber-500/40">
                <span className="font-bold text-amber-300 block">Maltodextrin</span>
                <span className="text-[11px] text-slate-400">Starch derivative • GI ~130</span>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3 transition-colors hover:border-amber-500/40">
                <span className="font-bold text-amber-300 block">Invert Sugar</span>
                <span className="text-[11px] text-slate-400">Cleaved liquid sucrose • GI ~65</span>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3 transition-colors hover:border-amber-500/40">
                <span className="font-bold text-amber-300 block">Dextrose / Corn Syrup</span>
                <span className="text-[11px] text-slate-400">Pure glucose syrup • GI ~100</span>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3 transition-colors hover:border-amber-500/40">
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
