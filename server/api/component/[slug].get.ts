import { desc, eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const slug = event.context.params?.slug ?? ''
  const { components } = tables

  const res = await useDB()
    .select()
    .from(components)
    .orderBy(desc(components.createdAt))
    .where(eq(components.slug, slug))
  return res
})
