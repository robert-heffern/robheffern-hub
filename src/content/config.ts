import { defineCollection, z } from 'astro:content';

const essays = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    category: z.string(),
    idea: z.string().optional(),
    excerpt: z.string().optional(),
  }),
});

export const collections = { essays };
