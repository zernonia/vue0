import { desc, eq, max } from 'drizzle-orm'

export default defineEventHandler(async (_event) => {
  const { components, users } = tables
  const res = await useDB()
    // @ts-expect-error fetch latest components
    .select({
      ...components,
      user: users,
      value: max(components.createdAt),
    })
    .from(components)
    .leftJoin(users, eq(components.userId, users.id))
    .orderBy(desc(components.createdAt))
    .groupBy(components.slug)
    .all()

  return res
})
