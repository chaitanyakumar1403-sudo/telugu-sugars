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
  nav_research: { en: 'Research', te: 'పరిశోధన' },
  nav_food_labels: { en: 'Food Labels', te: 'లేబుల్ చదవడం' },
  nav_standards: { en: 'Standards', te: 'ప్రమాణాలు' },
  nav_atlas: { en: 'Ingredient Atlas', te: 'ప్యాకెట్‌లో ఏముంది?' },
  search_placeholder: { en: 'Search articles, studies, food labels...', te: 'వ్యాసాలు, పరిశోధనలు, ఫుడ్ లేబుల్స్ శోధించండి...' },
  switch_to_telugu: { en: 'తెలుగు', te: 'English' },
  cta_explore: { en: 'Watch today’s video', te: 'నేటి వీడియో చూడండి' },
  cta_browse_evidence: { en: 'Browse Evidence', te: 'పరిశోధన ఆధారాలు' },
  hero_tagline: {
    en: 'Investigative science and cultural truth behind the sugars we consume.',
    te: 'మనం రోజూ తినే చక్కెరల వెనుక ఉన్న నిఖార్సయిన సైన్స్ మరియు వాస్తవాలు.',
  },
  what_study_found: { en: 'What the study found', te: 'పరిశోధనలో తేలిన అంశం' },
  what_cannot_tell: { en: 'What it cannot tell us', te: 'పరిశోధన నిరూపించలేని అంశం' },
  read_mode_toggle: { en: 'Reading Mode', te: 'చదివే మోడ్' },
  listen_mode: { en: 'Audio Narration', te: 'ఆడియో వ్యాఖ్యానం' },
  what_title: { en: 'What does Telugu Sugars', te: 'తెలుగు సుగర్స్' },
  what_accent: { en: 'do?', te: 'ఏం చేస్తుంది?' },
  what_lead: {
    en: 'We tell you, simply, what is really inside the food and drinks you buy every day.',
    te: 'మీరు రోజూ కొనే ఆహారం, పానీయాల లోపల నిజంగా ఏముందో మేము సులభంగా చెబుతాం.',
  },
  listen: { en: 'Listen', te: 'వినండి' },
  listen_stop: { en: 'Stop', te: 'ఆపండి' },
  do1_t: { en: 'We read the back of the packet', te: 'ప్యాకెట్ వెనుక భాగం చదువుతాం' },
  do1_d: { en: 'Biscuits, cool drinks, chips, health drinks: we read the small print you usually skip.', te: 'బిస్కెట్లు, కూల్ డ్రింకులు, చిప్స్, హెల్త్ డ్రింకులు: మీరు సాధారణంగా వదిలేసే చిన్న అక్షరాలను మేము చదువుతాం.' },
  do2_t: { en: 'We check what science says', te: 'సైన్స్ ఏం చెబుతుందో చూస్తాం' },
  do2_d: { en: 'WHO, doctors and published research. Not our opinion, and not company adverts.', te: 'WHO, డాక్టర్లు, ప్రచురితమైన పరిశోధనలు. మా అభిప్రాయం కాదు, కంపెనీ ప్రకటనలూ కాదు.' },
  do3_t: { en: 'We explain it simply, in Telugu', te: 'తెలుగులో సులభంగా వివరిస్తాం' },
  do3_d: { en: 'Short videos and this website, in words everyone at home understands.', te: 'చిన్న వీడియోలు, ఈ వెబ్‌సైట్ — ఇంట్లో అందరికీ అర్థమయ్యే మాటల్లో.' },
  do4_t: { en: 'For every age at home', te: 'ఇంట్లో ప్రతి వయసు వారికీ' },
  do4_d: { en: 'Babies, children, parents and grandparents: we say what is fine and what needs care for each one.', te: 'పసిపిల్లలు, పిల్లలు, తల్లిదండ్రులు, తాతయ్య-అమ్మమ్మలు: ఒక్కొక్కరికీ ఏది సరే, దేనికి జాగ్రత్త అవసరమో చెబుతాం.' },
  do5_t: { en: 'No money from food companies', te: 'ఆహార కంపెనీల నుంచి డబ్బు తీసుకోం' },
  do5_d: { en: 'We take zero money or free products from food, drink or sweetener companies.', te: 'ఆహార, పానీయ, స్వీటెనర్ కంపెనీల నుంచి డబ్బు గానీ, ఉచిత ఉత్పత్తులు గానీ తీసుకోం.' },
  do6_t: { en: 'Soon: our own food', te: 'త్వరలో: మా సొంత ఆహారం' },
  do6_d: { en: 'Our first food outlet is on its way, and after it a food truck.', te: 'మా మొదటి ఫుడ్ అవుట్‌లెట్ రాబోతోంది, ఆ తర్వాత ఫుడ్ ట్రక్.' },
  ch1_kicker: { en: 'Chapter 01', te: 'అధ్యాయం 01' },
  ch1_title: { en: 'How it', te: 'ఎలా' },
  ch1_accent: { en: 'started', te: 'మొదలైంది' },
  ch1_empty: { en: 'The first episodes are on their way.', te: 'మొదటి ఎపిసోడ్‌లు త్వరలో వస్తున్నాయి.' },
  ch2_kicker: { en: 'Chapter 02 · Updated daily', te: 'అధ్యాయం 02 · రోజూ కొత్తది' },
  ch2_title: { en: 'How it’s', te: 'ఎలా' },
  ch2_accent: { en: 'going', te: 'సాగుతోంది' },
  ch2_empty: { en: 'A new video lands here every day. Check back tomorrow.', te: 'రోజూ ఇక్కడ ఒక కొత్త వీడియో వస్తుంది. రేపు మళ్ళీ చూడండి.' },
  ch2_day1: { en: 'Day 1 starts soon', te: 'మొదటి రోజు త్వరలో' },
  coming_soon: { en: 'Coming soon', te: 'త్వరలో' },
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
