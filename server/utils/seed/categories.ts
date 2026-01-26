import { drizzle } from 'drizzle-orm/better-sqlite3'
import { eq } from 'drizzle-orm'
import Database from 'better-sqlite3'
import * as schema from '../../database/schema.js'

const { categories } = schema

// Initialize database for seeding
const sqlite = new Database('./.data/hub.db')
const db = drizzle(sqlite, { schema })

function useDB() {
  return db
}

/**
 * Seed categories for the marketplace
 * Run with: npx jiti server/utils/seed/categories.ts
 */

const SEED_CATEGORIES = [
  {
    name: 'Forms',
    slug: 'forms',
    description: 'Input forms, login, signup, contact, checkout components',
    icon: 'FileText',
    order: 1,
  },
  {
    name: 'Navigation',
    slug: 'navigation',
    description: 'Headers, footers, sidebars, breadcrumbs, menus, tabs',
    icon: 'Navigation',
    order: 2,
  },
  {
    name: 'Data Display',
    slug: 'data-display',
    description: 'Tables, lists, cards, charts, data visualization',
    icon: 'BarChart3',
    order: 3,
  },
  {
    name: 'Feedback',
    slug: 'feedback',
    description: 'Alerts, notifications, toasts, modals, confirmations',
    icon: 'MessageSquare',
    order: 4,
  },
  {
    name: 'Layout',
    slug: 'layout',
    description: 'Grids, containers, dividers, sections, spacing',
    icon: 'Layout',
    order: 5,
  },
  {
    name: 'Overlay',
    slug: 'overlay',
    description: 'Dialogs, popovers, tooltips, dropdowns, drawers',
    icon: 'Square',
    order: 6,
  },
  {
    name: 'Media',
    slug: 'media',
    description: 'Images, videos, carousels, galleries, lightboxes',
    icon: 'Image',
    order: 7,
  },
  {
    name: 'Typography',
    slug: 'typography',
    description: 'Headings, text blocks, badges, labels, formatting',
    icon: 'Type',
    order: 8,
  },
  {
    name: 'E-commerce',
    slug: 'ecommerce',
    description: 'Product cards, checkout flows, pricing tables, carts',
    icon: 'ShoppingCart',
    order: 9,
  },
  {
    name: 'Marketing',
    slug: 'marketing',
    description: 'Hero sections, CTAs, testimonials, pricing pages',
    icon: 'Megaphone',
    order: 10,
  },
]

export async function seedCategories() {
  const db = useDB()

  console.log('🌱 Seeding categories...')

  for (const category of SEED_CATEGORIES) {
    const existing = await db.select().from(categories).where(eq(categories.slug, category.slug)).get()

    if (existing) {
      console.log(`  ⏭️  Category "${category.name}" already exists`)
      continue
    }

    await db.insert(categories).values(category)
    console.log(`  ✅ Created category: ${category.name}`)
  }

  console.log('✨ Categories seeded successfully!')
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedCategories().catch(console.error)
}
