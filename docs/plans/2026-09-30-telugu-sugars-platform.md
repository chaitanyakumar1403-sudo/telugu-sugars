# Telugu Sugars Platform Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Build a 100% production-ready, ultra-premium, responsive digital publication and interactive scientific platform for Telugu Sugars (తెలుగు సుగర్స్) covering all URL patterns, content entities, and interactive features defined in the 8-page specification PDF.

**Architecture:** A lightweight, high-performance Vite + React + TypeScript single-page application with client-side routing, vanilla CSS custom property design system (Inside IMAX display typography, Escape Academy atmospheric depth, Wassup Media structural clarity), an interactive SVG/Canvas Research Graph engine (Connected Papers style), an interactive food label hotspot simulator, bilingual Telugu/English support, and complete WCAG 2.1 AA accessibility.

**Tech Stack:** React 19, TypeScript, Vite, Lucide-React (vector icons), Canvas/SVG for network graph visualization, Vitest + React Testing Library for verification, Vanilla CSS for luxury design tokens.

---

### Task 1: Project Scaffolding & Design System Tokens

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `index.html`
- Create: `src/index.css`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Test: `tests/app.test.tsx`

**Step 1: Write the failing test**

```tsx
// tests/app.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../src/App';

describe('App Root', () => {
  it('renders the Telugu Sugars application container with luxury brand tokens', () => {
    render(<App />);
    expect(screen.getByTestId('telugusugars-root')).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL (missing dependencies or files)

**Step 3: Write minimal implementation**

1. Configure `package.json` with dependencies (`react`, `react-dom`, `lucide-react`, `canvas-confetti`) and devDependencies (`vite`, `@vitejs/plugin-react`, `typescript`, `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`).
2. Implement `src/index.css` with CSS custom properties:
   - Primary: Obsidian Cane (`#08090B`), Carbon Slate (`#111418`), Elevated Surface (`#181C22`).
   - Accents: Raw Jaggery Amber (`#D4A359`), Sugar Blossom (`#F3C98B`), Clinical Science Teal (`#10B981`), Warning Coral (`#F43F5E`).
   - Fonts: Syne / Cormorant Garamond / Plus Jakarta Sans / Noto Sans Telugu.
   - Micro-interaction resets, focus-visible states, reduced-motion media queries.
3. Implement `src/App.tsx` containing `<div id="app" data-testid="telugusugars-root">`.

**Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS

**Step 5: Commit**

```bash
git add package.json tsconfig.json vite.config.ts index.html src/ tests/
git commit -m "feat: scaffold project with design system tokens and test harness"
```

---

### Task 2: Core Content Models & Seed Evidence Store

**Files:**
- Create: `src/types/content.ts`
- Create: `src/data/seedData.ts`
- Create: `src/services/contentService.ts`
- Test: `tests/contentService.test.ts`

**Step 1: Write the failing test**

```typescript
// tests/contentService.test.ts
import { describe, it, expect } from 'vitest';
import { getStories, getClaims, getPapers, getGlossaryTerms, searchAll } from '../src/services/contentService';

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
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run tests/contentService.test.ts`
Expected: FAIL (modules not found)

**Step 3: Write minimal implementation**

1. Create `src/types/content.ts` with strict TypeScript types for `Story`, `Claim`, `Paper`, `Relationship`, `Topic`, `FoodLabelGuide`, and `GlossaryTerm` as specified in PDF Section 4.
2. Create `src/data/seedData.ts` with realistic, high-fidelity peer-reviewed data:
   - Jaggery vs White Sugar glycemic index studies.
   - Stevia & Sucralose microbiome impact papers (with sample sizes, DOIs, outcomes, and limitations).
   - Video episodes with chapter timestamps, full bilingual transcripts, and key takeaways.
   - Mock nutrition labels (e.g., "Traditional Telugu Millet Cookies" hiding 42% maltodextrin).
   - Telugu and English glossary terms (*గ్లైసెమిక్ ఇండెక్స్*, *సుక్రోజ్*, *ఇన్సులిన్ రెసిస్టెన్స్*).
3. Implement `src/services/contentService.ts` providing getter methods and search indexing.

**Step 4: Run test to verify it passes**

Run: `npx vitest run tests/contentService.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/types/content.ts src/data/seedData.ts src/services/contentService.ts tests/contentService.test.ts
git commit -m "feat: implement content models and empirical evidence seed store"
```

---

### Task 3: Header, Bilingual Language Engine & Mobile Bottom Navigation

**Files:**
- Create: `src/context/LanguageContext.tsx`
- Create: `src/components/common/Header.tsx`
- Create: `src/components/common/MobileBottomNav.tsx`
- Create: `src/components/common/LanguageToggle.tsx`
- Test: `tests/navigation.test.tsx`

**Step 1: Write the failing test**

```tsx
// tests/navigation.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LanguageProvider } from '../src/context/LanguageContext';
import Header from '../src/components/common/Header';
import MobileBottomNav from '../src/components/common/MobileBottomNav';

describe('Navigation & Bilingual Switcher', () => {
  it('switches language between English and Telugu', () => {
    render(
      <LanguageProvider>
        <Header activePath="/" onNavigate={() => {}} onOpenSearch={() => {}} />
        <MobileBottomNav activePath="/" onNavigate={() => {}} />
      </LanguageProvider>
    );
    const langBtn = screen.getByRole('button', { name: /switch to telugu|తెలుగు/i });
    fireEvent.click(langBtn);
    expect(screen.getByText(/పరిశోధన/i)).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run tests/navigation.test.tsx`
Expected: FAIL

**Step 3: Write minimal implementation**

1. Create `LanguageContext.tsx` with toggle for `en` and `te` plus translation dictionary.
2. Implement `Header.tsx` with logo, navigation links (`Stories`, `Watch`, `Topics`, `Research Graph`, `Food Labels`, `Standards`), Search button, and Language switch.
3. Implement `MobileBottomNav.tsx` with thumb-reachable sticky bottom bar (Home, Watch, Research, Labels, Search) adhering to 48px tap targets.

**Step 4: Run test to verify it passes**

Run: `npx vitest run tests/navigation.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/context/ src/components/common/ tests/navigation.test.tsx
git commit -m "feat: add bilingual context, header, and mobile bottom navigation"
```

---

### Task 4: Home Page Hero (Inside-IMAX Wordmark & Ambient Canvas) & Content Sections

**Files:**
- Create: `src/components/home/HomeHero.tsx`
- Create: `src/components/home/AmbientCanvas.tsx`
- Create: `src/components/cards/ContentCard.tsx`
- Create: `src/components/cards/EvidenceCard.tsx`
- Create: `src/pages/HomePage.tsx`
- Test: `tests/homePage.test.tsx`

**Step 1: Write the failing test**

```tsx
// tests/homePage.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import HomePage from '../src/pages/HomePage';
import { LanguageProvider } from '../src/context/LanguageContext';

describe('HomePage Hero and Interactive Wordmark', () => {
  it('renders the Inside-IMAX display wordmark and handles interaction toggle', () => {
    render(
      <LanguageProvider>
        <HomePage onNavigate={() => {}} />
      </LanguageProvider>
    );
    const wordmark = screen.getByTestId('hero-wordmark');
    expect(wordmark).toBeInTheDocument();
    fireEvent.mouseEnter(wordmark);
    expect(wordmark).toHaveClass('is-revealed');
  });

  it('renders evidence cards with "What the study found" and "What it cannot tell us"', () => {
    render(
      <LanguageProvider>
        <HomePage onNavigate={() => {}} />
      </LanguageProvider>
    );
    expect(screen.getAllByText(/What the study found/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/What it cannot tell us/i).length).toBeGreaterThan(0);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run tests/homePage.test.tsx`
Expected: FAIL

**Step 3: Write minimal implementation**

1. Create `HomeHero.tsx`:
   - Monumental wordmark `TELUGU SUGARS` with `.hero-wordmark` CSS class supporting mouseenter/mouseleave and touch tap reveal of sugar-cane golden crystal texture.
   - Core sentence explaining the publication.
   - Primary CTA `Explore the latest` and secondary CTA `Browse evidence`.
   - Motion pause control button for reduced-motion accessibility.
2. Create `AmbientCanvas.tsx`:
   - Lightweight, low-contrast subtle amber particle drift with zero CPU lag and pause capability.
3. Create `ContentCard.tsx` & `EvidenceCard.tsx`:
   - Card displays type label, summary, tags, and strict separation between *"What the study found"* and *"What it cannot tell us"*.
4. Assemble `HomePage.tsx`.

**Step 4: Run test to verify it passes**

Run: `npx vitest run tests/homePage.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/home/ src/components/cards/ src/pages/HomePage.tsx tests/homePage.test.tsx
git commit -m "feat: implement home page with inside-imax wordmark and evidence cards"
```

---

### Task 5: Research Explorer (Connected Papers Interactive Node Network)

**Files:**
- Create: `src/components/research/GraphCanvas.tsx`
- Create: `src/components/research/PaperDrawer.tsx`
- Create: `src/components/research/GraphFilters.tsx`
- Create: `src/components/research/AccessibleListView.tsx`
- Create: `src/pages/ResearchPage.tsx`
- Test: `tests/researchExplorer.test.tsx`

**Step 1: Write the failing test**

```tsx
// tests/researchExplorer.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ResearchPage from '../src/pages/ResearchPage';
import { LanguageProvider } from '../src/context/LanguageContext';

describe('Research Explorer Interaction Spec (PDF Section 6)', () => {
  it('renders central claim node and allows node click to open side drawer', () => {
    render(
      <LanguageProvider>
        <ResearchPage />
      </LanguageProvider>
    );
    const paperNode = screen.getByTestId('node-paper-1');
    fireEvent.click(paperNode);
    expect(screen.getByTestId('paper-drawer')).toBeInTheDocument();
    expect(screen.getByText(/Study Limitations/i)).toBeInTheDocument();
  });

  it('allows switching to linear accessible table view', () => {
    render(
      <LanguageProvider>
        <ResearchPage />
      </LanguageProvider>
    );
    const toggleBtn = screen.getByRole('button', { name: /table view|list view/i });
    fireEvent.click(toggleBtn);
    expect(screen.getByRole('table')).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run tests/researchExplorer.test.tsx`
Expected: FAIL

**Step 3: Write minimal implementation**

1. Create `GraphCanvas.tsx`:
   - Interactive SVG/Canvas node graph with central claim node and surrounding study nodes.
   - Edges colored by relationship: `supports` (teal `#10B981`), `challenges` (crimson `#F43F5E`), `context` (amber `#F59E0B`), `method` (slate `#94A3B8`).
   - Pan/zoom controls, fit-to-screen button, and reset button.
   - Mobile responsive: defaults to focused claim + swipeable card carousel on mobile screens, with full canvas on tablet/desktop.
2. Create `PaperDrawer.tsx`:
   - Slide-in side drawer displaying: Title, Authors, Year, Study Design Badge (RCT, Meta-analysis, Animal), Population, Sample Size, Findings, Limitations, and direct DOI link.
3. Create `GraphFilters.tsx`: Filter by year, study design (human vs animal), and evidence status.
4. Create `AccessibleListView.tsx`: Table/list view for screen readers and low-bandwidth users.
5. Create `ResearchPage.tsx` with "How to read this map" educational modal.

**Step 4: Run test to verify it passes**

Run: `npx vitest run tests/researchExplorer.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/research/ src/pages/ResearchPage.tsx tests/researchExplorer.test.tsx
git commit -m "feat: implement research explorer node network and paper drawer"
```

---

### Task 6: Interactive Food Label Walkthrough (Phase 2 Spec)

**Files:**
- Create: `src/components/foodlabels/InteractiveLabel.tsx`
- Create: `src/components/foodlabels/LabelHotspotDetail.tsx`
- Create: `src/pages/FoodLabelsPage.tsx`
- Test: `tests/foodLabels.test.tsx`

**Step 1: Write the failing test**

```tsx
// tests/foodLabels.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import FoodLabelsPage from '../src/pages/FoodLabelsPage';
import { LanguageProvider } from '../src/context/LanguageContext';

describe('Interactive Food Label Walkthrough', () => {
  it('renders mock packaging label with clickable hotspots for added sugars and serving size', () => {
    render(
      <LanguageProvider>
        <FoodLabelsPage />
      </LanguageProvider>
    );
    const hotspot = screen.getByTestId('hotspot-added-sugars');
    fireEvent.click(hotspot);
    expect(screen.getByText(/How Brands Disguise Added Sugars/i)).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run tests/foodLabels.test.tsx`
Expected: FAIL

**Step 3: Write minimal implementation**

1. Create `InteractiveLabel.tsx`:
   - Realistic nutritional facts label with pulsating clickable hotspots on:
     - 1. Serving Size Trickery (small portion vs actual packet consumption)
     - 2. Added Sugars vs Total Sugars
     - 3. Disguised Ingredients (maltodextrin, high-fructose syrup, invert sugar)
     - 4. Front-of-pack claims ("100% Natural", "No Added Refined Sugar")
2. Create `LabelHotspotDetail.tsx`:
   - Slide-in explanation card deconstructing the consumer deception with plain-language advice and Telugu translations.
3. Assemble `FoodLabelsPage.tsx`.

**Step 4: Run test to verify it passes**

Run: `npx vitest run tests/foodLabels.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/foodlabels/ src/pages/FoodLabelsPage.tsx tests/foodLabels.test.tsx
git commit -m "feat: implement interactive nutrition label walkthrough with hotspots"
```

---

### Task 7: Video Episode Streaming Hub with Interactive Chapters & Synchronized Transcript

**Files:**
- Create: `src/components/watch/VideoPlayer.tsx`
- Create: `src/components/watch/ChapterList.tsx`
- Create: `src/components/watch/InteractiveTranscript.tsx`
- Create: `src/components/watch/KeyTakeaways.tsx`
- Create: `src/pages/WatchPage.tsx`
- Test: `tests/watchEpisode.test.tsx`

**Step 1: Write the failing test**

```tsx
// tests/watchEpisode.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import WatchPage from '../src/pages/WatchPage';
import { LanguageProvider } from '../src/context/LanguageContext';

describe('Watch Episode Hub (PDF Section 5)', () => {
  it('renders video episode with chapters and clicking a chapter seeks timestamp', () => {
    render(
      <LanguageProvider>
        <WatchPage />
      </LanguageProvider>
    );
    const chapterBtn = screen.getByText(/The Jaggery Health Halo Myth/i);
    fireEvent.click(chapterBtn);
    expect(screen.getByTestId('active-chapter')).toHaveTextContent(/The Jaggery Health Halo Myth/i);
  });

  it('renders interactive transcript and cited papers list', () => {
    render(
      <LanguageProvider>
        <WatchPage />
      </LanguageProvider>
    );
    expect(screen.getByTestId('transcript-container')).toBeInTheDocument();
    expect(screen.getByTestId('episode-references')).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run tests/watchEpisode.test.tsx`
Expected: FAIL

**Step 3: Write minimal implementation**

1. Create `VideoPlayer.tsx` with custom controls, muted preview toggle, and time-sync callbacks.
2. Create `ChapterList.tsx` with clickable timestamps seeking the video.
3. Create `InteractiveTranscript.tsx` with live highlighting of spoken segments and click-to-seek words.
4. Create `KeyTakeaways.tsx` & cited paper list with direct DOI links.
5. Create `WatchPage.tsx`.

**Step 4: Run test to verify it passes**

Run: `npx vitest run tests/watchEpisode.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/watch/ src/pages/WatchPage.tsx tests/watchEpisode.test.tsx
git commit -m "feat: implement video episode hub with chapters and synchronized transcript"
```

---

### Task 8: Investigative Story Reader with Reading/Listening Mode & Glossary Popovers

**Files:**
- Create: `src/components/stories/StoryReader.tsx`
- Create: `src/components/stories/GlossaryPopover.tsx`
- Create: `src/components/stories/AudioNarrator.tsx`
- Create: `src/pages/StoryDetailPage.tsx`
- Create: `src/pages/StoriesIndexPage.tsx`
- Test: `tests/storyReader.test.tsx`

**Step 1: Write the failing test**

```tsx
// tests/storyReader.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StoryDetailPage from '../src/pages/StoryDetailPage';
import { LanguageProvider } from '../src/context/LanguageContext';

describe('Story Reader & Glossary Popover', () => {
  it('renders story with font size adjustment and audio narrator controls', () => {
    render(
      <LanguageProvider>
        <StoryDetailPage slug="truth-about-telugu-sweets" />
      </LanguageProvider>
    );
    const increaseFontBtn = screen.getByRole('button', { name: /increase font|a\+/i });
    fireEvent.click(increaseFontBtn);
    expect(screen.getByTestId('story-content')).toHaveClass('text-lg');
  });

  it('reveals Telugu scientific glossary popover on term click', () => {
    render(
      <LanguageProvider>
        <StoryDetailPage slug="truth-about-telugu-sweets" />
      </LanguageProvider>
    );
    const term = screen.getByTestId('glossary-trigger-glycemic-index');
    fireEvent.click(term);
    expect(screen.getByText(/గ్లైసెమిక్ ఇండెక్స్/i)).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run tests/storyReader.test.tsx`
Expected: FAIL

**Step 3: Write minimal implementation**

1. Create `StoryReader.tsx` with clean editorial layout, reading progress bar, font size controller (`A-`, `A+`), and high-contrast toggle.
2. Create `GlossaryPopover.tsx` rendering bilingual definitions, Telugu script, and phonetic guides.
3. Create `AudioNarrator.tsx` with play/pause and progress scrub for audio listening mode.
4. Assemble `StoryDetailPage.tsx` and `StoriesIndexPage.tsx`.

**Step 4: Run test to verify it passes**

Run: `npx vitest run tests/storyReader.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/stories/ src/pages/StoriesIndexPage.tsx src/pages/StoryDetailPage.tsx tests/storyReader.test.tsx
git commit -m "feat: implement story reader, glossary popover, and audio narration mode"
```

---

### Task 9: Curated Topic Pathways & "Compare Two Claims" Engine

**Files:**
- Create: `src/components/topics/ClaimComparison.tsx`
- Create: `src/pages/TopicsPage.tsx`
- Create: `src/pages/TopicDetailPage.tsx`
- Test: `tests/claimComparison.test.tsx`

**Step 1: Write the failing test**

```tsx
// tests/claimComparison.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ClaimComparison from '../src/components/topics/ClaimComparison';
import { LanguageProvider } from '../src/context/LanguageContext';

describe('Compare Two Claims View (PDF Section 5)', () => {
  it('renders comparative matrix showing what evidence supports, limits, and remains unknown', () => {
    render(
      <LanguageProvider>
        <ClaimComparison />
      </LanguageProvider>
    );
    expect(screen.getByText(/What Evidence Supports/i)).toBeInTheDocument();
    expect(screen.getByText(/Where Evidence Reaches Its Limits/i)).toBeInTheDocument();
    expect(screen.getByText(/What Remains Unknown/i)).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run tests/claimComparison.test.tsx`
Expected: FAIL

**Step 3: Write minimal implementation**

1. Create `ClaimComparison.tsx` with dropdown selectors for Claim A and Claim B, rendering a side-by-side empirical comparison matrix:
   - Green column: What the evidence supports
   - Orange column: Limitations & confounding variables
   - Purple column: Scientific unknowns
2. Create `TopicDetailPage.tsx` with editorially curated claim pathways and related content.
3. Create `TopicsPage.tsx`.

**Step 4: Run test to verify it passes**

Run: `npx vitest run tests/claimComparison.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/topics/ src/pages/TopicsPage.tsx src/pages/TopicDetailPage.tsx tests/claimComparison.test.tsx
git commit -m "feat: implement topic pathways and comparative claim matrix"
```

---

### Task 10: Global Universal Search Engine with Suggestions & No-Results Recovery

**Files:**
- Create: `src/components/search/SearchModal.tsx`
- Create: `src/components/search/SearchResultItem.tsx`
- Test: `tests/searchModal.test.tsx`

**Step 1: Write the failing test**

```tsx
// tests/searchModal.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SearchModal from '../src/components/search/SearchModal';
import { LanguageProvider } from '../src/context/LanguageContext';

describe('Global Search Modal (PDF Section 5)', () => {
  it('displays query suggestions and filters results across stories, claims, and papers', () => {
    render(
      <LanguageProvider>
        <SearchModal isOpen={true} onClose={() => {}} onNavigate={() => {}} />
      </LanguageProvider>
    );
    const searchInput = screen.getByPlaceholderText(/search articles, studies, food labels/i);
    fireEvent.change(searchInput, { target: { value: 'Sugar' } });
    expect(screen.getAllByTestId('search-result-item').length).toBeGreaterThan(0);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run tests/searchModal.test.tsx`
Expected: FAIL

**Step 3: Write minimal implementation**

1. Create `SearchModal.tsx`:
   - Quick-access overlay with `Cmd+K` / `Ctrl+K` keyboard shortcut.
   - Popular search suggestions ("Is Jaggery safe for diabetics?", "Hidden maltodextrin", "Stevia vs Sucralose").
   - Categorized live search results with badges (`[STORY]`, `[CLAIM]`, `[PAPER]`, `[GLOSSARY]`).
   - Helpful empty-state guide when 0 results match.

**Step 4: Run test to verify it passes**

Run: `npx vitest run tests/searchModal.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/search/ tests/searchModal.test.tsx
git commit -m "feat: implement global search modal with live query index and suggestions"
```

---

### Task 11: Editorial Standards, Newsletter Consent & Privacy-First Tracking

**Files:**
- Create: `src/pages/EditorialStandardsPage.tsx`
- Create: `src/components/common/NewsletterModal.tsx`
- Create: `src/components/common/ConsentBanner.tsx`
- Create: `src/components/common/Footer.tsx`
- Test: `tests/editorialStandards.test.tsx`

**Step 1: Write the failing test**

```tsx
// tests/editorialStandards.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import EditorialStandardsPage from '../src/pages/EditorialStandardsPage';
import ConsentBanner from '../src/components/common/ConsentBanner';
import { LanguageProvider } from '../src/context/LanguageContext';

describe('Editorial Standards & Privacy Consent (PDF Sections 8 & 9)', () => {
  it('displays peer review workflow, conflict of interest policy, and correction process', () => {
    render(
      <LanguageProvider>
        <EditorialStandardsPage />
      </LanguageProvider>
    );
    expect(screen.getByText(/Editorial & Scientific Standards/i)).toBeInTheDocument();
    expect(screen.getByText(/Conflict of Interest Disclosure/i)).toBeInTheDocument();
    expect(screen.getByText(/Formal Corrections Policy/i)).toBeInTheDocument();
  });

  it('respects user consent choices with plain-language explanation', () => {
    render(<ConsentBanner />);
    const acceptBtn = screen.getByRole('button', { name: /accept preferences/i });
    fireEvent.click(acceptBtn);
    expect(localStorage.getItem('telugusugars_consent')).toBeTruthy();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run tests/editorialStandards.test.tsx`
Expected: FAIL

**Step 3: Write minimal implementation**

1. Create `EditorialStandardsPage.tsx` documenting peer-review procedures, reviewer credentials, medical safety disclaimers, and correction log.
2. Create `NewsletterModal.tsx` with explicit opt-in checkboxes and instant unsubscribe guarantee.
3. Create `ConsentBanner.tsx` for privacy-first, zero-third-party tracking.
4. Create `Footer.tsx` with links to all PDF URL routes and Telugu typography.

**Step 4: Run test to verify it passes**

Run: `npx vitest run tests/editorialStandards.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/pages/EditorialStandardsPage.tsx src/components/common/Footer.tsx src/components/common/ConsentBanner.tsx src/components/common/NewsletterModal.tsx tests/editorialStandards.test.tsx
git commit -m "feat: implement editorial standards, newsletter consent, and privacy banner"
```

---

### Task 12: Production Routing Integration, Cross-Device Polish & Build Verification

**Files:**
- Modify: `src/App.tsx`
- Create: `tests/e2eVerification.test.tsx`
- Test: Full Vitest suite & Production build (`npm run build`)

**Step 1: Write the failing test**

```tsx
// tests/e2eVerification.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../src/App';

describe('Full Application Production Flow', () => {
  it('navigates seamlessly across all PDF URL patterns and verifies active views', () => {
    render(<App />);
    // Navigate to Research Explorer
    const researchLinks = screen.getAllByRole('button', { name: /research|పరిశోధన/i });
    fireEvent.click(researchLinks[0]);
    expect(screen.getByText(/Research Graph Explorer/i)).toBeInTheDocument();

    // Navigate to Food Labels
    const labelLinks = screen.getAllByRole('button', { name: /food labels|లేబుల్స్/i });
    fireEvent.click(labelLinks[0]);
    expect(screen.getByText(/Interactive Food Label/i)).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run tests/e2eVerification.test.tsx`
Expected: FAIL

**Step 3: Write minimal implementation**

1. Wire all routes into `App.tsx` supporting URL history pushState/popState for `/`, `/stories`, `/stories/:slug`, `/watch`, `/watch/:episode`, `/topics`, `/topics/:topic`, `/research`, `/food-labels`, and `/about/editorial-standards`.
2. Add global toast notification for sharing deep links (`navigator.clipboard`).
3. Optimize Core Web Vitals, CSS clamp rules for mobile (320px) to ultra-wide (2560px), and build the production bundle with `vite build`.

**Step 4: Run test to verify it passes**

Run: `npx vitest run` & `npm run build`
Expected: PASS all tests and generate optimized production bundle in `dist/`.

**Step 5: Commit**

```bash
git add src/App.tsx tests/e2eVerification.test.tsx dist/
git commit -m "feat: complete production routing, responsive polish, and build verification"
```
