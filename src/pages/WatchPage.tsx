import React from 'react';
import VideoSections from '../components/watch/VideoSections';
import { useLanguage } from '../context/LanguageContext';

export const WatchPage: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col gap-16 pb-28 pt-12 sm:pt-16">
      <header className="reveal container">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-amber-500">{t('ch2_kicker')}</p>
        <h1 className="display-title mt-3 text-7xl text-white sm:text-9xl">
          {t('nav_watch')}<span aria-hidden="true" className="text-amber-500">.</span>
        </h1>
      </header>
      <VideoSections />
    </div>
  );
};

export default WatchPage;
