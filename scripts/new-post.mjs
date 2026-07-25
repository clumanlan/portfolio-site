import { mkdirSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const args = process.argv.slice(2);
const slugIndex = args.indexOf('--slug');
if (slugIndex === -1 || !args[slugIndex + 1]) {
  console.error('Usage: npm run new-post -- --slug "my-post-title"');
  process.exit(1);
}

const slug = args[slugIndex + 1].toLowerCase().replace(/\s+/g, '-');
const today = new Date().toISOString().split('T')[0];
const dir = join(process.cwd(), 'src/content/blog', slug);

if (existsSync(dir)) {
  console.error(`Post already exists: ${dir}`);
  process.exit(1);
}

mkdirSync(dir, { recursive: true });

writeFileSync(
  join(dir, 'index.mdx'),
  `---
title: "${slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}"
date: "${today}"
description: "One or two sentences describing this post."
tags: ["mlops"]
draft: true
---

import Chart from './Chart.tsx'

## Introduction

Write your intro here.

## Section

More content.

<div class="full-bleed">
  <Chart client:load />
</div>
`
);

writeFileSync(
  join(dir, 'Chart.tsx'),
  `import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function Chart() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const { width } = ref.current.getBoundingClientRect();
    const height = 400;

    const svg = d3.select(ref.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    // Your D3 code here

    const ro = new ResizeObserver(() => {
      d3.select(ref.current).select('svg').remove();
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  return <div ref={ref} style={{ width: '100%' }} />;
}
`
);

console.log(`Created post: src/content/blog/${slug}/`);
console.log(`  index.mdx — edit draft: true → false when ready to publish`);
console.log(`  Chart.tsx  — D3 component starter`);
