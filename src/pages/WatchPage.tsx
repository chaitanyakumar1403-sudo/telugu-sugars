import React from 'react';
import VideoSections from '../components/watch/VideoSections';
import { useLanguage } from '../context/LanguageContext';

export const WatchPage: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col gap-14 pb-24 pt-12 sm:pt-16">
      <header className="container">
        <h1 className="display-title text-[clamp(3rem,13vw,7rem)] text-white">{t('nav_watch')}</h1>
      </header>
      <VideoSections />
    </div>
  );
};

export default WatchPage;
