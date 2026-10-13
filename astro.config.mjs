import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://stuartlee.dev',
  output: 'static',
  trailingSlash: 'always',
  i18n: { defaultLocale: 'en', locales: ['en', 'de'] },
  // The view-source achievement depends on retaining its HTML comment.
  compressHTML: false,
});
