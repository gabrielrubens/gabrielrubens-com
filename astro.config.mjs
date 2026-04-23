import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://gabrielrubens.com',
  trailingSlash: 'never',
  build: {
    format: 'directory',
  },
});
