import { desc, eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id ?? ''
  const { components, users } = tables

  const res = await useDB()
  // @ts-expect-error fetch latest components
    .select({
      ...components,
      user: users,
    })
    .from(components)
    .leftJoin(users, eq(components.userId, users.id))
    .orderBy(desc(components.createdAt))
    .where(eq(components.id, id))
  return res
})
