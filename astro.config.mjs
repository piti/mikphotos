import { defineConfig } from 'astro/config';

// Deployed to GitHub Pages project site: https://piti.github.io/mikphotos/
// When a custom domain is added later, set site to it and remove `base`.
export default defineConfig({
  site: 'https://piti.github.io',
  base: '/mikphotos',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
});
