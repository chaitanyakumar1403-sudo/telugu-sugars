import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ShieldCheck, Mail, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
  onOpenNewsletter: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenNewsletter }) => {
  const { t } = useLanguage();

  return (
    <footer className="w-full bg-[#060709] border-t border-white/10 pt-16 pb-24 lg:pb-16 text-slate-400 text-xs">
      <div className="container mx-auto px-4 max-w-6xl flex flex-col gap-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start justify-between">
          {/* Brand Info */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-amber-600 to-amber-900 flex items-center justify-center font-bold text-black text-lg">
                TS
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-white text-base tracking-tight">
                  TELUGU SUGARS
                </span>
                <span className="text-[11px] text-amber-300 font-telugu">
                  తెలుగు సుగర్స్ • ఎవిడెన్స్ జర్నల్
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              An independent, evidence-first digital publication and interactive research platform investigating dietary sugars, sweeteners, and metabolic truth across Andhra Pradesh, Telangana, and the global Telugu diaspora.
            </p>

            <button
              onClick={onOpenNewsletter}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold hover:bg-amber-500/25 transition-colors w-fit"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Subscribe to Monthly Evidence Dispatch</span>
            </button>
          </div>

          {/* Sitemaps (PDF Recommended URL Patterns) */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">
              Investigations & Tools
            </h4>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => onNavigate('/stories')}
                className="text-left hover:text-amber-400 transition-colors"
              >
                /stories — All Investigations
              </button>
              <button
                onClick={() => onNavigate('/watch')}
                className="text-left hover:text-amber-400 transition-colors"
              >
                /watch — Video Episodes & Transcripts
              </button>
              <button
                onClick={() => onNavigate('/research')}
                className="text-left hover:text-amber-400 transition-colors"
              >
                /research — Connected Papers Graph
              </button>
              <button
                onClick={() => onNavigate('/food-labels')}
                className="text-left hover:text-amber-400 transition-colors"
              >
                /food-labels — Interactive Label Walkthrough
              </button>
              <button
                onClick={() => onNavigate('/topics')}
                className="text-left hover:text-amber-400 transition-colors"
              >
                /topics — Curated Metabolic Pathways
              </button>
            </div>
          </div>

          {/* Institutional Transparency */}
          <div className="md:col-span-4 flex flex-col gap-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">
              Editorial Standards
            </h4>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => onNavigate('/about/editorial-standards')}
                className="text-left hover:text-amber-400 transition-colors flex items-center gap-1"
              >
                <span>/about/editorial-standards</span>
                <ArrowUpRight className="w-3 h-3 text-slate-500" />
              </button>
              <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                Telugu Sugars operates under strict conflict-of-interest firewalls. We accept zero financial contributions, sponsored content, or review products from food, beverage, or sweetener corporations.
              </p>
            </div>
          </div>
        </div>

        {/* Safety Disclaimer (PDF Page 3 & 6 Directive) */}
        <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p className="max-w-3xl">
            <strong>Medical Disclaimer:</strong> Telugu Sugars is an investigative science publication, not a clinical healthcare provider. Content is for educational, journalistic, and public interest purposes and must never replace personalized consultation with a licensed endocrinologist or certified physician.
          </p>
          <div>
            © {new Date().getFullYear()} Telugu Sugars. All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
