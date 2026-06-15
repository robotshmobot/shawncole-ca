import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const contentSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  tags: z.array(z.string()).optional(),
  image: z.string().optional(),
  color: z.string().optional(),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: contentSchema,
});

const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/case-studies' }),
  schema: contentSchema,
});

const stories = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/stories' }),
  schema: contentSchema,
});

export const collections = { blog, 'case-studies': caseStudies, stories };
