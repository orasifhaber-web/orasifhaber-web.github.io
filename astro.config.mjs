import { defineConfig } from 'astro/config';

// Set SITE_URL to the final domain before deploying (used for canonical URLs, Open Graph and the sitemap).
export default defineConfig({
  site: process.env.SITE_URL || 'http://localhost:4321',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
});
