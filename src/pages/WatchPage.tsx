import React from 'react';
import VideoSections from '../components/watch/VideoSections';
import { useLanguage } from '../context/LanguageContext';

export const WatchPage: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col gap-16 pb-28 pt-12 sm:pt-16">
      <h1 className="reveal container font-display text-6xl font-extrabold leading-[0.95] text-white sm:text-8xl">{t('nav_watch')}</h1>
      <VideoSections />
    </div>
  );
};

export default WatchPage;
