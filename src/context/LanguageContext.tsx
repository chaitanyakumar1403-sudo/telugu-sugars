import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types/content';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const TRANSLATIONS: Record<string, { en: string; te: string }> = {
  nav_stories: { en: 'Stories', te: 'కథనాలు' },
  nav_watch: { en: 'Watch', te: 'వీడియోలు' },
  nav_topics: { en: 'Topics', te: 'అంశాలు' },
  nav_research: { en: 'Research Graph', te: 'పరిశోధన గ్రాఫ్' },
  nav_food_labels: { en: 'Food Labels', te: 'ఫుడ్ లేబుల్స్' },
  nav_standards: { en: 'Standards', te: 'ప్రమాణాలు' },
  search_placeholder: { en: 'Search articles, studies, food labels...', te: 'వ్యాసాలు, పరిశోధనలు, ఫుడ్ లేబుల్స్ శోధించండి...' },
  switch_to_telugu: { en: 'తెలుగు', te: 'English' },
  cta_explore: { en: 'Explore the Latest', te: 'తాజా పరిశోధనలను చూడండి' },
  cta_browse_evidence: { en: 'Browse Evidence', te: 'పరిశోధన ఆధారాలు' },
  hero_tagline: {
    en: 'Investigative science and cultural truth behind the sugars we consume.',
    te: 'మనం రోజూ తినే చక్కెరల వెనుక ఉన్న నిఖార్సయిన సైన్స్ మరియు వాస్తవాలు.',
  },
  what_study_found: { en: 'What the study found', te: 'పరిశోధనలో తేలిన అంశం' },
  what_cannot_tell: { en: 'What it cannot tell us', te: 'పరిశోధన నిరూపించలేని అంశం' },
  read_mode_toggle: { en: 'Reading Mode', te: 'చదివే మోడ్' },
  listen_mode: { en: 'Audio Narration', te: 'ఆడియో వ్యాఖ్యానం' },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('telugusugars_lang') as Language | null;
    if (saved === 'en' || saved === 'te') {
      setLanguageState(saved);
    }
  }, []);

  const toggleLanguage = () => {
    setLanguageState((prev) => {
      const next = prev === 'en' ? 'te' : 'en';
      localStorage.setItem('telugusugars_lang', next);
      return next;
    });
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('telugusugars_lang', lang);
  };

  const t = (key: string): string => {
    const entry = TRANSLATIONS[key];
    if (!entry) return key;
    return entry[language] || entry.en;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
