import React from 'react';
import { FoodLabelGuide, FoodLabelHotspot } from '../../types/content';
import { useLanguage } from '../../context/LanguageContext';

interface InteractiveLabelProps {
  guide: FoodLabelGuide;
  selectedHotspot: FoodLabelHotspot | null;
  onSelectHotspot: (hotspot: FoodLabelHotspot) => void;
}

const TEST_IDS = ['hotspot-serving-size', 'hotspot-added-sugars', 'hotspot-front-stamp'];

export const InteractiveLabel: React.FC<InteractiveLabelProps> = ({ guide, selectedHotspot, onSelectHotspot }) => {
  const { language, t } = useLanguage();
  // Pins are anchored to the label element they explain (hotspot order: serving size, maltodextrin, front stamp).
  const pin = (index: number) => {
    const hs = guide.hotspots[index];
    if (!hs) return null;
    const isSelected = selectedHotspot?.id === hs.id;
    return (
      <button
        data-testid={TEST_IDS[index]}
        onClick={() => onSelectHotspot(hs)}
        aria-label={t('fl_pin_aria', { t: language === 'te' ? hs.teluguTitle : hs.title })}
        aria-pressed={isSelected}
        className={`relative inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full align-middle font-sans text-[11px] font-bold transition-transform hover:scale-110 ${
          isSelected ? 'bg-rose-600 ring-4 ring-rose-300' : 'bg-black'
        }`}
      >
        {!isSelected && <span className="absolute inset-0 animate-ping rounded-full bg-amber-400/40" />}
        <span className={`relative ${isSelected ? 'text-white!' : 'text-amber-300!'}`}>{index + 1}</span>
      </button>
    );
  };
  const mark = (index: number) =>
    selectedHotspot?.id === guide.hotspots[index]?.id ? 'outline outline-2 outline-offset-2 outline-rose-500' : '';

  return (
    <div className="mock-label-paper relative mx-auto w-full max-w-md select-none rounded-2xl border-4 p-6 shadow-2xl shadow-black/60 sm:p-8">
      {/* Front of pack */}
      <div className="mb-4 border-b-8 pb-4">
        <div className="mb-2 flex items-center justify-between gap-3 text-xs font-bold">
          <span>Supermarket Brand Specimen</span>
          <span className={`inline-flex items-center gap-2 rounded ${mark(2)}`}>
            <span className="rounded bg-emerald-700 px-2 py-0.5 text-[10px] text-white!">100% Traditional</span>
            {pin(2)}
          </span>
        </div>
        <h3 className="font-display text-2xl font-extrabold leading-tight">{guide.productName}</h3>
        <p className="mt-1 font-serif text-sm italic text-stone-600!">“Crafted with pure Anakapalle Jaggery & Ancient Ragi Millets”</p>
      </div>

      {/* Nutrition facts header */}
      <div className="mb-2 border-b-4 pb-2">
        <h4 className="text-3xl font-black">Nutrition Facts</h4>
        <div className={`mt-1 flex items-center justify-between gap-3 rounded text-xs font-semibold ${mark(0)}`}>
          <span className="inline-flex items-center gap-2">Serving Size: 1 cookie (12g) {pin(0)}</span>
          <span>Servings Per Pack: ~10</span>
        </div>
      </div>

      {/* Calories */}
      <div className="flex items-baseline justify-between border-b-8 py-2">
        <div>
          <div className="text-xs font-bold">Amount Per Serving</div>
          <div className="text-3xl font-black">Calories 48</div>
        </div>
        <div className="text-xs font-bold text-stone-600!">Per 100g: 400 kcal</div>
      </div>

      {/* Nutrients */}
      <div className="divide-black text-xs">
        <div className="flex justify-between py-1.5 font-bold"><span>Total Fat 2.2g</span><span>3% DV</span></div>
        <div className="flex justify-between py-1.5 pl-4 font-semibold"><span>Saturated Fat 0.8g</span><span>4% DV</span></div>
        <div className="flex justify-between bg-amber-100 px-1 py-1.5 font-bold"><span>Total Carbohydrate 9.8g</span><span>4% DV</span></div>
        <div className="flex justify-between py-1.5 pl-4"><span>Dietary Fiber 0.6g</span><span>2% DV</span></div>
        <div className="flex justify-between bg-rose-100 py-1.5 pl-4 pr-1 font-bold"><span>Total Sugars 3.4g</span><span>—</span></div>
        <div className="flex justify-between bg-rose-50 py-1.5 pl-8 pr-1 font-semibold"><span>Includes 3.4g Added Sugars</span><span>7% DV</span></div>
        <div className="flex justify-between py-1.5 font-bold"><span>Protein 0.8g</span><span>—</span></div>
      </div>

      {/* Ingredients */}
      <div className="mt-3 border-t-4 pt-3 text-[11px] leading-relaxed">
        <strong>INGREDIENTS:</strong> Finger Millet Flour (Ragi 26%), Refined Wheat Flour (Maida),{' '}
        <span className="bg-amber-200 px-1 font-bold">Unrefined Jaggery (20%)</span>, Edible Vegetable Oil (Palm),{' '}
        <span className={`inline-flex items-center gap-1.5 rounded bg-rose-200 px-1 font-bold ${mark(1)}`}>
          Maltodextrin (14%) {pin(1)}
        </span>
        , Liquid Invert Syrup (8%), Raising Agents (INS 500ii), Added Identical Flavourings.
      </div>
    </div>
  );
};

export default InteractiveLabel;
