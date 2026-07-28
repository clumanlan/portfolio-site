# CLAUDE.md

> Auto-loaded by Claude Code at session start. Full context in README.md.

## Project

Personal portfolio and blog for Carlyle Lumanlan — data scientist transitioning into ML engineering. One project showcase, a D3-powered blog, built to be extended over time.

- **URL**: clumanlan.vercel.app (Vercel, auto-deploys from main)
- **Repo**: github.com/clumanlan/portfolio

## Stack

- **Framework**: Astro + TypeScript
- **Styling**: Tailwind CSS
- **Blog**: MDX with co-located D3 components
- **Hosting**: Vercel

## Design tokens (never deviate from these)

- **Heading font**: Fraunces (Google Fonts)
- **Body font**: Inter (Google Fonts)
- **Accent color**: Dark mint — `#1a7a5e` (links, active nav, tags, hover states); tag background `#e0f5ec`
- **Mode**: Light only
- **Nav**: Minimal top bar — name (black) left, Projects + Blog right; GitHub + LinkedIn in footer bottom right
- **No dark mode, no logo, no decorative elements**

## Site structure

```
/                  → hero + project card + blog teaser
/blog              → filterable post list (filter by tag, client-side)
/blog/[slug]       → MDX post, sticky TOC left, narrow text column, D3 breaks to full width
```

No /about page. No /projects page. Everything lives on the homepage.

## Content collections (src/content/)

### Blog posts — src/content/blog/[slug]/
Each post is a folder containing:
- `index.mdx` — the post content
- `[ComponentName].tsx` — co-located D3 component(s), imported in the MDX

Frontmatter schema:
```ts
title: string
date: string          // ISO format: "2025-06-01"
description: string   // 1-2 sentences, shown in post list
tags: string[]        // e.g. ["mlops", "data-viz", "systems"]
draft: boolean        // true = excluded from build
```

### Projects — src/content/projects/
Each project is a single `.md` file.

Frontmatter schema:
```ts
title: string
description: string   // 2-3 sentences
stack: string[]       // e.g. ["Python", "PyTorch", "AWS SageMaker"]
github: string        // URL
demo: string          // URL
featured: boolean     // true = shown on homepage
```

## D3 blog post workflow

To create a new post:
```bash
npm run new-post -- --slug "my-post-title"
```

This scaffolds:
- `src/content/blog/my-post-title/index.mdx` with frontmatter pre-filled
- `src/content/blog/my-post-title/Chart.tsx` as the D3 component starter

D3 components are Astro islands — always include `client:load` when importing in MDX.
Use the `@blog` alias (not a relative path — Astro v7's content layer can't resolve those):
```mdx
import Chart from '@blog/my-post-title/Chart.tsx'
<Chart client:load />
```

D3 vizualizations must be responsive — use `ResizeObserver` or `useEffect` with a ref, never hardcode width/height.

## Homepage project card

The single featured project (MLB Baseball System) displays:
- Title
- Short description
- Tech stack tags: Python, NGBoost, PyTorch, AWS SageMaker, S3, Feature Store
- Links: GitHub (`https://github.com/clumanlan/mlb-system`) and Demo (`https://mlb-demo.vercel.app`)
- `featured: true` in frontmatter drives inclusion — no hardcoding

## Blog filtering

Client-side only — no server, no API. Tags from frontmatter drive the filter UI. Active tag highlights in mint. "All" is the default state.

## Current phase

**Phase 1 — Foundation** (implement this first)
- Astro project scaffolded with TypeScript + Tailwind + MDX
- Google Fonts loaded (Fraunces + Inter)
- Mint accent CSS variables defined in global styles
- Minimal top nav component
- Homepage with hero, project card, blog teaser section
- Content collection schemas defined and validated
- Deployed to Vercel

Kill criteria: if Astro + MDX + D3 island hydration can't be made to work cleanly, evaluate Next.js + MDX as fallback before proceeding.

## Planned phases

- **Phase 2 — Blog**: /blog list page with tag filtering, /blog/[slug] post page with sticky TOC, full-width D3 breakout, new-post scaffold script
- **Phase 3 — First post**: one real D3 blog post end-to-end to validate the workflow
- **Phase 4 — Polish**: typography refinement, spacing pass, meta tags, OG images, sitemap

## Deliberately deferred

- Dark mode
- /about page
- CMS (all content is MDX files for now)
- Custom domain (swap in via Vercel dashboard, zero code change)
- Multiple projects (add more cards when ready, schema already supports it)
- Search
- Comments

## See README.md for full context.
