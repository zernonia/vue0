import { seedCategories } from './categories'
import { seedTags } from './tags'

/**
 * Run all seed scripts
 * Usage: npx jiti server/utils/seed/index.ts
 */

async function seedAll() {
  console.log('🌱 Starting database seeding...\n')

  try {
    await seedCategories()
    console.log('')
    await seedTags()
    console.log('')
    console.log('✅ All seed data inserted successfully!')
  }
  catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedAll()
}

export { seedAll }
