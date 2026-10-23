import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders'; // FIX: Import the required modern loader

// Define your collection using the modern glob loader rules
const gamesCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/games' }), // FIX: Directs Astro to scan your folder
  schema: z.object({
    gameId: z.string(),
    title: z.string(),
    type: z.string(), // "rules" or "cards"
  })
});

// Export cleanly for your index page to read
export const collections = {
  'games': gamesCollection,
};