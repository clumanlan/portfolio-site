// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [mdx(), react()],

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@blog': new URL('./src/content/blog', import.meta.url).pathname,
      },
    },
  }
});