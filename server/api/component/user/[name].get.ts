import { and, desc, eq, max } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const name = event.context.params?.name ?? ''
  const { components, users } = tables

  const res = await useDB()
  // @ts-expect-error fetch latest components
    .select({
      ...components,
      value: max(components.createdAt),
      user: users,
    })
    .from(components)
    .leftJoin(users, eq(components.userId, users.id))
    .orderBy(desc(components.createdAt))
    .groupBy(components.slug)
    .where(and(eq(users.name, name), eq(components.completed, true)))
  return res
})
