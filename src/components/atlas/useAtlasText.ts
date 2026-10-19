import { useLanguage } from '../../context/LanguageContext';
import { BY, CATNAME, GR, LV, type Dish, type GroupId, type Ingredient, type Level } from '../../data/atlasData';
import { TE_CATS, TE_CON, TE_DISH, TE_GR, TE_ING, TE_LV } from '../../data/atlasTe';

const NOTE: Record<GroupId, 1 | 2 | 3 | 4> = { inf: 1, youth: 2, mid: 3, old: 4 };

/** Atlas names and notes in the reader's language; falls back to English for anything untranslated. */
export function useAtlasText() {
  const { language, t } = useLanguage();
  const te = language === 'te';
  const name = (id: string) => (te && (TE_ING[id]?.[0] ?? TE_CON[id]?.[0] ?? TE_DISH[id]?.[0])) || BY[id].name;
  const group = (g: GroupId) => GR.find((x) => x.id === g)!;
  return {
    te,
    t,
    name,
    byName: (a: { id: string }, b: { id: string }) => name(a.id).localeCompare(name(b.id), te ? 'te' : 'en'),
    note: (id: string, g: GroupId) => (te && TE_ING[id]?.[NOTE[g]]) || (BY[id] as Ingredient).r[g][1],
    cat: (id: string) => (te && TE_CATS[id]) || CATNAME[id],
    desc: (id: string) => (te && TE_CON[id]?.[1]) || (BY[id] as { d: string }).d,
    serving: (d: Dish) => (te && TE_DISH[d.id]?.[1]) || d.serving,
    level: (lv: Level) => (te ? TE_LV[lv] : LV[lv].t),
    groupName: (g: GroupId) => (te ? TE_GR[g][0] : group(g).name),
    groupAge: (g: GroupId) => (te ? TE_GR[g][1] : group(g).age),
    /** "middle-aged (30–59 years)" / "మధ్య వయసు వారు (30–59 ఏళ్లు)" */
    groupFor: (g: GroupId) => (te ? `${TE_GR[g][2]} (${TE_GR[g][1]})` : `${group(g).name.toLowerCase()} (${group(g).age})`),
  };
}
