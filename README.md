# carlyle lumanlan — portfolio

Personal portfolio and technical blog. Built to showcase full-stack ML engineering work and document learning through D3-powered interactive posts.

**Live**: clumanlan.com

---

## Why [frozen]

**End goal**: A minimal, high-taste portfolio that documents programming journey through projects and a growing body of technical writing.


**Why this stack**: Astro renders static by default (fast, cheap), MDX lets D3 components live inside blog posts without friction, and the Claude Code workflow (scaffold → write → deploy) needs zero CMS overhead.

---

## What [frozen]

### Site structure

```
/                  → hero + featured project card + blog teaser
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
| Nav | Minimal top bar — name (black) left, Projects + Blog right; GitHub + LinkedIn links in footer | Clean, lets content lead |
| Homepage hero | Name + tagline only, straight into content | No fluff |
| Blog post layout | Narrow text column, D3 components break to full width | Readable prose, full-canvas viz |
| TOC | Sticky left on blog posts | Makes long D3 posts navigable |
| D3 organization | MDX + co-located `.tsx` component file per post | Self-contained, Claude Code can generate both in one shot |

### Personal content

- **Name**: Carlyle Lumanlan
- **Tagline**: "I enjoy building full-stack systems — documenting along the way"
- **GitHub**: https://github.com/clumanlan
- **LinkedIn**: https://www.linkedin.com/in/carlyle-lumanlan/

### Featured project — MLB Baseball System

- **Description**: Predicts individual batter and pitcher game performance
- **Stack**: Python, NGBoost, PyTorch, AWS SageMaker, S3, Feature Store
- **GitHub**: https://github.com/clumanlan/mlb-system *(placeholder)*
- **Demo**: https://mlb-demo.vercel.app *(placeholder)*

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
demo: string
featured: boolean     // true = shown on homepage
```

### Rejected approaches

- **Next.js**: More powerful but heavier than needed; Astro's islands are a better fit for mostly-static content with selective D3 hydration
- **CMS (Contentlayer, Sanity, etc.)**: Overkill for one author; MDX files + Claude Code is faster
- **Dark mode**: Adds D3 palette complexity with no clear benefit for this audience

---

## How [living, last_updated: 2025-07-24]

### Tech stack

| Layer | Choice |
|---|---|
| Framework | Astro + TypeScript |
| Styling | Tailwind CSS |
| Blog | MDX (Astro's `@astrojs/mdx` integration) |
| D3 components | React islands (`@astrojs/react`), D3 v7 |
| Fonts | Google Fonts — Fraunces + Inter |
| Hosting | Vercel (auto-deploy from `main`) |

### Folder structure

```
/
├── public/
├── src/
│   ├── components/
│   │   ├── Nav.astro
│   │   ├── ProjectCard.astro
│   │   ├── BlogTeaser.astro
│   │   └── TOC.tsx                  ← sticky TOC, React island
│   ├── content/
│   │   ├── blog/
│   │   │   └── [slug]/
│   │   │       ├── index.mdx
│   │   │       └── Chart.tsx        ← co-located D3 component
│   │   └── projects/
│   │       └── mlb-baseball.md
│   ├── layouts/
│   │   ├── Base.astro
│   │   └── BlogPost.astro           ← handles TOC + full-width breakout
│   ├── pages/
│   │   ├── index.astro
│   │   └── blog/
│   │       ├── index.astro
│   │       └── [slug].astro
│   └── styles/
│       └── global.css               ← mint accent vars, font imports
├── scripts/
│   └── new-post.mjs                 ← scaffold script
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── CLAUDE.md
└── README.md
```

### D3 blog post workflow

```bash
npm run new-post -- --slug "my-post-title"
```

Scaffolds:
- `src/content/blog/my-post-title/index.mdx` — frontmatter pre-filled, date set to today
- `src/content/blog/my-post-title/Chart.tsx` — D3 component starter with ResizeObserver

In MDX, always use `client:load`:
```mdx
import Chart from './Chart.tsx'
<Chart client:load />
```

For full-width D3 breakouts, wrap in a class that the BlogPost layout targets:
```mdx
<div class="full-bleed">
  <Chart client:load />
</div>
```

### Phased plan

#### Phase 1 — Foundation
- [ ] `pnpm create astro@latest` with TypeScript strict template
- [ ] Install integrations: `@astrojs/mdx`, `@astrojs/react`, `@astrojs/tailwind`
- [ ] Global CSS: mint accent vars (`--accent`, `--accent-mid`, `--accent-dark`), Fraunces + Inter via Google Fonts
- [ ] `Nav.astro` — name left, Projects + Blog right; GitHub + LinkedIn in footer
- [ ] `Base.astro` layout
- [ ] Homepage (`index.astro`): hero tagline, `ProjectCard.astro`, `BlogTeaser.astro` (empty state: "Posts coming soon")
- [ ] Content collection schemas (`src/content/config.ts`)
- [ ] MLB Baseball project content file
- [ ] Deploy to Vercel, confirm auto-deploy from `main` works

Kill criteria: if MDX + React island hydration produces layout issues with the full-width D3 breakout pattern, evaluate before proceeding to Phase 2.

#### Phase 2 — Blog
- [ ] `/blog` list page with tag filter (client-side, mint highlight on active tag)
- [ ] `/blog/[slug]` post page — narrow text column, sticky TOC (`TOC.tsx`), full-width `.full-bleed` breakout
- [ ] `BlogPost.astro` layout
- [ ] `scripts/new-post.mjs` scaffold script
- [ ] `npm run new-post` wired in `package.json`

#### Phase 3 — First post
- [ ] One real D3 blog post end-to-end using the scaffold workflow
- [ ] Validates: scaffold script, MDX import, island hydration, TOC, full-width breakout, tag filtering

#### Phase 4 — Polish
- [ ] Typography pass (line-height, prose width, heading scale)
- [ ] Spacing and whitespace audit
- [ ] Meta tags + OG image per page
- [ ] Sitemap (`@astrojs/sitemap`)
- [ ] Favicon

### Definition of done

Phase 1 is done when the homepage loads on clumanlan.com with the hero, project card, and blog teaser visible, and a push to `main` triggers an auto-deploy.

The site is "v1 complete" when one real D3 blog post is live and the scaffold workflow is proven end-to-end (end of Phase 3).

---

## Decisions log

- **2025-07-24** — Project scoped via alignment session. Stack, design tokens, site structure, content schemas, and phased plan locked.

---

## Open questions

- What is the final GitHub repo URL for the MLB Baseball System?
- What is the final demo URL for the MLB Baseball System?
- Custom domain — `carlylelumanlan.dev` or `clumanlan.dev`? (deferred, swap in via Vercel dashboard)

---

## Deliberately deferred

- Dark mode — adds D3 color complexity, no clear benefit now
- /about page — homepage hero is sufficient for now
- CMS — MDX files + Claude Code is faster for a single author
- Custom domain — zero code change to add later via Vercel
- Multiple projects — schema already supports it, add when ready
- Search — not needed until there are many posts
- Comments — not needed for v1
