import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types/content';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const TRANSLATIONS: Record<string, { en: string; te: string }> = {
  nav_stories: { en: 'Stories', te: 'కథనాలు' },
  nav_watch: { en: 'Watch', te: 'వీడియోలు' },
  nav_topics: { en: 'Topics', te: 'అంశాలు' },
  nav_research: { en: 'Research', te: 'పరిశోధన' },
  nav_food_labels: { en: 'Food Labels', te: 'లేబుల్ చదవడం' },
  nav_creators: { en: 'Creators', te: 'క్రియేటర్స్' },
  cr_kicker: { en: 'Creator Partner Program', te: 'క్రియేటర్ పార్ట్‌నర్ ప్రోగ్రామ్' },
  cr_title: { en: 'Create with Telugu Sugars', te: 'తెలుగు సుగర్స్‌తో కంటెంట్ చేయండి' },
  cr_lead: { en: 'A community stage for creators who have been waiting to start. Register below, make content about Telugu Sugars, and we will get in touch.', te: 'మొదలుపెట్టడానికి సంకోచిస్తున్న క్రియేటర్ల కోసం ఒక కమ్యూనిటీ వేదిక. క్రింద నమోదు చేసుకోండి, తెలుగు సుగర్స్ గురించి కంటెంట్ చేయండి, మేము మిమ్మల్ని సంప్రదిస్తాం.' },
  cr_name: { en: 'Full name', te: 'పూర్తి పేరు' },
  cr_phone: { en: 'Contact number', te: 'ఫోన్ నంబర్' },
  cr_insta: { en: 'Instagram ID', te: 'ఇన్‌స్టాగ్రామ్ ఐడి' },
  cr_address: { en: 'Address / city', te: 'చిరునామా / ఊరు' },
  cr_submit: { en: 'Register as a creator', te: 'క్రియేటర్‌గా నమోదు చేయండి' },
  cr_sending: { en: 'Sending…', te: 'పంపుతున్నాం…' },
  cr_done_t: { en: 'You are registered!', te: 'మీ నమోదు పూర్తయింది!' },
  cr_done_d: { en: 'Thanks for joining. The Telugu Sugars team will reach out to you soon.', te: 'చేరినందుకు ధన్యవాదాలు. తెలుగు సుగర్స్ టీమ్ త్వరలో మిమ్మల్ని సంప్రదిస్తుంది.' },
  cr_error: { en: 'Could not send right now. Please try again, or email telugusugars@gmail.com.', te: 'ఇప్పుడు పంపలేకపోయాం. మళ్ళీ ప్రయత్నించండి, లేదా telugusugars@gmail.com కి మెయిల్ చేయండి.' },
  nav_standards: { en: 'Standards', te: 'ప్రమాణాలు' },
  nav_atlas: { en: 'Ingredient Atlas', te: 'ప్యాకెట్‌లో ఏముంది?' },
  search_placeholder: { en: 'Search articles, studies, food labels...', te: 'వ్యాసాలు, పరిశోధనలు, ఫుడ్ లేబుల్స్ శోధించండి...' },
  switch_to_telugu: { en: 'తెలుగు', te: 'English' },
  cta_explore: { en: 'Watch today’s video', te: 'ఈరోజు వీడియో చూడండి' },
  cta_browse_evidence: { en: 'Browse Evidence', te: 'పరిశోధన ఆధారాలు' },
  hero_tagline: {
    en: 'Investigative science and cultural truth behind the sugars we consume.',
    te: 'మనం రోజూ తినే, తాగే వాటిలో దాగి ఉన్న చక్కెర, రసాయనాల గురించి సైన్స్ చెప్పే నిజం — మన తెలుగులో.',
  },
  what_study_found: { en: 'What the study found', te: 'పరిశోధనలో తేలిన అంశం' },
  what_cannot_tell: { en: 'What it cannot tell us', te: 'పరిశోధన నిరూపించలేని అంశం' },
  read_mode_toggle: { en: 'Reading Mode', te: 'చదివే మోడ్' },
  listen_mode: { en: 'Audio Narration', te: 'ఆడియో వ్యాఖ్యానం' },
  what_title: { en: 'What does Telugu Sugars', te: 'తెలుగు సుగర్స్' },
  what_accent: { en: 'do?', te: 'ఏం చేస్తుంది?' },
  what_lead: {
    en: 'We tell you, simply, what is really inside the food and drinks you buy every day.',
    te: 'మనం రోజూ కొనే ఆహారం, డ్రింకుల్లో అసలు ఏముందో మీకు సులువుగా చెబుతాం.',
  },
  listen: { en: 'Listen', te: 'వినండి' },
  listen_stop: { en: 'Stop', te: 'ఆపండి' },
  do1_t: { en: 'We read the back of the packet', te: 'ప్యాకెట్ వెనక ఏం రాసుందో చదువుతాం' },
  do1_d: { en: 'Biscuits, cool drinks, chips, health drinks: we read the small print you usually skip.', te: 'బిస్కెట్లు, కూల్ డ్రింకులు, చిప్స్, హెల్త్ డ్రింకులు — ప్యాకెట్ వెనక చిన్న అక్షరాల్లో రాసింది మేము చదువుతాం.' },
  do2_t: { en: 'We check what science says', te: 'సైన్స్ ఏం చెబుతుందో చూస్తాం' },
  do2_d: { en: 'WHO, doctors and published research. Not our opinion, and not company adverts.', te: 'WHO, డాక్టర్లు, పరిశోధనలు ఏం చెప్పాయో చూస్తాం. మా సొంత అభిప్రాయం కాదు, కంపెనీ ప్రకటనలు కాదు.' },
  do3_t: { en: 'We explain it simply, in Telugu', te: 'తెలుగులో, సులువుగా చెబుతాం' },
  do3_d: { en: 'Short videos and this website, in words everyone at home understands.', te: 'చిన్న వీడియోలు, ఈ వెబ్‌సైట్ — ఇంట్లో అందరికీ అర్థమయ్యే మాటల్లో.' },
  do4_t: { en: 'For every age at home', te: 'ఇంట్లో ప్రతి వయసు వారికీ' },
  do4_d: { en: 'Babies, children, parents and grandparents: we say what is fine and what needs care for each one.', te: 'పసిపిల్లలు, పిల్లలు, అమ్మానాన్నలు, తాతయ్య-అమ్మమ్మలు — ఎవరికి ఏది పర్వాలేదో, ఎవరికి ఏది జాగ్రత్తో వేరువేరుగా చెబుతాం.' },
  do5_t: { en: 'No money from food companies', te: 'ఫుడ్ కంపెనీల డబ్బు తీసుకోం' },
  do5_d: { en: 'We take zero money or free products from food, drink or sweetener companies.', te: 'ఫుడ్, డ్రింక్, స్వీటెనర్ కంపెనీల నుంచి ఒక్క రూపాయి గానీ, ఉచిత వస్తువులు గానీ తీసుకోం.' },
  do6_t: { en: 'Soon: our own food', te: 'త్వరలో: మా సొంత ఆహారం' },
  do6_d: { en: 'Our first food outlet is on its way, and after it a food truck.', te: 'మా మొదటి ఫుడ్ ఔట్‌లెట్ త్వరలో వస్తోంది. ఆ తర్వాత ఫుడ్ ట్రక్.' },
  ch1_kicker: { en: 'Chapter 01', te: 'అధ్యాయం 01' },
  ch1_title: { en: 'How it', te: 'ఎలా' },
  ch1_accent: { en: 'started', te: 'మొదలైంది' },
  ch1_empty: { en: 'The first episodes are on their way.', te: 'మొదటి వీడియోలు త్వరలో వస్తున్నాయి.' },
  ch2_kicker: { en: 'Chapter 02 · Updated daily', te: 'అధ్యాయం 02 · రోజూ కొత్తది' },
  ch2_title: { en: 'How it’s', te: 'ఎలా' },
  ch2_accent: { en: 'going', te: 'సాగుతోంది' },
  ch2_empty: { en: 'A new video lands here every day. Check back tomorrow.', te: 'రోజూ ఇక్కడ ఒక కొత్త వీడియో వస్తుంది. రేపు మళ్ళీ చూడండి.' },
  ch2_day1: { en: 'Day 1 starts soon', te: 'మొదటి రోజు త్వరలో' },
  coming_soon: { en: 'Coming soon', te: 'త్వరలో' },
  home_features: { en: 'Features', te: 'విభాగాలు' },

  // App shell
  skip_main: { en: 'Skip to main content', te: 'ముఖ్య భాగానికి వెళ్ళండి' },
  nav_home: { en: 'Home', te: 'హోమ్' },
  nav_atlas_short: { en: 'Atlas', te: 'ఏముంది?' },
  nav_brand_aria: { en: 'Telugu Sugars Home', te: 'తెలుగు సుగర్స్ హోమ్' },
  nav_main_aria: { en: 'Main Navigation', te: 'ముఖ్య మెనూ' },
  nav_mobile_aria: { en: 'Mobile Bottom Navigation', te: 'కింది మెనూ' },
  disp_aria: { en: 'Display settings: colours and text size', te: 'చూపు: రంగులు, అక్షరాల సైజు' },
  theme_title: { en: 'Colours', te: 'రంగులు' },
  theme_system: { en: 'System (same as phone)', te: 'సిస్టమ్ (ఫోన్ లాగానే)' },
  theme_light: { en: 'Light', te: 'లైట్ (తెలుపు)' },
  theme_dark: { en: 'Dark', te: 'డార్క్ (నలుపు)' },
  size_title: { en: 'Text size', te: 'అక్షరాల సైజు' },
  size_normal: { en: 'Normal', te: 'మామూలు' },
  size_big: { en: 'Big', te: 'పెద్ద' },
  size_bigger: { en: 'Bigger', te: 'ఇంకా పెద్ద' },

  // Footer
  f_about: {
    en: 'An independent, evidence-first digital publication and interactive research platform investigating dietary sugars, sweeteners, and metabolic truth across Andhra Pradesh, Telangana, and the global Telugu diaspora.',
    te: 'చక్కెర, స్వీటెనర్లు, మనం తినే ఆహారం వెనక ఉన్న నిజాన్ని ఆధారాలతో వెతికే స్వతంత్ర వేదిక — ఆంధ్రప్రదేశ్, తెలంగాణ, ప్రపంచంలోని తెలుగు వారందరి కోసం.',
  },
  f_sub: { en: 'Subscribe to Monthly Evidence Dispatch', te: 'నెలకోసారి మా ముఖ్యమైన విషయాలు పొందండి' },
  f_explore: { en: 'Explore', te: 'చూడండి' },
  f_standards: { en: 'Editorial Standards', te: 'మా నియమాలు' },
  f_read: { en: 'Read our standards', te: 'మా నియమాలు చదవండి' },
  f_firewall: {
    en: 'Telugu Sugars operates under strict conflict-of-interest firewalls. We accept zero financial contributions, sponsored content, or review products from food, beverage, or sweetener corporations.',
    te: 'ఫుడ్, డ్రింక్, స్వీటెనర్ కంపెనీల నుంచి మేము ఎలాంటి డబ్బు, స్పాన్సర్‌షిప్, ఉచిత వస్తువులు తీసుకోం.',
  },
  f_disclaimer_label: { en: 'Medical Disclaimer:', te: 'గమనిక:' },
  f_disclaimer: {
    en: 'Telugu Sugars is an investigative science publication, not a clinical healthcare provider. Content is for educational, journalistic, and public interest purposes and must never replace personalized consultation with a licensed endocrinologist or certified physician.',
    te: 'తెలుగు సుగర్స్ ఒక పరిశోధన, సమాచార వేదిక. ఆసుపత్రి కాదు. ఇక్కడి సమాచారం అవగాహన కోసం మాత్రమే. మీ ఆరోగ్యం కోసం ఎప్పుడూ డాక్టర్‌ని సంప్రదించండి.',
  },
  f_rights: { en: 'Telugu Sugars. All Rights Reserved.', te: 'తెలుగు సుగర్స్. అన్ని హక్కులు మావే.' },

  // Newsletter modal
  nl_aria: { en: 'Telugu Sugars Evidence Dispatch', te: 'తెలుగు సుగర్స్ నెలవారీ సమాచారం' },
  nl_close: { en: 'Close', te: 'మూసేయండి' },
  nl_done_t: { en: 'Subscription Confirmed!', te: 'సబ్‌స్క్రిప్షన్ పూర్తయింది!' },
  nl_done_d: {
    en: 'Thank you for trusting Telugu Sugars. You will receive our monthly peer-reviewed clinical dossier with zero promotional noise.',
    te: 'తెలుగు సుగర్స్‌ని నమ్మినందుకు ధన్యవాదాలు. నెలకోసారి, ఎలాంటి ప్రకటనలు లేకుండా, ఆధారాలతో కూడిన మా సమాచారం మీకు వస్తుంది.',
  },
  nl_kicker: { en: 'Evidence Dispatch • ఉచిత సబ్‌స్క్రిప్షన్', te: 'నెలవారీ సమాచారం • ఉచిత సబ్‌స్క్రిప్షన్' },
  nl_title: { en: 'Stay Grounded in Metabolic Truth', te: 'మనం తినే దాని వెనక నిజం తెలుసుకోండి' },
  nl_lead: {
    en: 'Receive our monthly forensic breakdowns of supermarket food deceptions, clinical sweetener research, and Telugu dietary investigations.',
    te: 'సూపర్‌మార్కెట్ ఆహారంలో దాగి ఉన్న మోసాలు, స్వీటెనర్లపై పరిశోధనలు, మన తెలుగు ఆహారపు అలవాట్లపై మా విశ్లేషణ — నెలకోసారి మీ ఈమెయిల్‌కి.',
  },
  nl_email: { en: 'Email Address:', te: 'ఈమెయిల్ అడ్రస్:' },
  nl_consent: {
    en: 'I explicitly consent to receiving monthly scientific updates. Telugu Sugars guarantees 1-click unsubscribe and promises never to collect sensitive personal medical records or sell subscriber data.',
    te: 'నెలకోసారి వచ్చే ఈ సమాచారం కోసం నా అంగీకారం ఇస్తున్నాను. ఒక్క క్లిక్‌తో ఎప్పుడైనా ఆపేయొచ్చు. తెలుగు సుగర్స్ మీ ఆరోగ్య రికార్డులు సేకరించదు, మీ వివరాలు ఎవరికీ అమ్మదు.',
  },
  nl_submit: { en: 'Confirm Free Subscription', te: 'ఉచితంగా సబ్‌స్క్రైబ్ చేయండి' },

  // Consent banner
  cb_aria: { en: 'Privacy and analytics consent', te: 'గోప్యత, అనలిటిక్స్ అంగీకారం' },
  cb_title: { en: 'Your privacy', te: 'మీ గోప్యత' },
  cb_dismiss: { en: 'Dismiss banner', te: 'మూసేయండి' },
  cb_body: {
    en: 'No ad trackers, ever. We only use privacy-friendly analytics to improve our reporting.',
    te: 'ప్రకటనల ట్రాకర్లు ఎప్పుడూ ఉండవు. మా సమాచారాన్ని మెరుగుపరచడానికి గోప్యతను కాపాడే అనలిటిక్స్ మాత్రమే వాడతాం.',
  },
  cb_min: { en: 'Essential only', te: 'అవసరమైనవి మాత్రమే' },
  cb_accept: { en: 'Accept preferences', te: 'అంగీకరిస్తున్నాను' },

  // Watch
  vid_today: { en: 'Today', te: 'ఈరోజు' },
  vid_day: { en: 'Day {n}', te: '{n}వ రోజు' },
  vid_affiliate: { en: 'Affiliate', te: 'అఫిలియేట్' },
  vid_count: { en: '{n} days and counting', te: '{n} రోజులు, ఇంకా కొనసాగుతోంది' },
  vid_none: { en: 'no video', te: 'వీడియో లేదు' },
  vid_jump: { en: 'Jump to video from {d}', te: '{d} నాటి వీడియోకి వెళ్ళండి' },
  vid_streak: { en: 'Last 21 days of videos', te: 'గత 21 రోజుల వీడియోలు' },
  soon_research: {
    en: 'Studies, sources and the evidence behind every video, gathered in one place. We are building it now.',
    te: 'ప్రతి వీడియో వెనక ఉన్న పరిశోధనలు, ఆధారాలు అన్నీ ఒకే చోట. ఇప్పుడు దీన్ని తయారు చేస్తున్నాం.',
  },

  // Food labels
  fl_kicker: { en: 'Interactive walkthrough', te: 'నొక్కి చూడండి' },
  fl_title: { en: 'Read the', te: 'లేబుల్' },
  fl_accent: { en: 'Label', te: 'చదవండి' },
  fl_lead: {
    en: 'Tap the numbered pins to see how a “traditional” cookie hides fast sugars behind its health claims.',
    te: 'నంబర్ ఉన్న పిన్‌ల మీద నొక్కండి. “సాంప్రదాయ” కుకీ ఆరోగ్యం పేరు చెప్పి, వేగంగా షుగర్ పెంచే చక్కెరను ఎలా దాచిపెడుతుందో చూడండి.',
  },
  fl_tap: { en: 'Tap a numbered pin', te: 'నంబర్ పిన్ మీద నొక్కండి' },
  fl_pin_aria: { en: 'Inspect hotspot: {t}', te: 'చూడండి: {t}' },
  fl_aliases: { en: 'Common Sugar Aliases Found in Telugu Supermarkets', te: 'మన సూపర్‌మార్కెట్ ప్యాకెట్లలో చక్కెరకు ఉండే వేరే పేర్లు' },
  fl_a1: { en: 'Maltodextrin', te: 'మాల్టోడెక్స్ట్రిన్ (Maltodextrin)' },
  fl_a1d: { en: 'Starch derivative • GI ~130', te: 'స్టార్చ్ నుంచి చేసేది • GI ~130' },
  fl_a2: { en: 'Invert Sugar', te: 'ఇన్వర్ట్ షుగర్ (Invert Sugar)' },
  fl_a2d: { en: 'Cleaved liquid sucrose • GI ~65', te: 'చక్కెరను విడగొట్టిన ద్రవం • GI ~65' },
  fl_a3: { en: 'Dextrose / Corn Syrup', te: 'డెక్స్ట్రోస్ / కార్న్ సిరప్ (Dextrose / Corn Syrup)' },
  fl_a3d: { en: 'Pure glucose syrup • GI ~100', te: 'స్వచ్ఛమైన గ్లూకోజ్ సిరప్ • GI ~100' },
  fl_a4: { en: 'Date / Rice Syrup', te: 'ఖర్జూరం / బియ్యం సిరప్ (Date / Rice Syrup)' },
  fl_a4d: { en: 'Concentrated free sugar • GI ~80', te: 'చిక్కటి చక్కెర ద్రవం • GI ~80' },
  hs_kicker: { en: 'Label hotspot', te: 'లేబుల్‌లో గమనించాల్సింది' },
  hs_close: { en: 'Close hotspot detail', te: 'మూసేయండి' },
  hs_claims: { en: 'What the pack claims', te: 'ప్యాకెట్ ఏం చెబుతోంది' },
  hs_reality: { en: 'What is really going on', te: 'అసలు నిజం ఏంటంటే' },
  hs_advice: { en: 'Buyer checklist', te: 'కొనేముందు చూడాల్సినవి' },

  // Ingredient Atlas
  a_kicker: { en: 'Interactive · {i} ingredients · {p} products', te: '{i} పదార్థాలు · {p} ప్యాకెట్లు, వంటకాలు' },
  a_title: { en: 'Ingredient', te: 'ప్యాకెట్‌లో' },
  a_accent: { en: 'Atlas', te: 'ఏముంది?' },
  a_lede: {
    en: 'Pick a product you buy, or an ingredient on its label. See every sugar, sweetener, colour, preservative and E-number inside, and what it means for infants, youth, middle-aged and older adults.',
    te: 'మీరు కొనే ప్యాకెట్ పేరు గానీ, దాని మీద రాసిన పదార్థం గానీ వెతకండి. అందులో ఉన్న చక్కెర, స్వీటెనర్లు, రంగులు, ప్రిజర్వేటివ్‌లు, E-నంబర్లు అన్నీ చూపిస్తాం. పసిపిల్లలకు, పిల్లలకు, మధ్య వయసు వారికి, పెద్దవాళ్ళకు ఏది మంచిదో కూడా చెబుతాం.',
  },
  a_search_ph: { en: 'Search Diet Coke, maltodextrin, E951, 635…', te: 'వెతకండి: మ్యాగీ, డైట్ కోక్, చక్కెర, 635…' },
  a_search_aria: { en: 'Search products, ingredients, E-numbers or concerns', te: 'ప్యాకెట్, పదార్థం, E-నంబర్ లేదా ఆరోగ్య సమస్య వెతకండి' },
  a_kind_con: { en: 'Concern', te: 'ఆరోగ్య సమస్య' },
  a_kind_dish: { en: 'Product', te: 'ప్యాకెట్' },
  a_kind_ing: { en: 'Ingredient', te: 'పదార్థం' },
  a_how: { en: 'How to use it, in 3 steps', te: 'మూడు స్టెప్పుల్లో ఎలా వాడాలి' },
  a_how1: { en: 'Find your packet: type its name, or tap a picture below.', te: 'మీ ప్యాకెట్ వెతకండి: పేరు టైప్ చేయండి, లేదా కింద బొమ్మ మీద నొక్కండి.' },
  a_how2: { en: 'Choose who is eating it: a baby, a child, you, or a grandparent.', te: 'ఎవరు తింటున్నారో ఎంచుకోండి: పసిబిడ్డ, పిల్లలు, మీరు, లేదా తాతయ్య-అమ్మమ్మ.' },
  a_how3: { en: 'Look at the colour: green is fine, orange means eat less, red means avoid.', te: 'రంగు చూడండి: ఆకుపచ్చ అంటే పర్వాలేదు, ఆరెంజ్ అంటే తక్కువగా, ఎరుపు అంటే వద్దు.' },
  a_stat_i: { en: 'ingredients and additives', te: 'పదార్థాలు' },
  a_stat_p: { en: 'products and dishes', te: 'ప్యాకెట్లు, వంటకాలు' },
  a_stat_ins: { en: 'INS codes decoded', te: 'INS కోడ్‌లు' },
  a_stat_c: { en: 'health concerns', te: 'ఆరోగ్య సమస్యలు' },
  a_tabs_aria: { en: 'Atlas views', te: 'అట్లాస్ విభాగాలు' },
  a_tab_products: { en: 'Products', te: 'ప్యాకెట్లు' },
  a_tab_check: { en: 'Ingredients & additives', te: 'పదార్థాలు' },
  a_tab_decode: { en: 'Label decoder', te: 'లేబుల్ చదవండి' },
  a_tab_map: { en: 'Connections', te: 'సంబంధాల మ్యాప్' },
  a_whos_eating: { en: 'Who’s eating?', te: 'ఎవరు తింటున్నారు?' },
  a_note: {
    en: 'General guidance based on public health advice from WHO, the NHS, paediatric bodies and food regulators. It does not replace a doctor or dietitian. Allergies, medicines and medical conditions change the answer for any one person. Additive rules differ by country, so check FSSAI rules in India. Product labels are abridged snapshots of Indian packs and sugar figures are approximate. Recipes change, so always read the pack in your hand.',
    te: 'ఇది సాధారణ సమాచారం మాత్రమే — WHO, NHS, పిల్లల వైద్య సంస్థలు, ఆహార నియంత్రణ సంస్థల సలహాల ఆధారంగా. ఇది డాక్టర్ లేదా డైటీషియన్‌కి బదులు కాదు. అలర్జీలు, మందులు, జబ్బులు ఉంటే సమాధానం మారుతుంది. అడిటివ్ నిబంధనలు దేశాన్ని బట్టి మారతాయి, భారత్‌లో FSSAI నిబంధనలు చూడండి. ప్యాకెట్ లేబుళ్లు భారత ప్యాకెట్ల నుంచి సంక్షిప్తంగా రాసినవి, చక్కెర లెక్కలు సుమారుగా ఇచ్చినవి. కంపెనీలు రెసిపీ మార్చొచ్చు, మీ చేతిలో ఉన్న ప్యాకెట్ చదవండి.',
  },
  // Atlas · connections map
  m_search: { en: 'Search', te: 'వెతకండి' },
  m_search_ph: { en: 'Name, E-number or concern', te: 'పేరు, E-నంబర్ లేదా ఆరోగ్య సమస్య' },
  m_match: { en: '{n} match', te: '{n} దొరికింది' },
  m_matches: { en: '{n} matches', te: '{n} దొరికాయి' },
  m_group: { en: 'Group', te: 'గ్రూప్' },
  m_all_groups: { en: 'All groups ({n})', te: 'అన్ని గ్రూపులు ({n})' },
  m_colour_by: { en: 'Colour by', te: 'రంగు దేని బట్టి' },
  m_type: { en: 'Type', te: 'రకం' },
  m_aria: { en: 'Network of ingredients, additives, sample dishes and health concerns', te: 'పదార్థాలు, అడిటివ్‌లు, వంటలు, ఆరోగ్య సమస్యల మధ్య సంబంధాల మ్యాప్' },
  m_hint: { en: 'drag nodes · click to open', te: 'చుక్కల్ని లాగొచ్చు · నొక్కితే వివరాలు' },
  m_leg_ing: { en: 'Ingredient or additive', te: 'పదార్థం లేదా అడిటివ్' },
  m_leg_dish: { en: 'Sample dish', te: 'ప్యాకెట్ లేదా వంట' },
  m_leg_con: { en: 'Health concern', te: 'ఆరోగ్య సమస్య' },
  // Atlas · detail panel and safety check
  d_none: { en: 'Nothing selected', te: 'ఏదీ ఎంచుకోలేదు' },
  d_none_hint: { en: 'Click any node to see what it connects to and how it rates for each age group.', te: 'ఏ చుక్క మీద నొక్కినా, అది ఏంటో, ఎవరికి సురక్షితమో ఇక్కడ కనిపిస్తుంది.' },
  d_open: { en: 'Open full safety check', te: 'పూర్తి వివరాలు చూడండి' },
  d_connected: { en: 'Connected items', te: 'సంబంధం ఉన్నవి' },
  d_found: { en: 'Found in sample dishes', te: 'ఇవి ఉన్న ప్యాకెట్లు, వంటలు' },
  d_pack: { en: 'Packaged product example', te: 'ప్యాకెట్ ఉదాహరణ' },
  d_menu: { en: 'Sample menu item', te: 'ఇంటి వంట ఉదాహరణ' },
  d_held: { en: 'Held back by {list}.', te: '{list} వల్ల జాగ్రత్త.' },
  d_all_ok: { en: 'Every ingredient is suitable.', te: 'లోపల ఉన్నవన్నీ పర్వాలేదు.' },
  c_ph: { en: 'Try maltodextrin, E621 or tartrazine', te: 'వెతకండి: మాల్టోడెక్స్ట్రిన్, E621, టార్ట్రాజిన్' },
  c_aria: { en: 'Find an ingredient, additive or dish', te: 'పదార్థం, అడిటివ్ లేదా వంట వెతకండి' },
  c_change: { en: 'Change', te: 'మార్చండి' },
  c_none: { en: 'No match. Try another name or E-number.', te: 'ఏమీ దొరకలేదు. వేరే పేరు లేదా E-నంబర్‌తో వెతకండి.' },
  c_menu: { en: 'Menu examples', te: 'ఇంటి వంటలు' },
  c_packs: { en: 'Packaged product examples', te: 'ప్యాకెట్లు' },
  c_concerns: { en: '{cat}. Concerns: {list}.', te: '{cat}. ఆరోగ్య సమస్యలు: {list}.' },
  c_none_flagged: { en: 'none flagged', te: 'ఏవీ లేవు' },
  c_pack_note: {
    en: 'Packaged product example built from a typical ingredient list. Real products vary, so check the label. ',
    te: 'సాధారణ పదార్థాల లిస్ట్‌తో చేసిన ప్యాకెట్ ఉదాహరణ. అసలు ప్యాకెట్లు వేరుగా ఉండొచ్చు, లేబుల్ చూడండి. ',
  },
  c_menu_note: { en: 'Sample menu item. ', te: 'ఇంటి వంట ఉదాహరణ. ' },
  c_strict: {
    en: 'Each rating is the strictest one among its ingredients, so changing the recipe changes the result.',
    te: 'లోపల ఉన్న వాటిలో ఎక్కువ జాగ్రత్త కావాల్సిన దాని ప్రకారమే రేటింగ్. రెసిపీ మారితే ఫలితం కూడా మారుతుంది.',
  },
  c_all_ok: { en: 'Every ingredient is suitable for this group.', te: 'ఈ వయసు వారికి లోపల ఉన్నవన్నీ పర్వాలేదు.' },
  c_doctor: {
    en: 'Check with a doctor or dietitian if the person has an allergy, a chronic condition or takes regular medicine.',
    te: 'అలర్జీ ఉన్నా, దీర్ఘకాల జబ్బు ఉన్నా, రోజూ మందులు వాడుతున్నా డాక్టర్ లేదా డైటీషియన్‌ని అడగండి.',
  },
  // Atlas · label decoder
  x_label: { en: 'Paste the ingredients list from a packet', te: 'ప్యాకెట్ మీద ఉన్న పదార్థాల లిస్ట్ ఇక్కడ పెట్టండి' },
  x_ph: { en: 'Ingredients: Sugar, wheat flour, palm oil, emulsifier (INS 322)…', te: 'ఉదా: చక్కెర, మైదా, పామాయిల్, ఉప్పు, emulsifier (INS 322)…' },
  x_try: { en: 'Try a sample label', te: 'ఒక శాంపిల్ లేబుల్ చూడండి' },
  x_clear: { en: 'Clear', te: 'తుడిచేయండి' },
  x_found: { en: '{n} found in the Atlas', te: 'అట్లాస్‌లో {n} దొరికాయి' },
  x_results: { en: 'Results', te: 'ఫలితాలు' },
  x_hint: {
    en: 'Names, E-numbers and INS codes are all recognised, such as “INS 471”, “E-951” or “(322)”.',
    te: 'పేర్లు, E-నంబర్లు, INS కోడ్‌లు అన్నీ గుర్తిస్తాం — “INS 471”, “E-951”, “(322)” లాగా. తెలుగులో కూడా రాయొచ్చు: చక్కెర, బెల్లం, మైదా…',
  },
  x_none: { en: 'Nothing recognised yet. Check the spelling, or search the name above.', te: 'ఇంకా ఏమీ గుర్తించలేదు. స్పెల్లింగ్ చూడండి, లేదా పైన పేరుతో వెతకండి.' },
  // Atlas · products
  p_filter_aria: { en: 'Filter products', te: 'ప్యాకెట్లను వడపోయండి' },
  p_all: { en: 'All', te: 'అన్నీ' },
  p_drink: { en: 'Drinks', te: 'డ్రింకులు' },
  p_snack: { en: 'Snacks & instant', te: 'స్నాక్స్, నూడుల్స్' },
  p_sweet: { en: 'Biscuits & sweets', te: 'బిస్కెట్లు, స్వీట్లు' },
  p_mix: { en: 'Mixes & sauces', te: 'పౌడర్లు, సాస్‌లు' },
  p_home: { en: 'Home-cooked', te: 'ఇంటి వంట' },
  p_sort: { en: 'Sort products', te: 'వరుస మార్చండి' },
  p_sort_sugar: { en: 'Most sugar first', te: 'ఎక్కువ చక్కెర ముందు' },
  p_sort_strict: { en: 'Strictest first', te: 'ఈ వయసుకి ఎక్కువ జాగ్రత్త ముందు' },
  p_sort_add: { en: 'Most additives first', te: 'ఎక్కువ అడిటివ్‌లు ముందు' },
  p_sort_az: { en: 'A to Z', te: 'పేరు వరుసలో' },
  p_count: { en: '{n} products · verdicts for {age}', te: '{n} ఉత్పత్తులు · {age} కోసం' },
  p_typical: { en: 'Typical pack', te: 'సాధారణ ప్యాకెట్' },
  p_check: { en: 'Check against pack', te: 'ప్యాకెట్‌తో సరిచూడాలి' },
  p_ings: { en: '{n} Atlas ingredients', te: '{n} పదార్థాలు' },
  p_tsp: { en: '{t} tsp sugar', te: '{t} చెంచాల చక్కెర' },
  p_per: { en: 'per {s}', te: 'ఒక్కసారికి: {s}' },
  p_add1: { en: '1 additive', te: '1 అడిటివ్' },
  p_adds: { en: '{n} additives', te: '{n} అడిటివ్‌లు' },
  p_aria: { en: '{name}: {verdict} for {age}. Open safety check', te: '{name}: {age} కోసం {verdict}. పూర్తి వివరాలు చూడండి' },
};

const TITLE_EN = document.title;
const TITLE_TE = 'తెలుగు సుగర్స్ | Telugu Sugars — ఆధారాలతో ఆహార సైన్స్';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('telugusugars_lang') as Language | null;
    if (saved === 'en' || saved === 'te') {
      setLanguageState(saved);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = language === 'te' ? TITLE_TE : TITLE_EN;
  }, [language]);

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

  // "{n} items" style placeholders are filled from vars
  const t = (key: string, vars?: Record<string, string | number>): string => {
    const entry = TRANSLATIONS[key];
    if (!entry) return key;
    const text = entry[language] || entry.en;
    return vars ? text.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m)) : text;
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
