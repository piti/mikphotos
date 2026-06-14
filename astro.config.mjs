import { defineConfig } from 'astro/config';

// Custom domain (Namecheap): miktakesflicks.online — served at the root, so no `base`.
// public/CNAME tells GitHub Pages the custom domain on each deploy.
export default defineConfig({
  site: 'https://miktakesflicks.online',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
});
