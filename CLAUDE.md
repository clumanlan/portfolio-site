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

Follows the `dataviz-portfolio-style` skill — editorial system built around chart conventions, Van Gogh-derived data palette.

- **Paper/ink/rule/muted**: `--color-paper #F3F4F1`, `--color-ink #1C1F24`, `--color-rule #D8DAD3`, `--color-muted #6E7168`
- **Data palette** (chart use only): `--color-petrol-teal #2E5C57`, `--color-vangogh-navy #28304F`, `--color-wheat-gold #A9863E`, `--color-olive #5B6B3E`, `--color-terracotta #B66C53`, `--color-cloud-grey #8A97A6`
- **Body font**: Inter (Google Fonts)
- **Data font**: Space Mono — numbers, stats, dates, chart labels only, never prose
- **Headline fonts**: plain bold Inter is the default for all headers. Nav name uses Sue Ellen Francisco (uppercase via CSS `text-transform`, not literal caps — avoids screen readers spelling it out) — **this typeface is outside the skill's defined set (Inter/Space Mono/Permanent Marker/Kalam), added by explicit user request.** Kalam and Permanent Marker are loaded but currently unused.
- **Links**: ink text, rule-colored underline (darkens to ink on hover); no separate accent color
- **Mode**: Light only
- **Nav**: name (Sue Ellen Francisco, uppercase, plain link, no underline) top left; Projects + Blog top right; GitHub + LinkedIn in footer
- **No dark mode, no logo**; structure via hairline rules and spacing, not boxes/cards — see skill for the no-boxing rule

## Site structure

```
/                  → project card only (name lives in nav, no hero)
/blog              → post list (date, title, description) — no tags, no filtering
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
demo: string          // URL, optional — omit if there's no live demo
featured: boolean     // true = shown on homepage
```

## Writing rules (blog posts and all site copy)

- **Never use em-dashes (—), en-dashes (–), or double hyphens (`--`) in prose.** Use periods, commas, colons, semicolons, or parentheses instead.
- When editing an existing post, keep the author's wording and voice. Change only what was asked.

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

## Homepage project cards

Each project with `featured: true` renders as a card:
- Title, description, tech stack tags, GitHub link, demo link (if `demo` is set)
- `featured: true` in frontmatter drives inclusion — no hardcoding
- Currently featured: MLB Prop Research System, AP Lit Essay Grader

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
- Search
- Comments

## See README.md for full context.
