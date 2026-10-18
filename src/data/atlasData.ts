// Ingredient Atlas data, ported verbatim from the atlas prototype (resources/ingredient atlas.html).
export type Level = "ok" | "limit" | "care" | "avoid";
export type GroupId = "inf" | "youth" | "mid" | "old";
export type Rating = [Level, string];
export interface AgeGroup { id: GroupId; name: string; age: string }
export interface Category { id: string; name: string }
export interface Concern { id: string; name: string; d: string }
export interface Ingredient { id: string; name: string; cat: string; alt?: string[]; tags: string[]; r: Record<GroupId, Rating> }
export type Shelf = 'drink' | 'snack' | 'sweet' | 'mix' | 'home';
export type PackShape = 'can' | 'slimcan' | 'pouch' | 'biscuit' | 'bar' | 'jar' | 'bottle' | 'tub' | 'loaf' | 'bowl' | 'mug' | 'plate';
/** Brand, serving and sugar (g per serving) are abridged from Indian packs; recipes change, so cards say "check against pack". */
export interface Dish {
  id: string; name: string; ing: string[]; pack?: boolean;
  shelf: Shelf; serving: string; sugar: number; brand?: string; art: [PackShape, string, string?];
}

export const LV: Record<Level, { t: string; o: number }> = { ok: { t: "Suitable", o: 0 }, limit: { t: "Limit", o: 1 }, care: { t: "Check first", o: 2 }, avoid: { t: "Avoid", o: 3 } };
export const LVK: Level[] = ["ok", "limit", "care", "avoid"];
const OK: Level = "ok", LIM: Level = "limit", CARE: Level = "care", AVD: Level = "avoid";

export const GR: AgeGroup[] = [
  {id:'inf',name:'Infants',age:'0–12 months'},
  {id:'youth',name:'Youth',age:'1–29 years'},
  {id:'mid',name:'Middle-aged',age:'30–59 years'},
  {id:'old',name:'Older adults',age:'60+ years'}
];
export const CATS: Category[] = [
  {id:'sweet',name:'Sugars and sweeteners'},
  {id:'starch',name:'Starches, thickeners and fibres'},
  {id:'emul',name:'Emulsifiers'},
  {id:'pres',name:'Preservatives and antioxidants'},
  {id:'colour',name:'Colours'},
  {id:'flav',name:'Flavour enhancers and salt'},
  {id:'acid',name:'Acids, minerals and flour improvers'},
  {id:'fat',name:'Fats and oils'},
  {id:'nut',name:'Nuts, seeds and soy'},
  {id:'dairy',name:'Dairy and eggs'},
  {id:'grain',name:'Grains and millets'},
  {id:'spice',name:'Spices and herbs'},
  {id:'produce',name:'Fruit and vegetables'},
  {id:'protein',name:'Protein foods'},
  {id:'drink',name:'Drinks'}
];
export const CATNAME: Record<string, string> = Object.fromEntries(CATS.map((c) => [c.id, c.name]));

export const CON: Concern[] = [
  {id:'c-sugar',name:'Sugar load',d:'Free sugars come from sugar, honey, jaggery, syrups and sweet drinks. WHO advises keeping them under 10% of daily energy, and giving none to babies.'},
  {id:'c-glycemic',name:'Blood sugar spike',d:'Fast-digesting carbohydrates raise blood glucose quickly. This matters most for people with diabetes or prediabetes, and such foods often add little else.'},
  {id:'c-nss',name:'Non-sugar sweeteners',d:'Stevia, aspartame, sucralose and similar. In 2023 the WHO advised against using them to control body weight, and flagged possible long-term risks of type 2 diabetes and heart disease. The advice excludes people who already have diabetes.'},
  {id:'c-sodium',name:'Salt and sodium',d:'Salt raises blood pressure over time. WHO suggests adults stay under 5 g a day, and babies need no added salt.'},
  {id:'c-kidney',name:'Kidney strain',d:'High salt, potassium, added phosphate and large amounts of protein supplements make the kidneys work harder. People with kidney disease need personal advice.'},
  {id:'c-allergen',name:'Allergen',d:'These foods commonly trigger allergic reactions. Careful early introduction is often advised for infants. Ask a paediatrician first if there is eczema or a family history of allergy.'},
  {id:'c-additive',name:'Additive reaction',d:'Some people react to certain additives with hives, wheeze or restlessness. A 2007 UK trial linked a mix of six synthetic colours plus sodium benzoate to more hyperactive behaviour in some children. Effects were small and varied by child.'},
  {id:'c-gut',name:'Gut and digestion',d:'Bloating, loose stools, or open questions about gut bacteria. Sugar alcohols act as laxatives. Some emulsifiers and thickeners changed gut bacteria in animal studies and small human trials.'},
  {id:'c-choking',name:'Choking hazard',d:'Hard, round, sticky or gel foods can block a small airway. Change the shape or texture for children under 5, and take care with older adults who have swallowing problems.'},
  {id:'c-interaction',name:'Medicine interaction',d:'Some foods change how medicines work. This matters most for people on blood thinners, statins, diabetes or blood pressure drugs.'},
  {id:'c-foodsafety',name:'Food safety',d:'Raw or unpasteurised foods carry a higher risk of food poisoning, and infants and older adults are hit hardest. Honey is a special case because of infant botulism.'},
  {id:'c-caffeine',name:'Caffeine',d:'A stimulant found in tea, coffee, cola and energy drinks. It disturbs sleep and raises heart rate, and young children should avoid it.'},
  {id:'c-metals',name:'Heavy metals',d:'Mercury in large predatory fish, arsenic in rice, and lead or cadmium in some supplements can harm the nervous system, especially in young children.'},
  {id:'c-fat',name:'Fat quality',d:'Industrial trans fat and oil reheated many times raise heart disease risk. Keep saturated fat modest.'},
  {id:'c-cancer',name:'Cancer-risk listing',d:'The IARC ranks how strong the evidence is that something can cause cancer, not how much risk a normal serving carries. Group 1 means strong evidence, group 2B means possible.'},
  {id:'c-restricted',name:'Banned or restricted',d:'Rules differ by country. These are banned or limited in at least one major market such as the EU, UK, India or Canada. Check the rules where you sell.'}
];


function R(l: Level, n: string): Rating { return [l, n]; }
export const ING = <Ingredient[]>[
 {id:'honey',name:'Honey',tags:['c-sugar','c-foodsafety'],
  r:{inf:R('avoid','Can carry spores that cause infant botulism. No honey under 12 months, including cooked or baked.'),
     youth:R('ok','Fine after 12 months in small amounts. It still counts as a free sugar.'),
     mid:R('limit','Counts as free sugar. Keep it to a teaspoon or two if you watch weight or blood sugar.'),
     old:R('limit','Same as for middle-aged adults. People with diabetes should count it as sugar.')}},
 {id:'salt',name:'Salt',alt:['sodium chloride','namak','table salt','rock salt','sendha'],tags:['c-sodium'],
  r:{inf:R('avoid','Do not add salt. Infants should get under 1 g of salt a day in total, which milk and food already supply.'),
     youth:R('limit','Children need less than adults. Go easy on packaged snacks, pickles and papad.'),
     mid:R('limit','WHO advises under 5 g of salt a day. Pickles, chips and instant noodles add up fast.'),
     old:R('care','Blood pressure and kidney problems are common. Stay under 5 g a day, and ask a doctor if you take BP medicine or diuretics.')}},
 {id:'sugar',name:'Sugar',alt:['sucrose','cheeni','brown sugar','coconut sugar','cane sugar','white sugar'],tags:['c-sugar'],
  r:{inf:R('avoid','No added sugar under 12 months. Taste preferences form early, so skip it.'),
     youth:R('limit','WHO advises free sugars under 10% of daily energy, and under 5% is better. Sweet drinks are the biggest source.'),
     mid:R('limit','Same 10% ceiling. Tighter if you have diabetes or prediabetes.'),
     old:R('limit','Same ceiling. People with diabetes should follow their care plan.')}},
 {id:'jaggery',name:'Jaggery',alt:['gur','gud','panela'],tags:['c-sugar'],
  r:{inf:R('avoid','Still a sugar. Do not add it to infant food.'),
     youth:R('limit','Trace minerals do not change its effect on blood sugar. Count it as sugar.'),
     mid:R('limit','Count it as sugar. Fine in small amounts.'),
     old:R('limit','Count it as sugar, especially with diabetes.')}},
 {id:'sweetener',name:'Artificial sweeteners (general)',alt:['sweetener','diet sweetener','sugar free','zero sugar','sugar substitute'],tags:['c-nss'],
  r:{inf:R('avoid','Not for infants.'),
     youth:R('limit','Normal use stays within safe daily limits, but children do not need it. WHO advises against relying on sweeteners for weight control.'),
     mid:R('limit','Not a weight-control tool according to WHO. People with phenylketonuria must avoid aspartame.'),
     old:R('limit','Keep it modest. People with phenylketonuria must avoid aspartame.')}},
 {id:'peanut',name:'Peanut',alt:['groundnut','moongphali','peanut butter'],tags:['c-allergen','c-choking'],
  r:{inf:R('care','Allergen. Current guidance often favours smooth peanut paste thinned with water from about 6 months. Ask a paediatrician first if the baby has eczema or egg allergy.'),
     youth:R('care','The most common trigger of severe allergic reactions. Whole peanuts are a choking hazard under 5.'),
     mid:R('ok','Suitable unless you are allergic.'),
     old:R('ok','Suitable unless allergic. Use paste or crushed peanuts if chewing is hard.')}},
 {id:'nuts',name:'Tree nuts',alt:['almond','badam','cashew','kaju','walnut','akhrot','pistachio','pista','hazelnut'],tags:['c-allergen','c-choking'],
  r:{inf:R('care','Allergen and choking hazard. Offer only as fine powder or smooth paste, never whole or in pieces.'),
     youth:R('care','Allergen. Whole nuts are a choking hazard under 5.'),
     mid:R('ok','Suitable unless you are allergic.'),
     old:R('ok','Suitable unless allergic. Chop or grind if chewing is hard.')}},
 {id:'sesame',name:'Sesame',alt:['til','tahini'],tags:['c-allergen','c-choking'],
  r:{inf:R('care','Common allergen. Introduce ground sesame or tahini in tiny amounts and watch for a reaction.'),
     youth:R('ok','Suitable unless allergic. Check labels.'),
     mid:R('ok','Suitable unless allergic.'),
     old:R('ok','Suitable unless allergic.')}},
 {id:'milk',name:'Cow’s milk',alt:['milk','doodh','dairy'],tags:['c-allergen'],
  r:{inf:R('care','Not as a drink before 12 months. Small amounts cooked into food from about 6 months are fine. Breast milk or formula stays the main drink.'),
     youth:R('ok','Suitable unless allergic or lactose intolerant.'),
     mid:R('ok','Suitable. Choose toned or low-fat milk if you watch cholesterol.'),
     old:R('ok','Good source of calcium. Lactose intolerance is more common with age, so curd or lactose-free milk can help.')}},
 {id:'egg',name:'Egg',alt:['anda','eggs'],tags:['c-allergen','c-foodsafety'],
  r:{inf:R('care','Introduce well-cooked egg from about 6 months in small amounts. Egg allergy is common. No runny yolk.'),
     youth:R('ok','Suitable unless allergic. Cook until firm.'),
     mid:R('ok','Suitable. Ask your doctor about a limit if cholesterol is high.'),
     old:R('ok','Soft and easy to eat. Cook until firm.')}},
 {id:'curd',name:'Curd',alt:['dahi','yogurt','yoghurt','raita'],tags:['c-allergen'],
  r:{inf:R('ok','Plain, unsweetened curd from about 6 months. No sugar or honey added.'),
     youth:R('ok','Suitable unless allergic to milk.'),
     mid:R('ok','Suitable.'),
     old:R('ok','Soft and easy to eat.')}},
 {id:'wheat',name:'Wheat',alt:['atta','gluten','roti','chapati','whole wheat','gehun'],tags:['c-allergen'],
  r:{inf:R('ok','Fine from about 6 months as soft cooked foods. Watch for a reaction.'),
     youth:R('ok','Suitable. People with coeliac disease must avoid it.'),
     mid:R('ok','Suitable. People with coeliac disease must avoid it.'),
     old:R('ok','Suitable. People with coeliac disease must avoid it.')}},
 {id:'turmeric',name:'Turmeric',alt:['haldi','curcumin'],tags:['c-interaction'],
  r:{inf:R('ok','A pinch in cooked food is fine from about 6 months.'),
     youth:R('ok','Food amounts are fine.'),
     mid:R('ok','Food amounts are fine. Concentrated supplements are a different matter, so ask a doctor.'),
     old:R('care','Food amounts are fine. Concentrated supplements can interact with blood thinners, so ask your doctor first.')}},
 {id:'ginger',name:'Ginger',alt:['adrak','sonth'],tags:['c-interaction'],
  r:{inf:R('limit','A tiny amount in cooked food is fine. Skip concentrated forms such as juice or shots.'),
     youth:R('ok','Food amounts are fine.'),
     mid:R('ok','Food amounts are fine.'),
     old:R('care','Food amounts are fine. Large amounts may add to the effect of blood thinners.')}},
 {id:'spinach',name:'Spinach',alt:['palak','leafy greens','greens'],tags:['c-interaction'],
  r:{inf:R('ok','Well cooked and pureed or finely chopped, from about 6 months.'),
     youth:R('ok','Suitable.'),
     mid:R('ok','Suitable.'),
     old:R('care','Rich in vitamin K. If you take warfarin, keep your intake steady and tell your doctor.')}},
 {id:'grapefruit',name:'Grapefruit',alt:['pomelo','chakotra'],tags:['c-interaction'],
  r:{inf:R('limit','Acidic. Offer other fruit first, and no juice.'),
     youth:R('ok','Suitable in normal amounts.'),
     mid:R('care','Interacts with several medicines, including some statins and blood pressure drugs. Check with your pharmacist.'),
     old:R('care','Interacts with several medicines, including some statins and blood pressure drugs. Check with your pharmacist.')}},
 {id:'tea',name:'Tea and coffee',alt:['chai','coffee','green tea','matcha'],tags:['c-caffeine'],
  r:{inf:R('avoid','Contains caffeine and compounds that block iron absorption. Not for infants.'),
     youth:R('limit','Best avoided in young children. For teens, keep it small and skip energy drinks.'),
     mid:R('ok','Up to about 400 mg of caffeine a day is considered fine for healthy adults. A cup of tea or coffee holds well under a quarter of that.'),
     old:R('limit','Caffeine can disturb sleep and raise heart rate. Keep it modest and not close to bedtime.')}},
 {id:'ragi',name:'Ragi',alt:['finger millet','nachni','mandua'],tags:[],
  r:{inf:R('ok','A traditional first food. Serve as a smooth, well-cooked porridge from about 6 months, without sugar or salt.'),
     youth:R('ok','Suitable. A good source of calcium and fibre.'),
     mid:R('ok','Suitable. It is high in oxalate, so people with kidney stones should ask their doctor.'),
     old:R('ok','Soft porridge is easy to eat. Same oxalate note for kidney stones.')}},
 {id:'chili',name:'Chilli',alt:['mirch','chili','chilly','capsicum','red chilli powder','hot spice'],tags:[],
  r:{inf:R('avoid','Hot spice irritates the mouth and gut. Mild spices such as cumin and coriander are fine.'),
     youth:R('limit','Build up slowly. Many young children dislike heat.'),
     mid:R('ok','Suitable. Cut back if you get reflux or gastritis.'),
     old:R('care','Reflux and gastritis are more common. Reduce it if you get symptoms.')}},
 {id:'grapes',name:'Grapes',alt:['angoor','cherry tomato','round fruit'],tags:['c-choking'],
  r:{inf:R('care','Choking hazard. Never serve whole. Quarter lengthwise.'),
     youth:R('care','Quarter lengthwise for under 5. Fine whole after that.'),
     mid:R('ok','Suitable.'),
     old:R('ok','Suitable. Count the sugar if you have diabetes.')}},
 {id:'sprouts',name:'Raw sprouts',alt:['sprouts','moong sprouts','bean sprouts','alfalfa'],tags:['c-foodsafety'],
  r:{inf:R('avoid','Raw sprouts can carry bacteria. Always cook them thoroughly for infants.'),
     youth:R('care','Cook until steaming hot, or buy from a reliable source.'),
     mid:R('care','Cook them, or wash well and eat fresh.'),
     old:R('avoid','Higher risk of severe food poisoning. Cook thoroughly.')}},
 {id:'fish',name:'High-mercury fish',alt:['shark','swordfish','king mackerel','tuna','mercury'],tags:['c-metals'],
  r:{inf:R('avoid','Shark, swordfish and king mackerel are not for infants.'),
     youth:R('limit','Children should avoid it. Older teens and young adults should eat it rarely.'),
     mid:R('limit','Eat rarely. Pregnant women should avoid it.'),
     old:R('limit','Eat rarely. Smaller fish such as sardines are a better choice.')}},
 {id:'ghee',name:'Ghee',alt:['clarified butter','desi ghee'],tags:['c-fat','c-allergen'],
  r:{inf:R('ok','A small amount in cooked food from about 6 months.'),
     youth:R('ok','Suitable in moderation.'),
     mid:R('limit','High in saturated fat. Keep it modest.'),
     old:R('limit','High in saturated fat. Keep it small if you have heart disease or high cholesterol.')}},
 {id:'fried',name:'Deep-fried food',alt:['pakora','samosa','fries','fried snacks','reheated oil','bhujia','namkeen'],tags:['c-fat'],
  r:{inf:R('avoid','Too heavy and often too salty.'),
     youth:R('limit','Occasional only. Avoid oil that has been reheated many times.'),
     mid:R('limit','Reheated oil and trans fat raise heart disease risk. Keep it occasional.'),
     old:R('limit','Reheated oil and trans fat raise heart disease risk. Keep it occasional.')}}
];
const CAT0: Record<string, string> = {honey:'sweet',salt:'flav',sugar:'sweet',jaggery:'sweet',sweetener:'sweet',peanut:'nut',nuts:'nut',sesame:'nut',milk:'dairy',egg:'dairy',curd:'dairy',wheat:'grain',turmeric:'spice',ginger:'spice',spinach:'produce',grapefruit:'produce',tea:'drink',ragi:'grain',chili:'spice',grapes:'produce',sprouts:'produce',fish:'protein',ghee:'fat',fried:'fat'};
ING.forEach((i) => { i.cat = CAT0[i.id] || "other"; });

function A(id: string, name: string, cat: string, alt: string[], tags: string[], inf: Rating, youth: Rating, mid: Rating, old: Rating) {
  ING.push({ id, name, cat, alt, tags, r: { inf, youth, mid, old } });
}

/* ---- sugars and sweeteners ---- */
A('maltodextrin','Maltodextrin','sweet',['maltodextrin','glucose polymer','corn starch hydrolysate','dextrin','filler','drink mix'],['c-glycemic','c-sugar'],
 R(CARE,'Appears in some infant formulas and cereals under strict rules. Do not add it to home-made food.'),
 R(LIM,'A filler in snacks, drink mixes and sports drinks. It raises blood sugar even faster than table sugar and adds no nutrients.'),
 R(LIM,'Glycaemic index is roughly 85 to 105, against about 65 for table sugar. People with diabetes should count it as fast carbohydrate.'),
 R(LIM,'Same fast blood sugar rise. Watch for it in sweetener sachets, powdered drinks and supplements if you have diabetes.'));
A('glucosesyrup','Glucose syrup and HFCS','sweet',['glucose syrup','corn syrup','high fructose corn syrup','hfcs','glucose-fructose syrup','fructose syrup','liquid glucose'],['c-sugar','c-glycemic'],
 R(AVD,'A free sugar. None before 12 months.'),
 R(LIM,'Free sugar in sweets, cold drinks and bakery fillings. It counts toward the WHO limit of 10% of daily energy.'),
 R(LIM,'Free sugar. Large amounts from sweet drinks are linked to weight gain and fatty liver.'),
 R(LIM,'Free sugar. Count it if you have diabetes.'));
A('dextrose','Dextrose (glucose)','sweet',['dextrose','glucose','d-glucose','glucose powder'],['c-sugar','c-glycemic'],
 R(AVD,'No added sugar under 12 months.'),
 R(LIM,'Pure glucose, absorbed very quickly. It counts as a free sugar.'),
 R(LIM,'Raises blood sugar fast. Useful for treating a low, but not a routine ingredient if you have diabetes.'),
 R(LIM,'Same fast rise. Keep it for treating a low rather than daily use if you have diabetes.'));
A('stevia','Stevia and monk fruit (E960)','sweet',['stevia','steviol glycosides','e960','monk fruit','luo han guo','rebaudioside','reb a'],['c-nss'],
 R(AVD,'Not for infants.'),
 R(LIM,'Safe within the acceptable intake of 4 mg per kg of body weight. Children do not need it, and WHO advises against sweeteners for weight control.'),
 R(LIM,'Safe within the acceptable intake. WHO advises against using it for weight control. People with diabetes may use it in place of sugar.'),
 R(LIM,'Safe within the acceptable intake. People with diabetes may use it in place of sugar.'));
A('aspartame','Aspartame (E951)','sweet',['aspartame','e951','diet soda sweetener'],['c-nss','c-cancer'],
 R(AVD,'Not for infants. Anyone with phenylketonuria must avoid it.'),
 R(LIM,'Acceptable intake is 40 mg per kg. Children do not need it, and people with phenylketonuria must avoid it.'),
 R(LIM,'The IARC listed it as possibly carcinogenic (group 2B) in 2023, while JECFA kept the 40 mg per kg limit. A diet soda is well under that.'),
 R(LIM,'Same limit. Avoid with phenylketonuria.'));
A('sucralose','Sucralose (E955)','sweet',['sucralose','e955'],['c-nss'],
 R(AVD,'Not for infants.'),
 R(LIM,'Acceptable intake is 15 mg per kg. Children do not need it.'),
 R(LIM,'Considered safe within the limit. Some lab work suggests unwanted compounds can form at very high cooking heat, so avoid long baking with it.'),
 R(LIM,'Considered safe within the limit.'));
A('acesulfame','Acesulfame K (E950)','sweet',['acesulfame','acesulfame potassium','ace-k','e950'],['c-nss'],
 R(AVD,'Not for infants.'),
 R(LIM,'Acceptable intake is 15 mg per kg. Often blended with other sweeteners in diet drinks.'),
 R(LIM,'Considered safe within the limit. WHO advises against using sweeteners for weight control.'),
 R(LIM,'Considered safe within the limit.'));
A('saccharin','Saccharin (E954)','sweet',['saccharin','e954'],['c-nss'],
 R(AVD,'Not for infants.'),
 R(LIM,'Old rat studies linking it to bladder cancer do not apply to people, and it is no longer listed as a carcinogen. Children do not need it.'),
 R(LIM,'Considered safe within the limit.'),
 R(LIM,'Considered safe within the limit.'));
A('polyols','Sugar alcohols (sorbitol, xylitol, maltitol)','sweet',['sorbitol','e420','xylitol','e967','maltitol','e965','mannitol','e421','polyols','sugar alcohol','sugar free sweets'],['c-gut'],
 R(AVD,'Can cause diarrhoea and cramps. Not for infants.'),
 R(LIM,'More than a small portion causes gas, cramps and loose stools, and children react to less. Sugar-free sweets are the usual source.'),
 R(LIM,'Same laxative effect. They raise blood sugar less than sugar does, but are not free of calories.'),
 R(LIM,'Same laxative effect, which can dehydrate frail people.'));
A('erythritol','Erythritol (E968)','sweet',['erythritol','e968','zero sugar sweetener'],['c-gut'],
 R(AVD,'Not for infants.'),
 R(LIM,'Gentler on the gut than other sugar alcohols. A 2023 study linked high blood levels to clotting and heart events in people at risk, so daily use is best avoided.'),
 R(CARE,'The 2023 study involved adults with heart disease or risk factors. The evidence is early, but ask your doctor before daily use.'),
 R(CARE,'Ask your doctor before daily use if you have heart disease, diabetes or high cholesterol. The evidence is early.'));

/* ---- starches, thickeners and fibres ---- */
A('modstarch','Modified starch (E1404 to E1452)','starch',['modified starch','e1404','e1412','e1414','e1422','e1442','e1450','starch','thickener'],['c-glycemic'],
 R(CARE,'Used in some commercial baby cereals and jars within strict limits. Not needed in home-made food.'),
 R(OK,'Approved types are considered safe. It thickens sauces, ketchup and instant mixes.'),
 R(OK,'Digests like ordinary starch, so it counts as carbohydrate.'),
 R(OK,'Digests like ordinary starch, so it counts as carbohydrate.'));
A('xanthan','Xanthan gum (E415)','starch',['xanthan','xanthan gum','e415','thickener','gum'],['c-gut'],
 R(AVD,'Not for infant feeds unless a paediatrician prescribes it. Thickeners have been linked to serious gut injury in premature babies.'),
 R(OK,'Approved and common in sauces, dressings and gluten-free baking.'),
 R(OK,'Large amounts can cause gas or loose stools.'),
 R(OK,'Thickeners prescribed for swallowing problems should be used only as directed.'));
A('guar','Guar gum (E412)','starch',['guar','guar gum','e412','thickener'],['c-gut'],
 R(CARE,'Not for infant feeds unless a paediatrician prescribes it.'),
 R(OK,'Approved. Used in ice cream, sauces and gluten-free baking.'),
 R(OK,'Soluble fibre that slows sugar absorption. Large amounts cause gas.'),
 R(OK,'Large amounts cause gas. Drink fluids with high-fibre foods.'));
A('carrageenan','Carrageenan (E407)','starch',['carrageenan','e407','seaweed thickener'],['c-gut'],
 R(CARE,'Allowed in some formulas in limited amounts. Do not add it to home food.'),
 R(OK,'Regulators consider approved levels safe. It is debated, and people with irritable bowel may notice bloating.'),
 R(OK,'Regulators consider approved levels safe. People with irritable bowel may notice bloating.'),
 R(OK,'Regulators consider approved levels safe.'));
A('pectin','Pectin (E440)','starch',['pectin','e440','jam setting'],[],
 R(OK,'Natural fruit fibre. Fine in unsweetened fruit puree.'),
 R(OK,'Natural fruit fibre. Jams still carry the added sugar.'),
 R(OK,'Natural fruit fibre.'),
 R(OK,'Natural fruit fibre.'));
A('agar','Agar-agar (E406)','starch',['agar','agar-agar','e406','china grass'],[],
 R(OK,'Plant-based gelling agent. Fine in soft, smooth foods.'),
 R(OK,'Plant-based gelling agent and a vegetarian substitute for gelatin.'),
 R(OK,'Plant-based gelling agent.'),
 R(OK,'Plant-based gelling agent.'));
A('gelatin','Gelatin (E441)','starch',['gelatin','gelatine','e441','jelly','gummy'],['c-choking'],
 R(OK,'Fine melted into puree. Not vegetarian, and not halal or kosher unless certified.'),
 R(CARE,'Firm gummies and jelly cubes are a choking risk under 5. Not vegetarian.'),
 R(OK,'Not vegetarian, and not halal or kosher unless certified.'),
 R(OK,'Soft jelly is easy to swallow. Not vegetarian.'));
A('konjac','Konjac jelly cups','starch',['konjac','konjac jelly','mini fruit jelly cups','e425','glucomannan','mini jelly'],['c-choking','c-restricted'],
 R(AVD,'Do not give. Mini jelly cups made with konjac have caused choking deaths in children and older adults. The EU banned them.'),
 R(AVD,'Same choking risk, especially under 5.'),
 R(CARE,'Chew well and never squeeze into the mouth.'),
 R(CARE,'Older people are also at risk. Chew well and never squeeze into the mouth.'));
A('inulin','Added fibres (inulin, chicory root)','starch',['inulin','chicory root','chicory root fibre','fos','prebiotic fibre','oligofructose','added fibre','polydextrose'],['c-gut'],
 R(CARE,'Some infant formulas add prebiotic fibres on purpose. Do not add them yourself.'),
 R(OK,'Feeds gut bacteria. Large amounts cause gas and bloating.'),
 R(OK,'Large amounts cause gas and bloating. People with irritable bowel may want to limit it.'),
 R(OK,'Large amounts cause gas and bloating. Start small.'));

/* ---- emulsifiers ---- */
A('lecithin','Lecithin (E322)','emul',['lecithin','soy lecithin','sunflower lecithin','e322'],['c-allergen'],
 R(OK,'Fine in tiny amounts. Soy lecithin carries very little soy protein.'),
 R(OK,'Fine. Check the label if there is a soy allergy.'),
 R(OK,'Fine.'),
 R(OK,'Fine.'));
A('monodi','Mono- and diglycerides (E471)','emul',['mono and diglycerides','e471','mono-diglycerides','emulsifier 471','e472'],['c-fat'],
 R(OK,'Allowed in infant formula and baby foods within limits. Not needed in home-made food.'),
 R(OK,'Digested like other fats. Common in bread, ice cream and spreads.'),
 R(OK,'Digested like other fats. Common in bread, ice cream and spreads.'),
 R(OK,'Digested like other fats.'));
A('polysorbate','Polysorbate 80 (E433)','emul',['polysorbate 80','polysorbate','e433','tween 80'],['c-gut'],
 R(AVD,'Not for infants.'),
 R(LIM,'Animal and lab studies suggest it can disturb gut bacteria. Regulators consider approved levels safe.'),
 R(LIM,'Animal and lab studies suggest it can disturb gut bacteria. Regulators consider approved levels safe.'),
 R(LIM,'Same note. Approved levels are considered safe.'));
A('cmc','Carboxymethyl cellulose (E466)','emul',['cmc','carboxymethyl cellulose','cellulose gum','e466'],['c-gut'],
 R(CARE,'Not for infants except in prescribed medical foods.'),
 R(LIM,'Mouse studies and one small human trial found changes in gut bacteria. Regulators consider approved levels safe.'),
 R(LIM,'Mouse studies and one small human trial found changes in gut bacteria. Regulators consider approved levels safe.'),
 R(LIM,'Same note. Approved levels are considered safe.'));

/* ---- preservatives and antioxidants ---- */
A('benzoate','Sodium benzoate (E211)','pres',['sodium benzoate','benzoate','e211','e210','e212','e213','benzoic acid','preservative 211'],['c-additive'],
 R(AVD,'Not for infants.'),
 R(LIM,'A 2007 UK trial linked it, mixed with colours, to more restless behaviour in some children. Common in soft drinks and pickles.'),
 R(OK,'Considered safe within the acceptable intake of 5 mg per kg.'),
 R(OK,'Considered safe within the acceptable intake of 5 mg per kg.'));
A('sorbate','Potassium sorbate (E202)','pres',['potassium sorbate','sorbic acid','e202','e200','e201','e203','sorbate'],['c-additive'],
 R(CARE,'Not needed in home-made baby food. Check labels on packaged baby foods.'),
 R(OK,'Considered safe. Rarely irritates skin or mouth in sensitive people.'),
 R(OK,'Considered safe. Rarely irritates skin or mouth in sensitive people.'),
 R(OK,'Considered safe.'));
A('nitrite','Nitrites and nitrates (E249 to E252)','pres',['sodium nitrite','nitrite','e250','nitrate','e251','e252','e249','curing salt','saltpetre'],['c-cancer','c-sodium'],
 R(AVD,'Babies can develop methaemoglobinaemia (blue baby syndrome) from nitrites. Not for infants.'),
 R(LIM,'Used to cure ham, sausages and bacon. Processed meat is an IARC group 1 carcinogen.'),
 R(LIM,'Used to cure ham, sausages and bacon. Processed meat is an IARC group 1 carcinogen.'),
 R(LIM,'Same note. Keep cured meat occasional.'));
A('sulphite','Sulphites (E220 to E228)','pres',['sulphite','sulfite','sulphur dioxide','e220','e221','e222','e223','e224','e225','e226','e227','e228','metabisulphite','dried fruit preservative'],['c-additive','c-allergen'],
 R(AVD,'Can trigger wheeze. Not for infants.'),
 R(CARE,'Can trigger wheeze in children with asthma. Found in dried fruit, pickles, vinegar and some drinks.'),
 R(CARE,'Asthma can flare. Sulphites must be declared on labels above 10 mg per kg.'),
 R(CARE,'Asthma can flare. Check labels on dried fruit, wine and pickles.'));
A('propionate','Calcium propionate (E282)','pres',['calcium propionate','propionic acid','e282','e280','e281','e283','propionate','bread preservative'],['c-additive'],
 R(CARE,'Not needed in home food.'),
 R(OK,'Used in packaged bread. One small trial found irritability in some children, but regulators consider approved levels safe.'),
 R(OK,'Considered safe.'),
 R(OK,'Considered safe.'));
A('bha','BHA and BHT (E320, E321)','pres',['bha','bht','e320','e321','butylated hydroxyanisole','butylated hydroxytoluene','antioxidant'],['c-cancer'],
 R(AVD,'Not for infants.'),
 R(LIM,'Added to oils, chips and cereals to stop rancidity. The IARC lists BHA as possibly carcinogenic (group 2B).'),
 R(LIM,'Same note. Choose snacks without it when you can.'),
 R(LIM,'Same note. Choose snacks without it when you can.'));
A('tbhq','TBHQ (E319)','pres',['tbhq','e319','tertiary butylhydroquinone','antioxidant'],['c-restricted'],
 R(AVD,'Not for infants.'),
 R(LIM,'Used in fried snacks and instant noodles. Acceptable intake is 0.7 mg per kg a day. Limits differ by country.'),
 R(LIM,'Same note. Choose snacks without it when you can.'),
 R(LIM,'Same note. Choose snacks without it when you can.'));

/* ---- colours ---- */
A('azo','Synthetic colours (tartrazine, sunset yellow, carmoisine)','colour',['tartrazine','e102','sunset yellow','e110','carmoisine','e122','allura red','e129','ponceau 4r','e124','quinoline yellow','e104','azorubine','food colour','artificial colour','synthetic dye','red 40','yellow 5'],['c-additive','c-restricted'],
 R(AVD,'Not for infants.'),
 R(LIM,'EU law requires a warning that these may affect activity and attention in children. Best skipped for young children, especially if hyperactive.'),
 R(OK,'No clear harm in adults. Some people get hives, especially with aspirin sensitivity.'),
 R(OK,'No clear harm. Some people get hives, especially with aspirin sensitivity.'));
A('tio2','Titanium dioxide (E171)','colour',['titanium dioxide','e171','white colour','whitener'],['c-restricted'],
 R(AVD,'Not for infants.'),
 R(LIM,'The EU banned it as a food additive in 2022 because genotoxicity could not be ruled out. Some countries still allow it, so check your local rules.'),
 R(LIM,'Same note. Found in white sweets, icing and some tablets.'),
 R(LIM,'Same note. Found in white sweets, icing and some tablets.'));
A('caramel','Caramel colour (E150)','colour',['caramel colour','caramel color','e150','e150a','e150c','e150d','4-mei'],['c-cancer'],
 R(CARE,'Not needed. Plain caramel (E150a) is the simplest type.'),
 R(OK,'Types made with ammonia (E150c, E150d) can carry trace 4-MEI, which is in IARC group 2B. Regulators set limits.'),
 R(OK,'Types made with ammonia can carry trace 4-MEI. Regulators set limits.'),
 R(OK,'Types made with ammonia can carry trace 4-MEI. Regulators set limits.'));
A('natcolour','Natural colours (beetroot, paprika, spirulina, annatto)','colour',['natural colour','natural color','e162','e160c','e160b','annatto','beetroot red','spirulina','phycocyanin','e100','anthocyanin','paprika extract'],['c-allergen'],
 R(OK,'Fine in food amounts. Annatto rarely causes allergic reactions.'),
 R(OK,'Fine in food amounts. Annatto rarely causes allergic reactions.'),
 R(OK,'Fine in food amounts.'),
 R(OK,'Fine in food amounts.'));

/* ---- flavour enhancers and salt ---- */
A('msg','MSG, monosodium glutamate (E621)','flav',['msg','monosodium glutamate','e621','ajinomoto','glutamate','e620','e622','e623','e624','e625','chinese salt','vetsin','flavour enhancer'],['c-sodium','c-additive'],
 R(AVD,'Not for infants. EU rules keep it out of foods for infants and young children.'),
 R(LIM,'Fine in small amounts for most children. Keep it out of food for under 3s.'),
 R(OK,'Has about a third of the sodium of salt. A few sensitive people report headache or flushing after large doses.'),
 R(LIM,'Counts toward your sodium total. Limit it if you are on a salt-restricted diet.'));
A('ig','Disodium inosinate and guanylate (E627, E631)','flav',['disodium inosinate','disodium guanylate','e627','e631','e635','i+g','ribonucleotides','flavour enhancer 635'],['c-sodium'],
 R(AVD,'Not for infants.'),
 R(OK,'Used with MSG in instant noodles and chips. Keep portions of those snacks small.'),
 R(LIM,'Breaks down to uric acid, so people with gout should avoid it.'),
 R(CARE,'Gout and kidney stones are more common with age. Ask your doctor if you have either.'));
A('yeastext','Yeast extract','flav',['yeast extract','marmite','vegemite','autolysed yeast','hydrolysed vegetable protein','hvp','savoury spread'],['c-sodium'],
 R(AVD,'Very salty and rich in glutamate. Not for routine use under 12 months.'),
 R(LIM,'Salty. A thin scrape is fine for children over 1.'),
 R(LIM,'Very salty. Count it toward your 5 g a day.'),
 R(LIM,'Very salty. Count it toward your 5 g a day, especially with high blood pressure.'));
A('soysauce','Soy sauce','flav',['soy sauce','shoyu','tamari','soya sauce','chinese sauce'],['c-sodium','c-allergen'],
 R(AVD,'Very salty, and contains soy and wheat.'),
 R(LIM,'Contains soy and wheat. A teaspoon holds roughly 0.7 g of salt.'),
 R(LIM,'A teaspoon holds roughly 0.7 g of salt, against a daily limit of 5 g.'),
 R(CARE,'Very salty. Check with your doctor if you have high blood pressure or kidney problems.'));
A('flavours','Artificial flavours and vanillin','flav',['artificial flavour','artificial flavor','nature identical flavour','vanillin','flavouring','flavour','essence'],['c-additive'],
 R(CARE,'Not needed in food for babies.'),
 R(OK,'Approved flavourings are used in tiny amounts. Long lists of them mark a highly processed product.'),
 R(OK,'Approved flavourings are used in tiny amounts.'),
 R(OK,'Approved flavourings are used in tiny amounts.'));
A('saltsub','Salt substitute (potassium chloride, E508)','flav',['potassium chloride','e508','salt substitute','lite salt','low sodium salt','lo-salt'],['c-kidney','c-interaction'],
 R(AVD,'Not for infants.'),
 R(CARE,'Not needed for children.'),
 R(CARE,'Helps many people with high blood pressure, but check with a doctor if you have kidney disease or take certain BP medicines.'),
 R(CARE,'Can raise blood potassium dangerously with kidney disease or with ACE inhibitor and spironolactone medicines. Ask your doctor first.'));

/* ---- acids, minerals and flour improvers ---- */
A('citric','Citric acid (E330)','acid',['citric acid','e330','sour salt','nimbu satva'],[],
 R(OK,'Natural acid from citrus. Tiny amounts in food are fine.'),
 R(OK,'Frequent sour sweets and fizzy drinks wear away tooth enamel.'),
 R(OK,'Fine in food amounts.'),
 R(OK,'Fine in food amounts.'));
A('ascorbic','Ascorbic acid, vitamin C (E300)','acid',['ascorbic acid','vitamin c','e300','sodium ascorbate','e301'],[],
 R(OK,'Tiny amounts used as an antioxidant are fine.'),
 R(OK,'Tiny amounts used as an antioxidant are fine.'),
 R(OK,'Food amounts are tiny. High-dose supplements can upset the stomach.'),
 R(OK,'Food amounts are tiny. High-dose supplements can contribute to kidney stones.'));
A('vinegar','Vinegar (E260)','acid',['vinegar','acetic acid','e260','sirka'],[],
 R(LIM,'A little in cooked food is fine. Never undiluted.'),
 R(OK,'Fine in food amounts.'),
 R(OK,'Fine in food amounts.'),
 R(OK,'Can worsen reflux in some people.'));
A('bakingsoda','Baking soda and baking powder (E500)','acid',['baking soda','sodium bicarbonate','e500','soda','eno','baking powder','raising agent','khane ka soda'],['c-sodium','c-interaction'],
 R(LIM,'Avoid in baby food. It adds sodium.'),
 R(OK,'Fine in cooking amounts.'),
 R(OK,'Cooking amounts are small, but a level teaspoon of baking soda holds about 1.2 g of sodium.'),
 R(CARE,'Adds sodium, and taking it as a stomach remedy interferes with some medicines. Normal cooking amounts are fine.'));
A('phosphates','Phosphate additives (E338 to E341, E450 to E452)','acid',['phosphoric acid','e338','e339','e340','e341','e450','e451','e452','phosphate','sodium phosphate','polyphosphate','cola acid'],['c-kidney','c-additive'],
 R(CARE,'Not needed. Infant kidneys are still maturing.'),
 R(LIM,'Found in colas, processed cheese and processed meat. Heavy intake of added phosphate can crowd out calcium.'),
 R(LIM,'High intake of added phosphate is linked to blood vessel calcification and kidney decline. Cut back on colas and processed meat.'),
 R(CARE,'Added phosphate is absorbed almost fully and is hard on weak kidneys. Ask your doctor if you have kidney disease.'));
A('bromate','Potassium bromate (E924)','acid',['potassium bromate','e924','bromate','bread improver','flour improver'],['c-restricted','c-cancer'],
 R(AVD,'Banned in India since 2016, and in the EU, UK and Canada. The IARC lists it as possibly carcinogenic (group 2B).'),
 R(AVD,'Banned in India since 2016, and in the EU, UK and Canada. Ask bakeries what improver they use.'),
 R(AVD,'Banned in India since 2016, and in the EU, UK and Canada. The IARC lists it as possibly carcinogenic (group 2B).'),
 R(AVD,'Banned in India since 2016, and in the EU, UK and Canada.'));

/* ---- fats and oils ---- */
A('trans','Trans fat (hydrogenated oil, vanaspati)','fat',['trans fat','partially hydrogenated oil','vanaspati','dalda','margarine','shortening','hydrogenated fat','bakery shortening'],['c-fat','c-restricted'],
 R(AVD,'No place in infant food.'),
 R(AVD,'WHO wants industrial trans fat eliminated. It raises LDL cholesterol and lowers HDL. India caps it at 2% of oils and fats in foods.'),
 R(AVD,'Raises heart attack risk. Check bakery items and fried snacks for vanaspati.'),
 R(AVD,'Raises heart disease risk. Check bakery items and fried snacks for vanaspati.'));
A('palm','Palm oil','fat',['palm oil','palmolein','palm olein','palm kernel oil'],['c-fat'],
 R(LIM,'Not needed in home-made baby food.'),
 R(LIM,'About half saturated fat. Common in packaged snacks and noodles. Fine in small amounts.'),
 R(LIM,'High in saturated fat. Use groundnut, rice bran or olive oil for daily cooking instead.'),
 R(LIM,'High in saturated fat. Prefer olive, groundnut or rice bran oil.'));
A('coconutoil','Coconut oil','fat',['coconut oil','copra','nariyal oil'],['c-fat'],
 R(OK,'A little in cooked food is fine.'),
 R(OK,'Fine in moderation.'),
 R(LIM,'Over 80% saturated fat, which raises LDL cholesterol. Not a health food.'),
 R(LIM,'Over 80% saturated fat, which raises LDL cholesterol, especially with heart disease.'));
A('olive','Olive oil','fat',['olive oil','extra virgin olive oil','evoo'],['c-fat'],
 R(OK,'A small drizzle in cooked food is fine.'),
 R(OK,'Mostly unsaturated fat.'),
 R(OK,'A good everyday choice. Do not use it for repeated deep-frying.'),
 R(OK,'A good everyday choice.'));
A('refinedoil','Sunflower, soybean and rice bran oil','fat',['sunflower oil','soybean oil','rice bran oil','groundnut oil','peanut oil','refined oil','vegetable oil','canola','cooking oil'],['c-fat'],
 R(OK,'A small amount in cooked food.'),
 R(OK,'Mostly unsaturated fat. Use fresh oil.'),
 R(OK,'Mostly unsaturated fat. Use fresh oil and do not reheat it repeatedly.'),
 R(OK,'Mostly unsaturated fat. Use fresh oil and do not reheat it repeatedly.'));
A('butter','Butter','fat',['butter','makhan','white butter','salted butter'],['c-fat','c-sodium'],
 R(LIM,'Use unsalted butter in small amounts.'),
 R(OK,'Fine in moderation.'),
 R(LIM,'High in saturated fat, and salted butter adds sodium.'),
 R(LIM,'High in saturated fat, and salted butter adds sodium.'));
A('mayo','Mayonnaise (raw egg)','fat',['mayo','mayonnaise','aioli','eggless mayonnaise'],['c-foodsafety','c-fat','c-allergen'],
 R(CARE,'Raw egg risk and salt. Only mayonnaise made with pasteurised egg is suitable, and only a little.'),
 R(CARE,'Home-made mayonnaise with raw egg carries a salmonella risk. Use pasteurised-egg versions.'),
 R(LIM,'Calorie dense and keeps poorly. Use pasteurised-egg mayonnaise and keep it below 5 °C.'),
 R(CARE,'Older adults face more risk from salmonella. Avoid home-made raw-egg mayonnaise.'));

/* ---- nuts, seeds and soy ---- */
A('soy','Soy and tofu','nut',['soy','soya','tofu','soy milk','soy chunks','nutrela','tempeh','edamame'],['c-allergen'],
 R(CARE,'Common allergen. Offer cooked tofu in small amounts from about 6 months and watch for reactions. Soy drink is not a substitute for milk before 12 months.'),
 R(OK,'Suitable unless allergic.'),
 R(OK,'Suitable unless allergic.'),
 R(OK,'Suitable unless allergic.'));
A('chia','Chia, flax and sabja seeds','nut',['chia','flax','flaxseed','linseed','alsi','basil seeds','sabja','tukmaria'],['c-choking'],
 R(CARE,'Always soak or grind. Dry seeds swell and can block the throat.'),
 R(CARE,'Soak chia and sabja seeds before serving.'),
 R(OK,'Soak in liquid first.'),
 R(CARE,'Dry chia can swell in the throat, so soak well if swallowing is difficult.'));

/* ---- dairy and eggs ---- */
A('rawmilk','Raw milk and raw soft cheese','dairy',['raw milk','unpasteurised milk','unpasteurized','soft cheese','kachcha doodh','brie','listeria'],['c-foodsafety'],
 R(AVD,'Can carry E. coli, salmonella, listeria and brucella. Not for infants.'),
 R(AVD,'Can carry E. coli, salmonella, listeria and brucella. Boil milk first.'),
 R(CARE,'Boil raw milk first. Pregnant people should avoid raw soft cheese.'),
 R(AVD,'Infection risk is higher with age. Always boil milk.'));
A('cheese','Cheese','dairy',['cheese','processed cheese','cheddar','cheese slice','mozzarella'],['c-sodium','c-allergen'],
 R(LIM,'A little pasteurised hard cheese is fine from 6 months. Processed slices are far saltier.'),
 R(OK,'Suitable unless allergic. Processed cheese carries more salt.'),
 R(LIM,'Salty and high in saturated fat. Processed cheese also carries phosphate additives.'),
 R(LIM,'Salty and high in saturated fat.'));
A('paneer','Paneer','dairy',['paneer','cottage cheese','chhena'],['c-allergen'],
 R(OK,'Soft, unsalted paneer made from pasteurised milk, from about 6 months.'),
 R(OK,'Suitable unless allergic to milk.'),
 R(OK,'Good protein. Moderate saturated fat.'),
 R(OK,'Soft and easy to eat.'));
A('condensed','Sweetened condensed milk','dairy',['condensed milk','milkmaid','evaporated milk'],['c-sugar','c-allergen'],
 R(AVD,'About half sugar, and not a milk substitute.'),
 R(LIM,'Very sugary. Keep it for occasional desserts.'),
 R(LIM,'Very sugary. Keep it for occasional desserts.'),
 R(LIM,'Very sugary. Count it if you have diabetes.'));

/* ---- grains and millets ---- */
A('maida','Refined flour (maida)','grain',['maida','refined flour','all purpose flour','white flour','plain flour','white bread','naan','bakery'],['c-glycemic','c-allergen'],
 R(LIM,'Low in fibre and iron. Prefer fortified cereals or ragi.'),
 R(LIM,'Raises blood sugar fast and fills up on little nutrition. Common in biscuits, noodles and bakery items.'),
 R(LIM,'Choose whole wheat, ragi or oats more often. With diabetes, pair it with protein and fibre.'),
 R(LIM,'Choose whole grains more often. With diabetes, pair it with protein and fibre.'));
A('rice','Rice','grain',['rice','white rice','brown rice','rice cakes','rice milk','basmati','poha','murmura','puffed rice','chawal'],['c-metals','c-glycemic'],
 R(CARE,'Rice takes up arsenic from soil. Vary grains, rinse and cook in plenty of water, and avoid rice cakes and rice drinks before 5 years.'),
 R(OK,'Vary your grains. Rice drinks are not advised under 5.'),
 R(OK,'White rice raises blood sugar quickly. Pair it with dal and vegetables.'),
 R(OK,'Soft and easy to eat. Pair it with dal and vegetables if you have diabetes.'));
A('oats','Oats and cereals','grain',['oats','oatmeal','rolled oats','instant oats','muesli','granola','cornflakes','cereal'],['c-allergen'],
 R(OK,'Well-cooked porridge from about 6 months, without sugar.'),
 R(OK,'Plain oats are a good choice. Flavoured sachets and granola often carry added sugar.'),
 R(OK,'Plain oats help with cholesterol. People with coeliac disease need certified gluten-free oats.'),
 R(OK,'Soft porridge is easy to eat. People with coeliac disease need certified gluten-free oats.'));
A('millets','Millets (jowar, bajra, foxtail)','grain',['jowar','bajra','foxtail millet','kodo','little millet','sorghum','pearl millet','barnyard millet','millet','kangni','sama'],[],
 R(OK,'Soft, well-cooked porridge from about 6 months.'),
 R(OK,'Good fibre and minerals.'),
 R(OK,'Good fibre, with a gentler blood sugar rise than white rice.'),
 R(OK,'Good fibre. Cook until soft.'));

/* ---- spices and herbs ---- */
A('pepper','Black pepper','spice',['black pepper','pepper','kali mirch','piperine'],['c-interaction'],
 R(OK,'A pinch in cooked food.'),
 R(OK,'Food amounts are fine.'),
 R(OK,'Food amounts are fine.'),
 R(OK,'Food amounts are fine. Piperine supplements can change how some medicines are absorbed.'));
A('cumin','Cumin, coriander and cardamom','spice',['jeera','cumin','dhania','coriander','elaichi','cardamom','fennel','saunf','ajwain','carom','bay leaf','mild spices'],[],
 R(OK,'Mild spices add flavour without salt. Use small amounts.'),
 R(OK,'Fine in food amounts.'),
 R(OK,'Fine in food amounts.'),
 R(OK,'Fine in food amounts.'));
A('cinnamon','Cinnamon','spice',['cinnamon','dalchini','cassia','coumarin'],[],
 R(LIM,'Cassia cinnamon holds coumarin, which in large amounts can strain the liver. A small pinch is fine.'),
 R(LIM,'Cassia cinnamon, the common kind, holds coumarin. Heavy daily use in children can pass the safe limit.'),
 R(OK,'Ceylon cinnamon has very little coumarin. Cassia is fine in food amounts.'),
 R(OK,'Fine in food amounts.'));
A('garlic','Garlic and onion','spice',['garlic','lehsun','onion','pyaz','shallot'],['c-interaction'],
 R(OK,'Cooked, in small amounts, from about 6 months.'),
 R(OK,'Fine in food amounts.'),
 R(OK,'Fine in food amounts.'),
 R(OK,'Fine in food amounts. Garlic supplements can add to blood thinner effects.'));
A('fenugreek','Fenugreek (methi)','spice',['fenugreek','methi','methi dana','kasuri methi'],['c-interaction','c-allergen'],
 R(LIM,'Strong flavour. Small amounts only, and watch for reactions if there is a peanut or chickpea allergy.'),
 R(OK,'Fine in food amounts.'),
 R(OK,'Fine in food amounts. Supplements can lower blood sugar further if you take diabetes medicine.'),
 R(CARE,'Can lower blood sugar and add to blood thinners. Food amounts are fine, supplements are not.'));
A('hing','Asafoetida (hing)','spice',['hing','asafoetida','asafetida'],[],
 R(CARE,'A tiny pinch in cooked food is traditional. Large amounts or hing water given for colic have caused blood problems in babies, so ask a paediatrician first.'),
 R(OK,'Fine in food amounts.'),
 R(OK,'Fine in food amounts.'),
 R(OK,'Fine in food amounts.'));

/* ---- fruit and vegetables ---- */
A('dates','Dates and dried fruit','produce',['dates','khajoor','raisins','kishmish','dried fruit','dried apricot','anjeer','figs','prunes'],['c-sugar','c-choking'],
 R(CARE,'Sticky and hard to chew. Offer only as soft puree or soaked and finely chopped.'),
 R(LIM,'Sticky and sugary, so it clings to teeth. Chop for under 5.'),
 R(OK,'Natural sugar in concentrated form. A small handful is enough.'),
 R(OK,'Natural sugar in concentrated form. Check dried fruit labels for sulphites if you have asthma.'));

/* ---- protein foods ---- */
A('beans','Beans, lentils and chickpeas','protein',['rajma','kidney beans','red beans','beans','lectin','chole','chickpeas','dal','lentils','legumes','moong','chana'],['c-foodsafety'],
 R(OK,'Well cooked and mashed from about 6 months. Never serve undercooked beans.'),
 R(OK,'Soak and boil rajma hard for at least 10 minutes. Raw or undercooked kidney beans cause vomiting.'),
 R(OK,'Good protein and fibre. Beans can cause gas.'),
 R(OK,'Good protein and fibre. Cook until soft. Beans can cause gas.'));
A('shellfish','Shellfish and prawns','protein',['shellfish','prawns','shrimp','crab','lobster','oyster','mussels','squid','seafood'],['c-allergen','c-foodsafety'],
 R(CARE,'Common allergen. Offer well-cooked shellfish in small amounts, one new food at a time.'),
 R(OK,'Suitable unless allergic. Cook thoroughly.'),
 R(OK,'Suitable unless allergic. Cook thoroughly.'),
 R(CARE,'Raw or undercooked shellfish carry a high risk of food poisoning. Cook through.'));
A('rawfish','Raw fish and sushi','protein',['sushi','sashimi','raw fish','ceviche'],['c-foodsafety'],
 R(AVD,'Parasites and bacteria. Not for infants.'),
 R(CARE,'Children under 5 should avoid raw fish. Others should use fresh, reputable sources.'),
 R(CARE,'Use fresh, reputable sources. Pregnant people should avoid it.'),
 R(CARE,'Weaker immunity raises the risk. Choose cooked fish.'));
A('procmeat','Processed meat','protein',['sausage','ham','bacon','salami','nuggets','hot dog','sausages','processed meat','cold cuts','kebab','seekh'],['c-cancer','c-sodium','c-fat'],
 R(AVD,'Too salty, and cured with nitrites.'),
 R(LIM,'The IARC lists processed meat as group 1, meaning strong evidence for cancer risk. Keep it occasional.'),
 R(LIM,'The IARC lists processed meat as group 1, meaning strong evidence for cancer risk. Keep it occasional.'),
 R(LIM,'Same note, and it is also very salty.'));
A('protein','Protein powders and bars','protein',['whey','protein powder','protein shake','protein bar','casein','mass gainer','pea protein'],['c-kidney','c-metals','c-allergen'],
 R(AVD,'Never for infants.'),
 R(CARE,'Children get enough protein from food. Powders can carry heavy metals and contain sweeteners.'),
 R(OK,'Fine as an occasional supplement. Choose products tested by a third party.'),
 R(CARE,'Ask your doctor if you have kidney disease. Choose products tested by a third party.'));

/* ---- drinks ---- */
A('energy','Energy drinks','drink',['energy drink','red bull','pre-workout','guarana','taurine','monster'],['c-caffeine','c-sugar'],
 R(AVD,'Not for infants.'),
 R(AVD,'Not advised under 18, and adults up to 29 should limit them. High in caffeine and often in sugar.'),
 R(LIM,'High caffeine and sugar. Keep total caffeine under about 400 mg a day.'),
 R(CARE,'Can raise heart rate and blood pressure. Ask your doctor if you have a heart condition.'));
A('softdrink','Cola and sweetened soft drinks','drink',['cola','soda','soft drink','cold drink','fizzy drink','sweetened drink','packaged drinks'],['c-sugar','c-caffeine','c-kidney'],
 R(AVD,'No sweet drinks for infants.'),
 R(LIM,'A can holds about 8 teaspoons of sugar. Sweet drinks are the biggest single source of free sugar for children.'),
 R(LIM,'A can holds about 8 teaspoons of sugar, plus phosphates and caffeine.'),
 R(LIM,'Sugar, phosphates and caffeine. Count the sugar if you have diabetes.'));
A('juice','Packaged fruit juice','drink',['juice','fruit juice','packaged juice','nectar','fruit drink','juice concentrate'],['c-sugar'],
 R(AVD,'No juice before 12 months.'),
 R(LIM,'Counts as free sugar even when it is 100% juice. A small glass a day at most for young children.'),
 R(LIM,'Counts as free sugar. Whole fruit is a better choice.'),
 R(LIM,'Counts as free sugar. Whole fruit is a better choice.'));
A('caffeine','Added caffeine','drink',['caffeine','guarana extract','caffeine anhydrous'],['c-caffeine'],
 R(AVD,'Not for infants.'),
 R(LIM,'Children need low limits. Health Canada suggests about 45 mg a day at ages 4 to 6, and up to 2.5 mg per kg for teens.'),
 R(OK,'Up to about 400 mg a day is considered safe for healthy adults. Check labels on energy products.'),
 R(LIM,'Can disturb sleep and raise heart rate. Keep it modest.'));
A('kombucha','Kombucha and fermented drinks','drink',['kombucha','kefir','kanji','fermented drink','probiotic drink','jun','kvass'],['c-foodsafety','c-caffeine'],
 R(AVD,'Not for infants. Contains trace alcohol, caffeine and live cultures.'),
 R(CARE,'Not advised for young children. Contains trace alcohol and caffeine.'),
 R(OK,'Fine for healthy adults in moderation. Avoid when pregnant or immune compromised.'),
 R(CARE,'Live cultures can be risky if immunity is weak. Check the sugar content.'));

export const DISH: Dish[] = [
 // Drinks
 {id:'d-coke',name:'Coca-Cola',brand:'Coca-Cola',pack:true,shelf:'drink',serving:'300 ml can',sugar:31.8,art:['can','#e3171b'],ing:['sugar','caramel','phosphates','caffeine','flavours']},
 {id:'d-dietcoke',name:'Diet Coke',brand:'Coca-Cola',pack:true,shelf:'drink',serving:'300 ml can',sugar:0,art:['can','#d81f26','#e5e7eb'],ing:['aspartame','acesulfame','caramel','phosphates','benzoate','caffeine','flavours']},
 {id:'d-redbull',name:'Red Bull',brand:'Red Bull',pack:true,shelf:'drink',serving:'250 ml can',sugar:27.5,art:['slimcan','#1d4ed8','#cbd5e1'],ing:['sugar','dextrose','citric','caffeine','caramel','flavours']},
 {id:'d-protein',name:'Protein shake',pack:true,shelf:'drink',serving:'30 g scoop',sugar:2,art:['tub','#6b7280'],ing:['protein','sucralose','maltodextrin','xanthan','lecithin']},
 // Snacks & instant
 {id:'d-maggi',name:'Maggi 2-Minute Masala Noodles',brand:'Nestlé',pack:true,shelf:'snack',serving:'70 g pack',sugar:1.2,art:['pouch','#facc15','#dc2626'],ing:['maida','palm','salt','guar','phosphates','ig','caramel','sugar','chili','garlic']},
 {id:'d-lays',name:'Lay’s Classic Salted',brand:'PepsiCo',pack:true,shelf:'snack',serving:'52 g pack',sugar:0.3,art:['pouch','#fbbf24'],ing:['fried','palm','refinedoil','salt']},
 {id:'d-chips',name:'Masala potato chips',pack:true,shelf:'snack',serving:'50 g pack',sugar:2,art:['pouch','#2563eb'],ing:['fried','salt','msg','maltodextrin','palm','chili']},
 {id:'d-bread',name:'Packaged sandwich bread',pack:true,shelf:'snack',serving:'2 slices (50 g)',sugar:2.5,art:['loaf','#f59e0b'],ing:['maida','propionate','monodi','sugar','salt']},
 // Biscuits & sweets
 {id:'d-oreo',name:'Oreo Vanilla Creme',brand:'Mondelez',pack:true,shelf:'sweet',serving:'30 g (3 biscuits)',sugar:11.6,art:['biscuit','#1d5fd6','#e0ecff'],ing:['maida','sugar','palm','glucosesyrup','bakingsoda','salt','lecithin','flavours']},
 {id:'d-dairymilk',name:'Cadbury Dairy Milk',brand:'Mondelez',pack:true,shelf:'sweet',serving:'13 g bar',sugar:7.2,art:['bar','#6d28d9','#a78bfa'],ing:['sugar','milk','flavours']},
 {id:'d-parleg',name:'Parle-G Glucose Biscuits',brand:'Parle',pack:true,shelf:'sweet',serving:'25 g (about 4 biscuits)',sugar:6.4,art:['biscuit','#facc15','#fff7d6'],ing:['maida','sugar','palm','glucosesyrup','bakingsoda','milk','salt','lecithin','monodi','sulphite','flavours']},
 {id:'d-kitkat',name:'KitKat',brand:'Nestlé',pack:true,shelf:'sweet',serving:'37 g (4 fingers)',sugar:18.5,art:['bar','#dc2626','#fecaca'],ing:['sugar','maida','milk','palm','lecithin','bakingsoda','flavours']},
 {id:'d-gummies',name:'Fruit gummies',pack:true,shelf:'sweet',serving:'25 g pack',sugar:14,art:['pouch','#db2777'],ing:['sugar','glucosesyrup','gelatin','azo','citric']},
 // Mixes & sauces
 {id:'d-bournvita',name:'Bournvita',brand:'Mondelez',pack:true,shelf:'mix',serving:'20 g (2 scoops)',sugar:6.4,art:['jar','#9a4b2a','#f3d3c0'],ing:['sugar','glucosesyrup','milk','caramel','flavours']},
 {id:'d-kissan',name:'Kissan Fresh Tomato Ketchup',brand:'HUL',pack:true,shelf:'mix',serving:'15 g (1 tablespoon)',sugar:3.6,art:['bottle','#ef2b1d'],ing:['sugar','salt','vinegar','benzoate']},
 {id:'d-jam',name:'Mixed fruit jam',pack:true,shelf:'mix',serving:'15 g (1 tablespoon)',sugar:9.8,art:['jar','#e11d74','#fbcfe8'],ing:['sugar','pectin','citric','benzoate']},
 // Home-cooked (typical recipe)
 {id:'d-ragi-porridge',name:'Ragi porridge',shelf:'home',serving:'1 bowl, 1 tsp jaggery',sugar:5,art:['bowl','#e8805a'],ing:['ragi','jaggery','milk']},
 {id:'d-chikki',name:'Peanut-sesame chikki',shelf:'home',serving:'25 g piece',sugar:10,art:['bar','#f97316','#fed7aa'],ing:['peanut','jaggery','sesame']},
 {id:'d-haldi-milk',name:'Haldi milk',shelf:'home',serving:'1 cup, 1 tsp jaggery',sugar:5,art:['mug','#eab308'],ing:['turmeric','milk','jaggery']},
 {id:'d-masala-tea',name:'Masala tea',shelf:'home',serving:'1 cup, 2 tsp sugar',sugar:8,art:['mug','#ea7a4b'],ing:['tea','milk','ginger','sugar']},
 {id:'d-ragi-dosa',name:'Ragi dosa',shelf:'home',serving:'2 dosas',sugar:0,art:['plate','#d9774b'],ing:['ragi','chili','salt','curd']},
 {id:'d-sprout-salad',name:'Sprout salad',shelf:'home',serving:'1 bowl',sugar:0,art:['bowl','#22c55e'],ing:['sprouts','chili','salt','spinach']}
];

export type AtlasItem =
  | (Concern & { kind: 'con' })
  | (Ingredient & { kind: 'ing' })
  | (Dish & { kind: 'dish' });

export const BY: Record<string, AtlasItem> = {};
CON.forEach((c) => { BY[c.id] = { ...c, kind: 'con' }; });
ING.forEach((i) => { BY[i.id] = { ...i, kind: 'ing' }; });
DISH.forEach((d) => { BY[d.id] = { ...d, kind: 'dish' }; });

export const hay = (x: AtlasItem) =>
  (x.name + ' ' + ('alt' in x && x.alt ? x.alt.join(' ') : '')).toLowerCase();

export const byName = (a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name);

/** A dish is as strict as its strictest ingredient; drivers explain why. */
export function dishRating(d: Dish, g: GroupId) {
  let worst: Level = 'ok';
  const drivers: { id: string; lv: Level; note: string }[] = [];
  d.ing.forEach((id) => {
    const [lv, note] = (BY[id] as Ingredient).r[g];
    if (LV[lv].o > 0) drivers.push({ id, lv, note });
    if (LV[lv].o > LV[worst].o) worst = lv;
  });
  drivers.sort((a, b) => LV[b.lv].o - LV[a.lv].o);
  return { level: worst, drivers };
}

export function levelFor(n: AtlasItem, g: GroupId): Level | null {
  if (n.kind === 'ing') return n.r[g][0];
  if (n.kind === 'dish') return dishRating(n, g).level;
  return null;
}

/** Teaspoons of sugar (4 g each), one decimal. */
export const tsp = (g: number) => Math.round((g / 4) * 10) / 10;

/** Every E/INS code the Atlas knows, e.g. "e951". */
export const CODES = new Set(ING.flatMap((i) => (i.alt ?? []).filter((a) => /^e\d{3,4}[a-z]?$/.test(a))));

// Longest terms first so "glucose syrup" wins over "glucose"
const TERMS = ING.flatMap((i) => [i.name.replace(/\s*\(.*\)$/, ''), ...(i.alt ?? [])].map((t) => ({ t: t.toLowerCase(), id: i.id })))
  .sort((a, b) => b.t.length - a.t.length);
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Ingredient ids found in a pasted label, in label order. "INS 471", "E-471" and a bare "(471)" all read as e471. */
export function decodeLabel(text: string): string[] {
  let s = ' ' + text.toLowerCase()
    .replace(/\b(?:e|ins)\s*-?\s*(\d{3,4}[a-z]?)\b/g, 'e$1')
    .replace(/(?<![\w.])(\d{3,4}[a-z]?)(?![\d.%]|\s*(?:g|mg|kg|kcal|ml|l)\b)/g, 'e$1') + ' ';
  const hits: { at: number; id: string }[] = [];
  for (const { t, id } of TERMS) {
    const re = new RegExp(`(?<=[^a-z0-9])${esc(t)}(?=[^a-z0-9])`, 'g');
    s = s.replace(re, (m, at: number) => {
      hits.push({ at, id });
      return ' '.repeat(m.length); // consume so shorter terms can't match the same words
    });
  }
  return [...new Set(hits.sort((a, b) => a.at - b.at).map((h) => h.id))];
}
