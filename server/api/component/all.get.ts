import { desc } from 'drizzle-orm'

export default defineEventHandler(async (_event) => {
  const { components } = tables
  const res = await useDB()
    .select()
    .from(components)
    .orderBy(desc(components.createdAt))
    .all()
  return res
})
