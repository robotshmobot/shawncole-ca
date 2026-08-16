import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const contentSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  tags: z.array(z.string()).optional(),
  image: z.string().nullable().optional(),
  'alt-text': z.string().optional(),
  'executive-summary': z.string().optional(),
  context: z.string().optional(),
  role: z.string().optional(),
  projectDate: z.string().optional(),
});

const cvSchema = z.object({
  company: z.string(),
  description: z.string(),
  role: z.string(),
  dates: z.string(),
  location: z.string().optional(),
  url: z.string().optional(),
  date: z.coerce.date(),
  image: z.string().nullable().optional(),
});

const playgroundSchema = z.object({
  title: z.string(),
  designation: z.string(),
  description: z.string(),
  link: z.string(),
  image: z.string(),
  context: z.string(),
  date: z.coerce.date(),
  warning: z.string().optional(),
});

const siteSchema = z.object({
  destinations: z.array(z.string()),
});

const site = defineCollection({
  loader: glob({ pattern: 'site.md', base: './src/shawncole-ca' }),
  schema: siteSchema,
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

const cv = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/shawncole-ca/cv' }),
  schema: cvSchema,
});

export const collections = { site, 'case-studies': caseStudies, futures, ideas, playground, cv };
