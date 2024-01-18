import type { AnySQLiteColumn } from 'drizzle-orm/sqlite-core'
import { blob, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { init } from '@paralleldrive/cuid2'

const createId = init({
  length: 12,
})

export const users = sqliteTable('users', {
  id: integer('id').notNull().primaryKey(),
  email: text('email').notNull(),
  name: text('name'),
  avatarUrl: text('avatar_url'),
})

export const components = sqliteTable('components', {
  id: text('id').$defaultFn(() => createId()).primaryKey(),
  slug: text('slug').$defaultFn(() => createId()),
  description: text('description').notNull(),
  code: text('code'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).$default(() => new Date()),
  userId: integer('user_id').references(() => users.id),
  metadata: text('metadata', { mode: 'json' }),
  completed: integer('completed', { mode: 'boolean' }),
  error: text('error'),
  basedOnId: text('based_on_id').references((): AnySQLiteColumn => components.id),
})

export const images = sqliteTable('images', {
  id: text('id').primaryKey(),
  buffer: blob('buffer', { mode: 'buffer' }),
})
