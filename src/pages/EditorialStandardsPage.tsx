import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { InstagramLink, INSTAGRAM_HANDLE } from '../components/common/InstagramLink';

const COPY = {
  en: {
    kicker: 'Our standards',
    title: 'How we work',
    lead: 'The rules we follow when we read labels, check research and make videos. If you see us break one, tell us.',
    coiTitle: 'Who pays us',
    coiIntro: 'Nobody in the food business. We do not take ads, sponsorships, gifts or money from:',
    coiList: [
      'Companies that make packaged food, snacks or sweets',
      'Big jaggery, palm sugar or cane sugar businesses',
      'Companies that make artificial sweeteners',
      'Supplement companies and MLM "wellness" brands',
    ],
    coiOutro: 'Our scripts, videos and this website are made by our own small team. Some videos have affiliate links, and they are always marked "Affiliate".',
    peerTitle: 'What we count as evidence',
    peerIntro: 'Not every study is equally strong. We lean on the strongest kind we can find:',
    tiers: [
      ['Strongest', 'Reviews that pool many studies in people, and well-run trials where people are split into groups at random.'],
      ['Useful, with care', 'Studies that follow large groups of people for years. They show a link, not proof, and we say so.'],
      ['Early clues', 'Lab tests on cells or animals. Interesting, but we always say it has not been shown in people yet.'],
      ['Not evidence', 'Personal stories, company press releases, and "our elders always said so" with nothing to back it up.'],
    ],
    fixTitle: 'When we get something wrong',
    fixIntro: 'It will happen. When a fact is wrong or a study is out of date:',
    fixList: [
      'We fix it openly, not quietly.',
      'We add a dated note at the top saying what changed and why.',
    ],
    fixMail: 'Spotted a mistake? Message us on Instagram:',
    safeTitle: 'What we will not do',
    safeIntro: 'To stay useful and not scary, we keep away from:',
    safeList: [
      '"Poison" or "danger" scores that make people afraid of food without good reason.',
      "Diet or medicine advice for one particular person. That is your doctor's job.",
      'Publishing health claims, or AI-written text, that nobody on our team has checked.',
    ],
  },
  te: {
    kicker: 'మా నియమాలు',
    title: 'మేము ఎలా పని చేస్తాం',
    lead: 'లేబుల్ చదివేటప్పుడు, పరిశోధనలు చూసేటప్పుడు, వీడియో చేసేటప్పుడు మేము పాటించే నియమాలు ఇవి. ఏదైనా తప్పితే మాకు చెప్పండి.',
    coiTitle: 'మాకు డబ్బు ఎవరిస్తారు?',
    coiIntro: 'ఫుడ్ బిజినెస్‌లో ఎవరూ ఇవ్వరు. వీళ్ళ నుంచి మేము ప్రకటనలు, స్పాన్సర్‌షిప్‌లు, బహుమతులు, డబ్బు ఏవీ తీసుకోం:',
    coiList: [
      'ప్యాకెట్ ఆహారం, స్నాక్స్, స్వీట్లు తయారు చేసే కంపెనీలు',
      'బెల్లం, తాటి బెల్లం, చెరకు ప్రాసెసింగ్ చేసే పెద్ద వ్యాపార సంస్థలు',
      'కృత్రిమ స్వీటెనర్లు తయారు చేసే కంపెనీలు',
      'సప్లిమెంట్ కంపెనీలు, మల్టీ-లెవల్ మార్కెటింగ్ (MLM) వెల్‌నెస్ బ్రాండ్లు',
    ],
    coiOutro: 'మా స్క్రిప్ట్‌లు, వీడియోలు, ఈ వెబ్‌సైట్ అన్నీ మా చిన్న టీమే చేస్తుంది. కొన్ని వీడియోల్లో అఫిలియేట్ లింకులు ఉంటాయి. వాటి పక్కన ఎప్పుడూ "అఫిలియేట్" అని రాసి ఉంటుంది.',
    peerTitle: 'ఏది ఆధారంగా తీసుకుంటాం',
    peerIntro: 'అన్ని పరిశోధనలూ ఒకేలా బలమైనవి కావు. దొరికినంతలో బలమైనవాటినే నమ్ముతాం:',
    tiers: [
      ['చాలా బలమైనవి', 'మనుషుల మీద చేసిన చాలా పరిశోధనలను కలిపి చూసే రివ్యూలు. ప్రజలను గ్రూపులుగా విడదీసి సరిగ్గా చేసిన ట్రయల్స్.'],
      ['పనికొస్తాయి, జాగ్రత్తగా', 'ఏళ్ల తరబడి చాలా మందిని గమనించిన పరిశోధనలు. ఇవి సంబంధం చూపిస్తాయి, రుజువు కాదు. ఆ మాట మేము చెబుతాం.'],
      ['మొదటి సూచనలు', 'కణాలు, జంతువుల మీద ల్యాబ్ పరీక్షలు. ఆసక్తికరమే, కానీ మనుషుల్లో ఇంకా రుజువు కాలేదని ఎప్పుడూ చెబుతాం.'],
      ['ఆధారం కాదు', 'సొంత అనుభవాలు, కంపెనీ ప్రెస్ రిలీజ్‌లు, ఏ ఆధారం లేకుండా "మా పెద్దవాళ్ళు చెప్పారు" అనే మాటలు.'],
    ],
    fixTitle: 'మేము తప్పు చేస్తే',
    fixIntro: 'తప్పులు జరుగుతాయి. ఏదైనా విషయం తప్పుగా ఉన్నా, పరిశోధన పాతబడినా:',
    fixList: [
      'రహస్యంగా కాకుండా, అందరికీ తెలిసేలా సరిచేస్తాం.',
      'పైభాగంలో తేదీతో ఒక నోట్ పెడతాం: ఏం మారింది, ఎందుకు మారింది.',
    ],
    fixMail: 'తప్పు కనిపించిందా? ఇన్‌స్టాగ్రామ్‌లో మెసేజ్ చేయండి:',
    safeTitle: 'మేము చేయనివి',
    safeIntro: 'భయపెట్టకుండా, ఉపయోగపడేలా ఉండటానికి వీటికి దూరంగా ఉంటాం:',
    safeList: [
      'సరైన కారణం లేకుండా ఆహారం అంటే భయం పుట్టించే "విషం", "ప్రమాదం" స్కోర్లు.',
      'ఒక్క మనిషికి ప్రత్యేకంగా డైట్ లేదా మందుల సలహా. అది మీ డాక్టర్ పని.',
      'మా టీమ్‌లో ఎవరూ సరిచూడని ఆరోగ్య వాదనలు గానీ, AI రాసిన మాటలు గానీ పెట్టడం.',
    ],
  },
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="flex flex-col gap-3 border-t border-white/10 pt-8 text-base leading-relaxed text-slate-300">
    <h2 className="text-2xl font-bold text-white">{title}</h2>
    {children}
  </section>
);

export const EditorialStandardsPage: React.FC = () => {
  const { language } = useLanguage();
  const c = COPY[language];

  return (
    // .container beats Tailwind's max-w-*, so the reading width lives on an inner wrapper
    <div className="container py-12 pb-24 sm:py-16">
      <div className="mx-auto flex max-w-3xl flex-col gap-10">
      <header>
        <p className="text-sm font-semibold text-amber-400">{c.kicker}</p>
        <h1 className="mt-2 text-[clamp(2.25rem,9vw,3.75rem)] font-extrabold leading-tight text-white">{c.title}</h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-300">{c.lead}</p>
      </header>

      <Section title={c.coiTitle}>
        <p>{c.coiIntro}</p>
        <ul className="flex list-disc flex-col gap-1.5 pl-5 text-slate-400">
          {c.coiList.map((x) => <li key={x}>{x}</li>)}
        </ul>
        <p>{c.coiOutro}</p>
      </Section>

      <Section title={c.peerTitle}>
        <p>{c.peerIntro}</p>
        <dl className="flex flex-col gap-4 pt-1">
          {c.tiers.map(([title, body]) => (
            <div key={title} className="border-l-2 border-amber-500/60 pl-4">
              <dt className="font-bold text-white">{title}</dt>
              <dd className="text-slate-400">{body}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section title={c.fixTitle}>
        <p>{c.fixIntro}</p>
        <ul className="flex list-disc flex-col gap-1.5 pl-5 text-slate-400">
          {c.fixList.map((x) => <li key={x}>{x}</li>)}
        </ul>
        <p>
          {c.fixMail}{' '}
          <InstagramLink className="font-semibold text-amber-400 underline underline-offset-4">@{INSTAGRAM_HANDLE}</InstagramLink>
        </p>
      </Section>

      <Section title={c.safeTitle}>
        <p>{c.safeIntro}</p>
        <ul className="flex list-disc flex-col gap-1.5 pl-5 text-slate-400">
          {c.safeList.map((x) => <li key={x}>{x}</li>)}
        </ul>
      </Section>
      </div>
    </div>
  );
};

export default EditorialStandardsPage;
