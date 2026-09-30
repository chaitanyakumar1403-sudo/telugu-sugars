import React from 'react';
import { FoodLabelGuide, FoodLabelHotspot } from '../../types/content';

interface InteractiveLabelProps {
  guide: FoodLabelGuide;
  selectedHotspot: FoodLabelHotspot | null;
  onSelectHotspot: (hotspot: FoodLabelHotspot) => void;
}

export const InteractiveLabel: React.FC<InteractiveLabelProps> = ({
  guide,
  selectedHotspot,
  onSelectHotspot,
}) => {
  return (
    <div className="relative w-full max-w-md mx-auto mock-label-paper rounded-2xl p-6 sm:p-8 shadow-2xl border-4 border-black select-none">
      {/* Front of Pack Marketing Teaser Stamp */}
      <div className="border-b-8 border-black pb-4 mb-4">
        <div className="flex items-center justify-between text-xs font-bold tracking-widest uppercase mb-1">
          <span>Supermarket Brand Specimen</span>
          <span className="bg-emerald-700 text-white px-2 py-0.5 rounded text-[10px]">
            100% Traditional
          </span>
        </div>
        <h3 className="text-2xl font-black uppercase tracking-tight leading-tight">
          {guide.productName}
        </h3>
        <p className="text-xs text-stone-600 font-serif italic mt-0.5">
          "Crafted with pure Anakapalle Jaggery & Ancient Ragi Millets"
        </p>
      </div>

      {/* Main Nutrition Facts Header */}
      <div className="border-b-4 border-black pb-2 mb-2">
        <h4 className="text-3xl font-black uppercase tracking-tighter">Nutrition Facts</h4>
        <div className="flex justify-between items-baseline text-xs font-semibold pt-1">
          <span>Serving Size: 1 cookie (12g)</span>
          <span>Servings Per Pack: ~10</span>
        </div>
      </div>

      {/* Calories Block */}
      <div className="border-b-8 border-black py-2 flex justify-between items-baseline">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider">Amount Per Serving</div>
          <div className="text-3xl font-black">Calories 48</div>
        </div>
        <div className="text-xs font-bold text-stone-600">Per 100g: 400 kcal</div>
      </div>

      {/* Quantitative Breakdown Table */}
      <div className="divide-y divide-black text-xs">
        <div className="flex justify-between py-1.5 font-bold">
          <span>Total Fat 2.2g</span>
          <span>3% DV</span>
        </div>
        <div className="flex justify-between py-1.5 font-bold pl-4 text-stone-700">
          <span>Saturated Fat 0.8g</span>
          <span>4% DV</span>
        </div>
        <div className="flex justify-between py-1.5 font-bold bg-amber-100/80 px-1 rounded">
          <span>Total Carbohydrate 9.8g</span>
          <span>4% DV</span>
        </div>
        <div className="flex justify-between py-1.5 pl-4 text-stone-700">
          <span>Dietary Fiber 0.6g</span>
          <span>2% DV</span>
        </div>
        <div className="flex justify-between py-1.5 pl-4 font-bold bg-rose-100/90 text-rose-950 px-1 rounded">
          <span>Total Sugars 3.4g</span>
          <span>--</span>
        </div>
        <div className="flex justify-between py-1.5 pl-8 text-rose-900 font-semibold bg-rose-50 px-1">
          <span>Includes 3.4g Added Sugars</span>
          <span className="font-bold text-rose-700">7% DV</span>
        </div>
        <div className="flex justify-between py-1.5 font-bold">
          <span>Protein 0.8g</span>
          <span>--</span>
        </div>
      </div>

      {/* Ingredients List */}
      <div className="border-t-4 border-black pt-3 mt-3 text-[11px] leading-relaxed">
        <strong className="font-bold">INGREDIENTS:</strong> Finger Millet Flour (Ragi 26%),
        Refined Wheat Flour (Maida), <span className="bg-amber-200 px-1 font-bold">Unrefined Jaggery (20%)</span>,
        Edible Vegetable Oil (Palm), <span className="bg-rose-200 px-1 font-bold">Maltodextrin (14%)</span>,
        Liquid Invert Syrup (8%), Raising Agents (INS 500ii), Added Identical Flavorings.
      </div>

      {/* Interactive Pulsating Hotspot Pins */}
      {guide.hotspots.map((hs, index) => {
        const isSelected = selectedHotspot?.id === hs.id;
        const testId =
          index === 0
            ? 'hotspot-serving-size'
            : index === 1
            ? 'hotspot-added-sugars'
            : 'hotspot-front-stamp';

        return (
          <button
            key={hs.id}
            data-testid={testId}
            onClick={() => onSelectHotspot(hs)}
            style={{ top: `${hs.yPercent}%`, left: `${hs.xPercent}%` }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-8 h-8 rounded-full font-black text-xs transition-all shadow-lg focus:outline-none ${
              isSelected
                ? 'bg-rose-600 text-white ring-4 ring-rose-400 scale-125'
                : 'bg-black text-amber-300 hover:scale-110 animate-bounce'
            }`}
            aria-label={`Inspect hotspot: ${hs.title}`}
            title={`Click to inspect: ${hs.title}`}
          >
            {index + 1}
          </button>
        );
      })}
    </div>
  );
};

export default InteractiveLabel;
