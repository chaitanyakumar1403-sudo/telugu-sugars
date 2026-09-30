import React from 'react';
import { FoodLabelHotspot } from '../../types/content';
import { useLanguage } from '../../context/LanguageContext';
import { AlertTriangle, CheckCircle, ShieldAlert, X } from 'lucide-react';

interface LabelHotspotDetailProps {
  hotspot: FoodLabelHotspot | null;
  onClose: () => void;
}

export const LabelHotspotDetail: React.FC<LabelHotspotDetailProps> = ({
  hotspot,
  onClose,
}) => {
  const { language } = useLanguage();

  if (!hotspot) return null;

  const title = language === 'te' ? hotspot.teluguTitle : hotspot.title;

  return (
    <div
      data-testid="hotspot-detail-card"
      className="glass-card p-6 rounded-2xl border-amber-500/50 shadow-2xl flex flex-col gap-4 bg-[#12151b]"
    >
      <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
            !
          </div>
          <div>
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
              Label Investigation Hotspot
            </span>
            <h4 className="text-lg font-bold text-white leading-tight">
              {title}
            </h4>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          aria-label="Close hotspot detail"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Claimed Marketing */}
      <div className="bg-black/40 rounded-xl p-3.5 border border-white/5">
        <span className="text-xs font-semibold text-slate-400 block mb-1">
          What the Packaging Claims:
        </span>
        <div className="text-sm font-bold text-amber-300 italic">
          "{hotspot.claimedMarketing}"
        </div>
      </div>

      {/* Scientific Reality */}
      <div className="flex flex-col gap-1.5">
        <div className="text-xs font-bold text-rose-400 flex items-center gap-1.5 uppercase tracking-wider">
          <AlertTriangle className="w-4 h-4" />
          <span>How Brands Disguise Added Sugars:</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-rose-500/10 border-l-2 border-rose-500 p-3 rounded-r-lg">
          {hotspot.scientificReality}
        </p>
      </div>

      {/* Consumer Advice */}
      <div className="flex flex-col gap-1.5 pt-1">
        <div className="text-xs font-bold text-teal-400 flex items-center gap-1.5 uppercase tracking-wider">
          <CheckCircle className="w-4 h-4" />
          <span>Telugu Sugars Buyer Checklist:</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed bg-teal-500/10 border-l-2 border-teal-500 p-3 rounded-r-lg">
          {hotspot.consumerAdvice}
        </p>
      </div>
    </div>
  );
};

export default LabelHotspotDetail;
