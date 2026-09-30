import { describe, it, expect } from 'vitest';
import {
  getStories,
  getClaims,
  getPapers,
  getGlossaryTerms,
  searchAll,
} from '../src/services/contentService';

describe('Content Service & Evidence Store', () => {
  it('returns populated stories, claims, papers, and glossary terms', () => {
    expect(getStories().length).toBeGreaterThan(0);
    expect(getClaims().length).toBeGreaterThan(0);
    expect(getPapers().length).toBeGreaterThan(0);
    expect(getGlossaryTerms().length).toBeGreaterThan(0);
  });

  it('performs unified multi-entity search', () => {
    const results = searchAll('Jaggery');
    expect(results.claims.length).toBeGreaterThan(0);
  });
});
