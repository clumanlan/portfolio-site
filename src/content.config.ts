import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/index.mdx', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    description: z.string(),
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    stack: z.array(z.string()),
    github: z.string().url(),
    demo: z.string().url(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { blog, projects };
