import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Globe } from 'lucide-react';

export const LanguageToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
        language === 'te'
          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
          : 'bg-white/5 text-slate-300 border-white/10 hover:border-amber-400/40'
      } ${className}`}
      aria-label={language === 'en' ? 'Switch to Telugu' : 'Switch to English'}
      title={language === 'en' ? 'తెలుగులోకి మార్చండి' : 'Switch to English'}
    >
      <Globe className="w-3.5 h-3.5 text-amber-400" />
      <span>{language === 'en' ? 'తెలుగు' : 'English'}</span>
    </button>
  );
};

export default LanguageToggle;
