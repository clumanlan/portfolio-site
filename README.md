# carlyle lumanlan: portfolio

Personal portfolio and technical blog. Built to showcase full-stack ML engineering work and document learning through D3-powered interactive posts.

**Live**: clumanlan.com

---

## Why [frozen]

**End goal**: A minimal, high-taste portfolio that documents a programming journey through projects and a growing body of technical writing, making the site itself evidence of the engineering capability it claims.

**What this is not**: A resume site. Not a list of skills. The project and blog posts do the talking.

**Why this stack**: Astro renders static by default (fast, cheap), MDX lets D3 components live inside blog posts without friction, and the Claude Code workflow (scaffold → write → deploy) needs zero CMS overhead.

---

## What [frozen]

### Site structure

```
/                  → hero + featured project card
/blog              → post list, filterable by tag (client-side)
/blog/[slug]       → MDX post with sticky TOC, narrow text column, full-width D3 breakouts
```

No /about page. No /projects page. Homepage is the landing and the launchpad.

### Design decisions (locked)

| Decision | Choice | Reason |
|---|---|---|
| Heading font | Fraunces | Editorial, distinctive, rare on MLE portfolios |
| Body font | Inter | Clean, readable, universal |
| Accent color | Dark mint `#1a7a5e` | Grounded, uncommon, pairs well with Fraunces; tag bg `#e0f5ec` |
| Color mode | Light only | D3 visualizations render in a known context |
| Nav | Projects + Blog right only; GitHub + LinkedIn in footer | Name lives in hero; no redundancy in nav |
| Homepage hero | Tagline only, no name heading | Name is in hero h1, not repeated in nav |
| Blog post layout | Narrow text column, D3 components break to full width | Readable prose, full-canvas viz |
| TOC | Sticky left on blog posts | Makes long D3 posts navigable |
| D3 organization | MDX + co-located `.tsx` component file per post | Self-contained, Claude Code can generate both in one shot |

### Personal content

- **Name**: Carlyle Lumanlan
- **Tagline**: "i enjoy building things"
- **GitHub**: https://github.com/clumanlan
- **LinkedIn**: https://www.linkedin.com/in/carlyle-lumanlan/

### Featured projects

- **MLB Prop Research System**: Python, XGBoost, AWS S3, FastAPI, React ([github.com/clumanlan/mlb](https://github.com/clumanlan/mlb))
- **AP Lit Essay Grader**: Python, FastAPI, Claude API, React, PostgreSQL, AWS ECS ([github.com/clumanlan/aplit-grader](https://github.com/clumanlan/aplit-grader))

Neither has a live demo yet. `demo` is optional in the project schema and the card only shows a Demo link when it's set.

### Content collection schemas

**Blog post frontmatter** (`src/content/blog/[slug]/index.mdx`):
```ts
title: string
date: string          // ISO: "2025-06-01"
description: string   // 1-2 sentences for post list
tags: string[]        // e.g. ["mlops", "data-viz", "systems"]
draft: boolean        // excluded from production build when true
```

**Project frontmatter** (`src/content/projects/[name].md`):
```ts
title: string
description: string
stack: string[]
github: string
demo: string           // optional
featured: boolean     // true = shown on homepage
```

### Rejected approaches

- **Next.js**: More powerful but heavier than needed; Astro's islands are a better fit for mostly-static content with selective D3 hydration
- **CMS (Contentlayer, Sanity, etc.)**: Overkill for one author; MDX files + Claude Code is faster
- **Dark mode**: Adds D3 palette complexity with no clear benefit for this audience

---

## How [living, last_updated: 2026-07-27]

### Tech stack

| Layer | Choice |
|---|---|
| Framework | Astro 7 + TypeScript strict |
| Styling | Tailwind CSS v4 + @tailwindcss/typography |
| Blog | MDX (`@astrojs/mdx`) |
| D3 components | React islands (`@astrojs/react`), D3 v7 |
| Fonts | Google Fonts: Fraunces + Inter |
| Hosting | Vercel (auto-deploy from `main`) |
| Sitemap | `@astrojs/sitemap` |

### Folder structure

```
/
├── public/                          ← no favicon by design (data: URI in Base.astro)
├── src/
│   ├── components/
│   │   ├── Nav.astro                ← Projects + Blog right, active in mint
│   │   ├── Footer.astro             ← GitHub + LinkedIn right
│   │   ├── ProjectCard.astro
│   │   └── TOC.tsx                  ← sticky TOC, React island
│   ├── content/
│   │   ├── blog/
│   │   │   └── [slug]/
│   │   │       ├── index.mdx
│   │   │       └── Chart.tsx        ← co-located D3 component
│   │   └── projects/
│   │       └── mlb-baseball.md
│   ├── layouts/
│   │   ├── Base.astro               ← meta tags, OG, canonical URL
│   │   └── BlogPost.astro           ← TOC aside, full-bleed class, prose styles
│   ├── pages/
│   │   ├── index.astro
│   │   └── blog/
│   │       ├── index.astro          ← tag filter (client-side JS)
│   │       └── [slug].astro         ← loads co-located Chart via import.meta.glob
│   └── styles/
│       └── global.css               ← Tailwind v4 @theme, fonts, prose overrides
├── scripts/
│   └── new-post.mjs                 ← scaffold script
├── src/content.config.ts            ← Astro v7 content layer schemas (glob loaders)
├── astro.config.mjs
├── tsconfig.json
├── CLAUDE.md
└── README.md
```

### D3 blog post workflow

```bash
npm run new-post -- --slug "my-post-title"
```

Scaffolds:
- `src/content/blog/my-post-title/index.mdx`: frontmatter pre-filled, date set to today
- `src/content/blog/my-post-title/Chart.tsx`: D3 component starter with ResizeObserver

**Important**: use the `@blog` alias in MDX imports, not a relative path. Astro v7's content layer processes MDX from a virtual module URL so relative imports fail.

```mdx
import Chart from '@blog/my-post-title/Chart.tsx'
<Chart client:load />
```

For full-width D3 breakouts:
```mdx
<div class="full-bleed">
  <Chart client:load />
</div>
```

### Phased plan

#### Phase 1: Foundation ✅
- [x] Astro 7 project with TypeScript strict, MDX, React, Tailwind v4
- [x] Global CSS: mint accent vars, Fraunces + Inter via Google Fonts
- [x] `Nav.astro`: Projects + Blog right; GitHub + LinkedIn in footer
- [x] `Base.astro` layout
- [x] Homepage: hero tagline, `ProjectCard.astro`
- [x] Content collection schemas (`src/content.config.ts` with glob loaders)
- [x] MLB Baseball project content file
- [x] Deployed to Vercel, auto-deploy from `main` confirmed

#### Phase 2: Blog ✅
- [x] `/blog` list page with client-side tag filter (mint active state)
- [x] `/blog/[slug]` dynamic route
- [x] `BlogPost.astro` layout: narrow prose, sticky TOC aside, full-bleed class
- [x] `TOC.tsx` React island with IntersectionObserver active heading tracking
- [x] `scripts/new-post.mjs` scaffold script wired as `npm run new-post`

#### Phase 3: First post ✅
- [x] NGBoost post: point predictions vs probability distributions
- [x] Interactive D3 chart: training stages (Ames housing) + prediction comparison (MLB batter)
- [x] Validated: `@blog` alias import, island hydration, TOC, full-bleed breakout, tag filtering

#### Phase 4: Polish ✅
- [x] OG + Twitter meta tags on all pages (`og:type=article` on blog posts)
- [x] Canonical URLs, site URL configured
- [x] `@astrojs/sitemap` generating `sitemap-index.xml` at build
- [x] Favicon: mint rounded square with C initial
- [x] Typography: antialiasing, heading line-height, prose spacing

#### Custom domain ✅
- [x] `clumanlan.com` purchased and connected via Vercel

### Definition of done

**v1 is complete** ✅. One real D3 blog post is live at clumanlan.com, the scaffold workflow is proven end-to-end, and the domain is live.

---

## Decisions log

- **2026-07-27**: Removed name from nav. Name lives in hero h1; nav link was redundant and looked heavy.
- **2026-07-27**: Removed blog teaser from homepage. Blog is only accessible via nav link; keeps homepage focused on the project.
- **2026-07-27**: Switched to `@blog` Vite alias for MDX component imports. Astro v7's content layer processes MDX from virtual module URLs, breaking relative `./Chart.tsx` imports.
- **2026-07-27**: Used `src/content.config.ts` with glob loaders (Astro v7 requirement). Old `src/content/config.ts` is no longer supported.
- **2026-07-27**: Domain: chose `clumanlan.com` over `clumanlan.dev` or `carlylelumanlan.dev`.
- **2026-07-24**: Project scoped via alignment session. Stack, design tokens, site structure, content schemas, and phased plan locked.

---

## Open questions

- Live demo URLs for MLB Prop Research System and AP Lit Essay Grader *(add `demo:` to their content files when ready)*

---

## Deliberately deferred

- Dark mode: adds D3 color complexity, no clear benefit now
- /about page: homepage hero is sufficient for now
- CMS: MDX files + Claude Code is faster for a single author
- Search: not needed until there are many posts
- Comments: not needed for v1
