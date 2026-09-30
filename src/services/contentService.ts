import {
  Story,
  Paper,
  Claim,
  Relationship,
  GlossaryTerm,
  Topic,
  FoodLabelGuide,
} from '../types/content';
import {
  SEED_STORIES,
  SEED_PAPERS,
  SEED_CLAIMS,
  SEED_RELATIONSHIPS,
  SEED_GLOSSARY,
  SEED_TOPICS,
  SEED_FOOD_LABELS,
} from '../data/seedData';

export interface SearchResults {
  stories: Story[];
  claims: Claim[];
  papers: Paper[];
  glossary: GlossaryTerm[];
}

export function getStories(): Story[] {
  return SEED_STORIES;
}

export function getStoryBySlug(slug: string): Story | undefined {
  return SEED_STORIES.find((s) => s.slug === slug);
}

export function getClaims(): Claim[] {
  return SEED_CLAIMS;
}

export function getClaimById(id: string): Claim | undefined {
  return SEED_CLAIMS.find((c) => c.id === id || c.claimId === id);
}

export function getPapers(): Paper[] {
  return SEED_PAPERS;
}

export function getPaperById(id: string): Paper | undefined {
  return SEED_PAPERS.find((p) => p.id === id);
}

export function getRelationships(): Relationship[] {
  return SEED_RELATIONSHIPS;
}

export function getRelationshipsForClaim(claimId: string): Relationship[] {
  return SEED_RELATIONSHIPS.filter((r) => r.claimId === claimId);
}

export function getTopics(): Topic[] {
  return SEED_TOPICS;
}

export function getTopicBySlug(slug: string): Topic | undefined {
  return SEED_TOPICS.find((t) => t.slug === slug);
}

export function getFoodLabelGuides(): FoodLabelGuide[] {
  return SEED_FOOD_LABELS;
}

export function getFoodLabelGuideBySlug(slug: string): FoodLabelGuide | undefined {
  return SEED_FOOD_LABELS.find((g) => g.slug === slug);
}

export function getGlossaryTerms(): GlossaryTerm[] {
  return SEED_GLOSSARY;
}

export function getGlossaryTermById(id: string): GlossaryTerm | undefined {
  return SEED_GLOSSARY.find((g) => g.id === id || g.term.toLowerCase() === id.toLowerCase());
}

export function searchAll(rawQuery: string): SearchResults {
  const query = rawQuery.trim().toLowerCase();
  if (!query) {
    return { stories: [], claims: [], papers: [], glossary: [] };
  }

  const stories = SEED_STORIES.filter(
    (s) =>
      s.title.toLowerCase().includes(query) ||
      s.teluguTitle.toLowerCase().includes(query) ||
      s.summary.toLowerCase().includes(query) ||
      s.tags.some((t) => t.toLowerCase().includes(query))
  );

  const claims = SEED_CLAIMS.filter(
    (c) =>
      c.claimText.toLowerCase().includes(query) ||
      c.teluguClaimText.toLowerCase().includes(query) ||
      c.summary.toLowerCase().includes(query)
  );

  const papers = SEED_PAPERS.filter(
    (p) =>
      p.title.toLowerCase().includes(query) ||
      p.authors.some((a) => a.toLowerCase().includes(query)) ||
      p.journal.toLowerCase().includes(query) ||
      p.mainFinding.toLowerCase().includes(query)
  );

  const glossary = SEED_GLOSSARY.filter(
    (g) =>
      g.term.toLowerCase().includes(query) ||
      g.teluguRendering.toLowerCase().includes(query) ||
      g.plainLanguageDefinition.toLowerCase().includes(query)
  );

  return { stories, claims, papers, glossary };
}
