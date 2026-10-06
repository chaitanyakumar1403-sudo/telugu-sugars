# Telugu Sugars (తెలుగు సుగర్స్)

> **Evidence-first, culturally rooted digital publication & interactive scientific platform investigating dietary sugars, sweeteners, and metabolic health.**

---

## 🌟 Overview

**Telugu Sugars** is a modern, high-performance web publication and scientific exploration platform engineered for public health clarity. Rooted in Telugu culture and backed by peer-reviewed evidence, the platform deconstructs dietary sugars, artificial sweeteners, hidden industrial additives, and their metabolic implications.

### 🔬 Core Pillars & Design Influences
- **Editorial Typography & Texture:** *Inside IMAX* aesthetic with subtle sugarcane texture-mask reveals and dynamic ambient particle drift.
- **Interactive Research Graph:** *Connected Papers* inspired SVG visual node explorer mapping consensus claims, research papers, study designs, sample sizes, and DOI links.
- **Visual Rhythm & Depth:** *Wassup Media* & *Escape Academy* atmospheric depth with sleek obsidian surfaces, gold/amber accents, and crisp typography.
- **Bilingual By Design:** Seamless English & Telugu (`Noto Sans Telugu` / `Mandali`) dynamic language switching with persistent preference storage.
- **Mobile-First & Accessible:** 48px touch targets, sticky thumb-zone bottom navigation, WCAG 2.1 AA compliant contrast ratios, full keyboard navigation, and screen reader skip links.

---

## 🚀 Key Features

1. **Editorial Journal & Stories (`/stories`)**
   - Immersive reader mode with adjustable font sizing (A / A+ / A++).
   - Audio narration player with play/pause and progress scrubbing.
   - Interactive Telugu scientific glossary popovers for regional terms (e.g., తీపి, చక్కెర, మధుమేహం).

2. **Connected Research Explorer (`/research`)**
   - Interactive SVG node graph visualizing relationships between metabolic claims and academic papers.
   - Node status filtering: *Strong Support*, *Emerging / Mixed*, *Refuted*.
   - Slide-out paper drawer with study type, sample size, key conclusions, and direct DOI external links.
   - Accessible table fallback view for screen readers and reduced motion preferences.

3. **Interactive Nutrition Label Scanner (`/food-labels`)**
   - High-contrast interactive nutrition facts label based on common Telugu snack foods.
   - Pulsating interactive hotspots identifying hidden sugars (e.g., *Maltodextrin*, *Invert Sugar Syrup*).
   - Instant educational insights comparing glycemic impact against standard table sugar (sucrose).

4. **Watch & Video Masterclasses (`/watch`)**
   - Custom video player interface with chapter selection and timestamps.
   - Synchronized bilingual interactive transcript with click-to-seek playback.
   - Key scientific takeaways and cited peer-reviewed references per episode.

5. **Topics & Claims Comparison Matrix (`/topics`)**
   - Comparative claims breakdown categorizing evidence into *Supports*, *Limits*, and *Unknowns*.
   - Level of evidence tags (Meta-analysis, RCT, Cohort).

6. **Global Search (`Ctrl+K` / `Cmd+K`)**
   - Unified keyboard-accessible search overlay with instant results across stories, research papers, video chapters, and food label ingredients.

7. **Compliance & Trust**
   - Editorial standards & scientific methodology disclosure (`/about/editorial-standards`).
   - Cookie & privacy consent banner with persistent preference storage.
   - Research briefing newsletter subscription modal.

---

## 🛠️ Tech Stack

- **Framework:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite 6](https://vitejs.dev/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Interactive Effects:** [Canvas Confetti](https://github.com/catdad/canvas-confetti) & HTML5 Canvas particle systems
- **Testing:** [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/) + [jsdom](https://github.com/jsdom/jsdom)
- **Styling:** Vanilla Modern CSS with CSS custom properties design token architecture

---

## 💻 Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm (v9.0.0 or higher)

### Installation
Clone the repository and install dependencies:

```bash
git clone https://github.com/chaitanyakumar1403-sudo/telugu-sugars.git
cd telugu-sugars
npm install
```

### Local Development
Start the local Vite development server:

```bash
npm run dev
```

Open your browser at:
👉 **`http://localhost:3000`**

### Running Automated Tests
Run the complete Vitest test suite (19 tests across 12 suites):

```bash
npm run test
```

### Production Build
Generate an optimized, production-ready static bundle:

```bash
npm run build
```

The output will be placed in the `dist/` directory.

To preview the production bundle locally:

```bash
npm run preview
```

---

## 📁 Directory Structure

```text
telugu-sugars/
├── docs/                      # Architectural specs & implementation plans
├── public/                    # Static public assets
├── src/
│   ├── components/
│   │   ├── cards/             # ContentCard, EvidenceCard
│   │   ├── common/            # Header, Footer, MobileBottomNav, Modals, Consent
│   │   ├── foodlabels/        # Interactive nutrition label & hotspots
│   │   ├── home/              # Hero, Particle canvas, Features
│   │   ├── research/          # SVG node graph, Paper drawer, List fallback
│   │   ├── search/            # Cmd+K search modal & search items
│   │   ├── stories/           # StoryReader, GlossaryPopover, AudioNarrator
│   │   ├── topics/            # ClaimComparison matrix
│   │   └── watch/             # VideoPlayer, ChapterList, InteractiveTranscript
│   ├── context/               # Bilingual LanguageContext (en/te)
│   ├── data/                  # Seed dataset for stories, papers, episodes, labels
│   ├── pages/                 # Full view pages for routing
│   ├── services/              # Content & search services
│   ├── types/                 # TypeScript data contracts & models
│   ├── App.tsx                # Main application orchestrator & routing
│   ├── index.css              # Obsidian & gold luxury design system
│   └── main.tsx               # Application entry point
├── tests/                     # Unit, integration, and E2E test suites
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 📜 License & Editorial Notice
© 2026 Telugu Sugars. All rights reserved. Content is published for scientific and public educational purposes and does not constitute individual medical advice.
