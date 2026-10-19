import { describe, it, expect } from 'vitest';
import { decodeLabel } from '../src/data/atlasData';

describe('decodeLabel', () => {
  it('reads names, aliases and E/INS codes in label order', () => {
    const ids = decodeLabel('Refined wheat flour (maida), Sugar, Glucose syrup, Emulsifier (INS 471, 322), Sweetener (E-951), Salt. Protein 6.2g');
    expect(ids).toEqual(expect.arrayContaining(['sugar', 'glucosesyrup', 'monodi', 'lecithin', 'aspartame', 'salt']));
    expect(ids.indexOf('sugar')).toBeLessThan(ids.indexOf('salt'));
    expect(ids).not.toContain('dextrose'); // "glucose" consumed by "glucose syrup"
  });

  it('reads ingredients written in Telugu', () => {
    expect(decodeLabel('చక్కెర, మైదా, పామాయిల్, ఉప్పు')).toEqual(['sugar', 'maida', 'palm', 'salt']);
  });

  it('ignores quantities and returns nothing for empty text', () => {
    expect(decodeLabel('Energy 450 kcal, 100 g')).toEqual([]);
    expect(decodeLabel('')).toEqual([]);
  });
});
