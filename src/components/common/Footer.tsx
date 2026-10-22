import React from 'react';
import { Mail, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface FooterProps {
  onNavigate: (path: string) => void;
  onOpenNewsletter: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenNewsletter }) => {
  const { t } = useLanguage();
  return (
    <footer className="site-footer w-full pt-16 pb-24 lg:pb-16 text-xs text-[#fff]/85">
      <div className="container mx-auto px-4 max-w-6xl flex flex-col gap-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start justify-between">
          {/* Brand Info */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#fff] flex items-center justify-center font-display font-extrabold text-[#ff6a00] text-base shadow-lg shadow-black/10">
                TS
              </div>
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-[#fff] text-base tracking-tight">
                  TELUGU SUGARS
                </span>
                <span className="text-[11px] text-[#fff]/90 font-telugu">
                  తెలుగు సుగర్స్ • ఎవిడెన్స్ జర్నల్
                </span>
              </div>
            </div>

            <p className="text-[#fff]/90 text-sm leading-relaxed max-w-sm">
              {t('f_about')}
            </p>

            <button
              onClick={onOpenNewsletter}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#fff] text-[#e85d00] font-bold shadow-lg shadow-black/10 hover:-translate-y-0.5 transition-colors w-fit"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{t('f_sub')}</span>
            </button>
          </div>

          {/* Sitemaps (PDF Recommended URL Patterns) */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <h4 className="font-mono font-bold text-[#fff] uppercase tracking-[0.16em] text-[11px]">
              {t('f_explore')}
            </h4>
            <div className="flex flex-col gap-2">
              {[
                ['/atlas', 'nav_atlas'],
                ['/watch', 'nav_watch'],
                ['/research', 'nav_research'],
                ['/food-labels', 'nav_food_labels'],
                ['/creators', 'nav_creators'],
              ].map(([path, key]) => (
                <button key={path} onClick={() => onNavigate(path)} className="text-left text-sm hover:text-[#fff] hover:underline underline-offset-4 transition-colors">
                  {t(key)}
                </button>
              ))}
            </div>
          </div>

          {/* Institutional Transparency */}
          <div className="md:col-span-4 flex flex-col gap-3">
            <h4 className="font-mono font-bold text-[#fff] uppercase tracking-[0.16em] text-[11px]">
              {t('f_standards')}
            </h4>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => onNavigate('/about/editorial-standards')}
                className="text-left text-sm hover:text-[#fff] hover:underline underline-offset-4 transition-colors flex items-center gap-1"
              >
                <span>{t('f_read')}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
              <p className="text-xs text-[#fff]/80 leading-relaxed mt-1">
                {t('f_firewall')}
              </p>
            </div>
          </div>
        </div>

        {/* Safety Disclaimer (PDF Page 3 & 6 Directive) */}
        <div className="pt-6 border-t border-[#fff]/25 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-[#fff]/80">
          <p className="max-w-3xl">
            <strong>{t('f_disclaimer_label')}</strong> {t('f_disclaimer')}
          </p>
          <div>
            © {new Date().getFullYear()} {t('f_rights')}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
