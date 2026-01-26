import { drizzle } from 'drizzle-orm/better-sqlite3'
import { eq } from 'drizzle-orm'
import Database from 'better-sqlite3'
import * as schema from '../../database/schema.js'

const { tags } = schema

// Initialize database for seeding
const sqlite = new Database('./.data/hub.db')
const db = drizzle(sqlite, { schema })

function useDB() {
  return db
}

/**
 * Seed tags for the marketplace
 * Run with: npx jiti server/utils/seed/tags.ts
 */

const SEED_TAGS = [
  // Style tags
  {
    name: 'Minimal',
    slug: 'minimal',
    type: 'style',
    color: 'gray',
  },
  {
    name: 'Glassmorphic',
    slug: 'glassmorphic',
    type: 'style',
    color: 'blue',
  },
  {
    name: 'Neumorphic',
    slug: 'neumorphic',
    type: 'style',
    color: 'purple',
  },
  {
    name: 'Gradient',
    slug: 'gradient',
    type: 'style',
    color: 'pink',
  },
  {
    name: 'Brutalist',
    slug: 'brutalist',
    type: 'style',
    color: 'red',
  },
  {
    name: 'Modern',
    slug: 'modern',
    type: 'style',
    color: 'blue',
  },
  {
    name: 'Classic',
    slug: 'classic',
    type: 'style',
    color: 'gray',
  },

  // Framework tags
  {
    name: 'shadcn-vue',
    slug: 'shadcn-vue',
    type: 'framework',
    color: 'green',
  },
  {
    name: 'RadixVue',
    slug: 'radix-vue',
    type: 'framework',
    color: 'purple',
  },
  {
    name: 'Headless UI',
    slug: 'headless-ui',
    type: 'framework',
    color: 'cyan',
  },
  {
    name: 'Nuxt UI',
    slug: 'nuxt-ui',
    type: 'framework',
    color: 'green',
  },

  // Feature tags
  {
    name: 'Dark Mode',
    slug: 'dark-mode',
    type: 'feature',
    color: 'gray',
  },
  {
    name: 'Responsive',
    slug: 'responsive',
    type: 'feature',
    color: 'blue',
  },
  {
    name: 'Animated',
    slug: 'animated',
    type: 'feature',
    color: 'purple',
  },
  {
    name: 'Accessible',
    slug: 'accessible',
    type: 'feature',
    color: 'green',
  },
  {
    name: 'Interactive',
    slug: 'interactive',
    type: 'feature',
    color: 'orange',
  },
  {
    name: 'RTL Support',
    slug: 'rtl-support',
    type: 'feature',
    color: 'blue',
  },
  {
    name: 'Keyboard Navigation',
    slug: 'keyboard-nav',
    type: 'feature',
    color: 'purple',
  },

  // Use-case tags
  {
    name: 'Dashboard',
    slug: 'dashboard',
    type: 'use-case',
    color: 'blue',
  },
  {
    name: 'Landing Page',
    slug: 'landing-page',
    type: 'use-case',
    color: 'purple',
  },
  {
    name: 'SaaS',
    slug: 'saas',
    type: 'use-case',
    color: 'green',
  },
  {
    name: 'Portfolio',
    slug: 'portfolio',
    type: 'use-case',
    color: 'pink',
  },
  {
    name: 'Blog',
    slug: 'blog',
    type: 'use-case',
    color: 'orange',
  },
  {
    name: 'E-commerce',
    slug: 'ecommerce',
    type: 'use-case',
    color: 'green',
  },
  {
    name: 'Admin Panel',
    slug: 'admin-panel',
    type: 'use-case',
    color: 'red',
  },
  {
    name: 'Mobile App',
    slug: 'mobile-app',
    type: 'use-case',
    color: 'blue',
  },
]

export async function seedTags() {
  const db = useDB()

  console.log('🌱 Seeding tags...')

  for (const tag of SEED_TAGS) {
    const existing = await db.select().from(tags).where(eq(tags.slug, tag.slug)).get()

    if (existing) {
      console.log(`  ⏭️  Tag "${tag.name}" already exists`)
      continue
    }

    await db.insert(tags).values(tag)
    console.log(`  ✅ Created tag: ${tag.name} (${tag.type})`)
  }

  console.log('✨ Tags seeded successfully!')
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedTags().catch(console.error)
}
