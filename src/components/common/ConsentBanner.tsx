import React, { useState, useEffect } from 'react';
import { ShieldCheck, X } from 'lucide-react';

export const ConsentBanner: React.FC = () => {
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
      className="fixed bottom-16 lg:bottom-4 left-4 right-4 sm:left-auto sm:right-4 z-40 max-w-md p-5 rounded-2xl bg-[#0e1218]/95 backdrop-blur-xl border border-amber-500/30 shadow-2xl text-xs text-slate-300 flex flex-col gap-3"
      role="region"
      aria-label="Privacy and analytics consent"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <ShieldCheck className="w-4 h-4 text-teal-400" />
          <span>Privacy & Editorial Ethics</span>
        </div>
        <button
          onClick={handleDecline}
          className="text-slate-400 hover:text-white"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="leading-relaxed">
        Telugu Sugars is 100% reader-first. We collect zero third-party advertising trackers and never sell your reading habits or health interests. We use privacy-conscious analytics only to improve content clarity.
      </p>

      <div className="flex items-center justify-end gap-2 pt-1">
        <button
          onClick={handleDecline}
          className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white font-medium"
        >
          Essential Only
        </button>
        <button
          onClick={handleAccept}
          className="px-4 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-bold shadow-md transition-colors"
        >
          Accept Preferences
        </button>
      </div>
    </aside>
  );
};

export default ConsentBanner;
