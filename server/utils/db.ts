import { drizzle } from 'drizzle-orm/d1'
import * as schema from '~/server/database/schema'

export * as tables from '~/server/database/schema'

// Type exports for convenience
export type DBComponent = typeof schema.components.$inferSelect & {
  user?: typeof schema.users.$inferSelect
}

export type DBMarketplaceComponent = typeof schema.marketplaceComponents.$inferSelect & {
  author?: typeof schema.users.$inferSelect
  stats?: typeof schema.componentStats.$inferSelect
}

let _db: ReturnType<typeof drizzle> | null = null

/**
 * Get database instance using NuxtHub
 * Works in both development (fs driver) and production (D1)
 */
export function useDB() {
  if (!_db) {
    // Use NuxtHub's database which handles both dev and prod
    _db = drizzle(hubDatabase(), { schema })
  }
  return _db
}
