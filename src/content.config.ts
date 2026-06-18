import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const contentSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  tags: z.array(z.string()).optional(),
  image: z.string().nullable().optional(),
  color: z.string().optional(),
  'alt-text': z.string().optional(),
  customStyles: z.string().optional(),
  fontPairing: z.enum(['serif-sans', 'mono-serif', 'mono-sans', 'hand-sans', 'hand-serif']).optional(),
  hideTitle: z.boolean().nullable().optional(),
  footer: z.string().optional(),
});

const playgroundSchema = z.object({
  title: z.string(),
  designation: z.string(),
  description: z.string(),
  link: z.string(),
  image: z.string(),
  tag: z.string(),
  date: z.coerce.date(),
  warning: z.string().optional(),
});

const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/shawncole-ca/case-studies' }),
  schema: contentSchema,
});

const futures = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/shawncole-ca/futures' }),
  schema: contentSchema,
});

const ideas = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/shawncole-ca/ideas' }),
  schema: contentSchema,
});

const playground = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/shawncole-ca/playground' }),
  schema: playgroundSchema,
});

export const collections = { 'case-studies': caseStudies, futures, ideas, playground };
