// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://calcverse-production.up.railway.app',
  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes('/embed/'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});