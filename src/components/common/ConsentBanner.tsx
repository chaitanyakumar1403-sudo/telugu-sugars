import React, { useState, useEffect } from 'react';
import { ShieldCheck, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const ConsentBanner: React.FC = () => {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasConsented = localStorage.getItem('telugusugars_consent');
    if (!hasConsented) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('telugusugars_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('telugusugars_consent', 'minimal');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      className="fixed bottom-20 lg:bottom-5 left-4 right-4 sm:left-auto sm:right-5 z-40 sm:max-w-sm p-4 rounded-2xl bg-(--bg-panel)/95 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/60 text-xs text-slate-300 flex flex-col gap-3"
      role="region"
      aria-label={t('cb_aria')}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <ShieldCheck className="w-4 h-4 text-teal-400" />
          <span>{t('cb_title')}</span>
        </div>
        <button
          onClick={handleDecline}
          className="text-slate-400 hover:text-white"
          aria-label={t('cb_dismiss')}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="leading-relaxed">
        {t('cb_body')}
      </p>

      <div className="flex items-center justify-end gap-2 pt-1">
        <button
          onClick={handleDecline}
          className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white font-medium"
        >
          {t('cb_min')}
        </button>
        <button
          onClick={handleAccept}
          className="px-4 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-[#fff] font-bold shadow-md transition-colors"
        >
          {t('cb_accept')}
        </button>
      </div>
    </aside>
  );
};

export default ConsentBanner;
