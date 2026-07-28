# CLAUDE.md

> Auto-loaded by Claude Code at session start. Full context in README.md.

## Project

Personal portfolio and blog for Carlyle Lumanlan — data scientist transitioning into ML engineering. One project showcase, a D3-powered blog, built to be extended over time.

- **URL**: clumanlan.com (Vercel, auto-deploys from main)
- **Repo**: github.com/clumanlan/portfolio-site

## Stack

- **Framework**: Astro 7 + TypeScript strict
- **Styling**: Tailwind CSS v4
- **Blog**: MDX with co-located D3 components
- **Hosting**: Vercel

## Design tokens (never deviate from these)

- **Heading font**: Fraunces (Google Fonts)
- **Body font**: Inter (Google Fonts)
- **Accent color**: Dark mint — `#1a7a5e` (links, active nav, tags, hover states); tag background `#e0f5ec`
- **Mode**: Light only
- **Nav**: Projects + Blog right only — no name in nav (name lives in hero h1); GitHub + LinkedIn in footer
- **No dark mode, no logo, no decorative elements**

## Site structure

```
/                  → hero (name + tagline) + project card
/blog              → filterable post list (filter by tag, client-side)
/blog/[slug]       → MDX post, sticky TOC left, narrow text column, D3 breaks to full width
```

No /about page. No /projects page. Everything lives on the homepage.

## Content collections (src/content/)

Config lives at `src/content.config.ts` (Astro v7 — NOT `src/content/config.ts`). Uses glob loaders.

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

For full-width D3 breakouts:
```mdx
<div class="full-bleed">
  <Chart client:load />
</div>
```

D3 visualizations must be responsive — use `ResizeObserver` or `useEffect` with a ref, never hardcode width/height.

## Homepage project card

The single featured project (MLB Baseball System) displays:
- Title, description, tech stack tags, GitHub link
- `featured: true` in frontmatter drives inclusion — no hardcoding
- Demo URL is a placeholder — update `src/content/projects/mlb-baseball.md` when ready

## Blog filtering

Client-side only — no server, no API. Tags from frontmatter drive the filter UI. Active tag highlights in mint. "All" is the default state.

## Current status

**v1 complete** — all four phases shipped and live at clumanlan.com.

- Phase 1 ✅ Foundation
- Phase 2 ✅ Blog
- Phase 3 ✅ First post (NGBoost — point predictions vs probability distributions)
- Phase 4 ✅ Polish (meta tags, sitemap, favicon, typography)
- Domain ✅ clumanlan.com

## Deliberately deferred

- Dark mode
- /about page
- CMS (all content is MDX files for now)
- Multiple projects (add more cards when ready, schema already supports it)
- Search
- Comments

## See README.md for full context.
