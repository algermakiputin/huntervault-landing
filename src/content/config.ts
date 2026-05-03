import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    category: z.enum(['Finance Tips', 'Guide', 'Update', 'Story']),
    readTime: z.string(),
    featured: z.boolean().default(false),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    dateModified: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    faq: z.array(z.object({
      q: z.string(),
      a: z.string(),
    })).optional(),
  }),
});

export const collections = { blog };
