import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const contentSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  tags: z.array(z.string()).optional(),
  image: z.string().optional(),
  color: z.string().optional(),
  customStyles: z.string().optional(),
  cardCustomStyles: z.string().optional(),
  vibe: z.enum(['contained-box', 'binary-split', 'saturated-field',
                'column-strips', 'circle-reveal', 'raw-frame',
                'type-wall', 'data-dense', 'stripe-rhythm', 'dot-screen']).optional(),
  vibeProps: z.record(z.string()).optional(),
  span: z.enum(['1', '2', '3']).optional(),
  fontPairing: z.enum(['serif-sans', 'mono-serif', 'mono-sans']).optional(),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/shawncole-ca/blog' }),
  schema: contentSchema,
});

const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/shawncole-ca/case-studies' }),
  schema: contentSchema,
});

const stories = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/shawncole-ca/stories' }),
  schema: contentSchema,
});

const futures = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/shawncole-ca/futures' }),
  schema: contentSchema,
});

export const collections = { blog, 'case-studies': caseStudies, stories, futures };
