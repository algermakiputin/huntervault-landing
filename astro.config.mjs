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
        'https://huntervault.app/privacy-policy.html',
      ],
      serialize(item) {
        const url = item.url;
        if (url === 'https://huntervault.app/')
          return { ...item, changefreq: 'weekly',  priority: 1.0 };
        if (url === 'https://huntervault.app/features/')
          return { ...item, changefreq: 'monthly', priority: 0.9 };
        if (url === 'https://huntervault.app/safe-to-spend/')
          return { ...item, changefreq: 'monthly', priority: 0.85 };
        if (url === 'https://huntervault.app/faq/')
          return { ...item, changefreq: 'monthly', priority: 0.85 };
        if (url === 'https://huntervault.app/about/')
          return { ...item, changefreq: 'monthly', priority: 0.8 };
        if (url === 'https://huntervault.app/contact/')
          return { ...item, changefreq: 'monthly', priority: 0.7 };
        if (url === 'https://huntervault.app/blog/')
          return { ...item, changefreq: 'weekly',  priority: 0.8 };
        if (url.startsWith('https://huntervault.app/blog/'))
          return { ...item, changefreq: 'monthly', priority: 0.7 };
        return { ...item, changefreq: 'yearly', priority: 0.5 };
      },
    }),
  ],
});
