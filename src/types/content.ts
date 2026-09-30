// Core Content Entities & Metadata Types (PDF Sections 4, 6 & 7)

export type Language = 'en' | 'te';

export type StudyType =
  | 'Systematic Review / Meta-Analysis'
  | 'Randomized Controlled Trial (RCT)'
  | 'Prospective Cohort Study'
  | 'Animal Model'
  | 'Mechanistic / In-Vitro';

export type EvidenceGrade = 'Robust' | 'Emerging' | 'Contested' | 'Refuted';

export type RelationshipType = 'supports' | 'challenges' | 'context' | 'method';

export interface VideoChapter {
  id: string;
  title: string;
  teluguTitle: string;
  startTime: number; // in seconds
  description: string;
}

export interface TranscriptSegment {
  id: string;
  startTime: number;
  endTime: number;
  speaker: string;
  textEn: string;
  textTe: string;
}

export interface Story {
  id: string;
  slug: string;
  type: 'Video' | 'Explainer' | 'Research Dossier';
  title: string;
  teluguTitle: string;
  summary: string;
  teluguSummary: string;
  readTime: string;
  author: string;
  reviewer: string;
  reviewerCredentials: string;
  lastReviewedDate: string;
  tags: string[];
  featuredImage: string;
  audioUrl?: string;
  videoUrl?: string;
  chapters?: VideoChapter[];
  transcript?: TranscriptSegment[];
  keyTakeaways: string[];
  teluguTakeaways: string[];
  citedPaperIds: string[];
  bodyHtmlEn: string;
  bodyHtmlTe: string;
}

export interface Paper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  journal: string;
  doi: string;
  url: string;
  studyType: StudyType;
  population: string;
  sampleSize: string;
  mainFinding: string;
  limitations: string;
  sourceCheckDate: string;
  reviewedBy: string;
}

export interface Claim {
  id: string;
  claimId: string;
  claimText: string;
  teluguClaimText: string;
  topicId: string;
  evidenceGrade: EvidenceGrade;
  summary: string;
  teluguSummary: string;
  caveats: string;
  whatThisDoesNotProve: string;
  lastReviewedDate: string;
  reviewerName: string;
  reviewerRole: string;
  relatedStorySlugs: string[];
}

export interface Relationship {
  id: string;
  claimId: string;
  paperId: string;
  relationshipType: RelationshipType;
  editorialRationale: string;
  confidenceNotes: string;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  teluguRendering: string;
  phoneticGuide: string;
  plainLanguageDefinition: string;
  teluguDefinition: string;
  examples: string[];
  linkedArticleSlugs: string[];
}

export interface Topic {
  id: string;
  slug: string;
  title: string;
  teluguTitle: string;
  description: string;
  teluguDescription: string;
  claimCount: number;
  studyCount: number;
  iconName: string;
}

export interface FoodLabelHotspot {
  id: string;
  xPercent: number; // 0 - 100 on label
  yPercent: number; // 0 - 100 on label
  title: string;
  teluguTitle: string;
  claimedMarketing: string;
  scientificReality: string;
  consumerAdvice: string;
}

export interface FoodLabelGuide {
  id: string;
  slug: string;
  productName: string;
  teluguProductName: string;
  category: string;
  declaredSugarsPer100g: string;
  actualSugarLoad: string;
  hiddenSugarNames: string[];
  hotspots: FoodLabelHotspot[];
}
