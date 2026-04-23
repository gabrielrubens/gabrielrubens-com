import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  site: 'https://gabrielrubens.com',
  trailingSlash: 'never',

  build: {
    format: 'directory',
  },

  integrations: [sitemap()],
  adapter: cloudflare()
});