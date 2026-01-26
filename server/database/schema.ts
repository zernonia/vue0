import type { AnySQLiteColumn } from 'drizzle-orm/sqlite-core'
import { blob, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'
import { init } from '@paralleldrive/cuid2'

const createId = init({
  length: 12,
})

// ============================================================================
// EXISTING TABLES (EXTENDED)
// ============================================================================

export const users = sqliteTable('users', {
  id: integer('id').notNull().primaryKey(),
  email: text('email').notNull(),
  name: text('name'),
  avatarUrl: text('avatar_url'),
  // Marketplace extensions
  role: text('role').$default(() => 'user'), // user, creator, moderator, admin
  bio: text('bio'),
  website: text('website'),
  twitter: text('twitter'),
  isVerified: integer('is_verified', { mode: 'boolean' }).$default(() => false),
  componentsPublished: integer('components_published').$default(() => 0),
  totalLikes: integer('total_likes').$default(() => 0),
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
  // Marketplace extensions
  visibility: text('visibility').$default(() => 'private'), // private, public, unlisted
  marketplaceId: text('marketplace_id'),
  designTokens: text('design_tokens', { mode: 'json' }),
})

export const images = sqliteTable('images', {
  id: text('id').primaryKey(),
  buffer: blob('buffer', { mode: 'buffer' }),
})

// ============================================================================
// MARKETPLACE TABLES
// ============================================================================

export const marketplaceComponents = sqliteTable('marketplace_components', {
  id: text('id').$defaultFn(() => createId()).primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  longDescription: text('long_description'),
  componentId: text('component_id'),
  authorId: integer('author_id').references(() => users.id),
  status: text('status').notNull().$default(() => 'draft'), // draft, pending, approved, rejected, featured
  isFeatured: integer('is_featured', { mode: 'boolean' }).$default(() => false),
  category: text('category').notNull(),
  license: text('license').$default(() => 'MIT'),
  version: text('version').$default(() => '1.0.0'),
  previewUrl: text('preview_url'),
  repositoryUrl: text('repository_url'),
  publishedAt: integer('published_at', { mode: 'timestamp_ms' }),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).$defaultFn(() => Date.now()),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).$defaultFn(() => Date.now()),
  metadata: text('metadata', { mode: 'json' }),
})

export const categories = sqliteTable('categories', {
  id: text('id').$defaultFn(() => createId()).primaryKey(),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  icon: text('icon'), // lucide icon name
  parentId: text('parent_id'),
  order: integer('order').$default(() => 0),
})

export const tags = sqliteTable('tags', {
  id: text('id').$defaultFn(() => createId()).primaryKey(),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  type: text('type').notNull(), // style, framework, feature, use-case
  color: text('color'),
  count: integer('count').$default(() => 0),
})

export const componentTags = sqliteTable('component_tags', {
  id: text('id').$defaultFn(() => createId()).primaryKey(),
  componentId: text('component_id').references(() => marketplaceComponents.id),
  tagId: text('tag_id').references(() => tags.id),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).$defaultFn(() => Date.now()),
})

export const componentStats = sqliteTable('component_stats', {
  id: text('id').$defaultFn(() => createId()).primaryKey(),
  componentId: text('component_id').references(() => marketplaceComponents.id).unique(),
  views: integer('views').$default(() => 0),
  likes: integer('likes').$default(() => 0),
  downloads: integer('downloads').$default(() => 0),
  forks: integer('forks').$default(() => 0),
  lastViewedAt: integer('last_viewed_at', { mode: 'timestamp_ms' }),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).$defaultFn(() => Date.now()),
})

export const userLikes = sqliteTable('user_likes', {
  id: text('id').$defaultFn(() => createId()).primaryKey(),
  userId: integer('user_id').references(() => users.id),
  componentId: text('component_id').references(() => marketplaceComponents.id),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).$defaultFn(() => Date.now()),
})

export const customizations = sqliteTable('customizations', {
  id: text('id').$defaultFn(() => createId()).primaryKey(),
  baseComponentId: text('base_component_id').references(() => marketplaceComponents.id),
  userId: integer('user_id').references(() => users.id),
  customizationType: text('customization_type').notNull(), // visual-editor, ai-prompt, hybrid
  designTokens: text('design_tokens', { mode: 'json' }),
  aiPrompt: text('ai_prompt'),
  resultComponentId: text('result_component_id'),
  status: text('status').notNull().$default(() => 'pending'), // pending, completed, failed
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).$defaultFn(() => Date.now()),
  completedAt: integer('completed_at', { mode: 'timestamp_ms' }),
})

export const submissions = sqliteTable('submissions', {
  id: text('id').$defaultFn(() => createId()).primaryKey(),
  componentId: text('component_id').references(() => marketplaceComponents.id),
  userId: integer('user_id').references(() => users.id),
  status: text('status').notNull().$default(() => 'submitted'), // submitted, under_review, approved, rejected, changes_requested
  reviewerId: integer('reviewer_id').references(() => users.id),
  reviewNotes: text('review_notes'),
  submittedAt: integer('submitted_at', { mode: 'timestamp_ms' }).$defaultFn(() => Date.now()),
  reviewedAt: integer('reviewed_at', { mode: 'timestamp_ms' }),
})

// ============================================================================
// RELATIONS
// ============================================================================

export const usersRelations = relations(users, ({ many }) => ({
  components: many(components),
  marketplaceComponents: many(marketplaceComponents),
  likes: many(userLikes),
  customizations: many(customizations),
  submissions: many(submissions),
}))

export const componentsRelations = relations(components, ({ one }) => ({
  user: one(users, {
    fields: [components.userId],
    references: [users.id],
  }),
  basedOn: one(components, {
    fields: [components.basedOnId],
    references: [components.id],
  }),
}))

export const marketplaceComponentsRelations = relations(marketplaceComponents, ({ one, many }) => ({
  author: one(users, {
    fields: [marketplaceComponents.authorId],
    references: [users.id],
  }),
  component: one(components, {
    fields: [marketplaceComponents.componentId],
    references: [components.id],
  }),
  tags: many(componentTags),
  stats: one(componentStats),
  likes: many(userLikes),
  customizations: many(customizations),
  submission: one(submissions),
}))

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
  }),
  children: many(categories),
}))

export const tagsRelations = relations(tags, ({ many }) => ({
  componentTags: many(componentTags),
}))

export const componentTagsRelations = relations(componentTags, ({ one }) => ({
  component: one(marketplaceComponents, {
    fields: [componentTags.componentId],
    references: [marketplaceComponents.id],
  }),
  tag: one(tags, {
    fields: [componentTags.tagId],
    references: [tags.id],
  }),
}))

export const componentStatsRelations = relations(componentStats, ({ one }) => ({
  component: one(marketplaceComponents, {
    fields: [componentStats.componentId],
    references: [marketplaceComponents.id],
  }),
}))

export const userLikesRelations = relations(userLikes, ({ one }) => ({
  user: one(users, {
    fields: [userLikes.userId],
    references: [users.id],
  }),
  component: one(marketplaceComponents, {
    fields: [userLikes.componentId],
    references: [marketplaceComponents.id],
  }),
}))

export const customizationsRelations = relations(customizations, ({ one }) => ({
  baseComponent: one(marketplaceComponents, {
    fields: [customizations.baseComponentId],
    references: [marketplaceComponents.id],
  }),
  user: one(users, {
    fields: [customizations.userId],
    references: [users.id],
  }),
  resultComponent: one(components, {
    fields: [customizations.resultComponentId],
    references: [components.id],
  }),
}))

export const submissionsRelations = relations(submissions, ({ one }) => ({
  component: one(marketplaceComponents, {
    fields: [submissions.componentId],
    references: [marketplaceComponents.id],
  }),
  user: one(users, {
    fields: [submissions.userId],
    references: [users.id],
  }),
  reviewer: one(users, {
    fields: [submissions.reviewerId],
    references: [users.id],
  }),
}))
