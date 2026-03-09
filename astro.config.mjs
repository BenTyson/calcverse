// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: 'https://calcfalcon.com',
  adapter: node({ mode: 'standalone' }),
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