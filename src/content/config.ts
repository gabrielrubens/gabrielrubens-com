import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const palette = z.object({
  bg: z.string(),
  ink: z.string(),
  ink2: z.string(),
  dot: z.string(),
  mark: z.string(),
  accent: z.string(),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    status: z.enum(['live', 'beta', 'building', 'paused']),
    url: z.string().url().optional(),
    stack: z.array(z.string()),
    platforms: z.string().optional(),
    launched: z.string().optional(),
    now: z.string().optional(),
    category: z.string().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(100),
    icon: z.string().optional(),
    palette,
  }),
});

const writing = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { projects, writing };
