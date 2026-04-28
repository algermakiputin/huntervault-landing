import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://huntervault.app',
  output: 'static',
  integrations: [
    mdx(),
    sitemap({
      customPages: [
        'https://huntervault.app/',
        'https://huntervault.app/privacy-policy.html',
      ],
    }),
  ],
});
