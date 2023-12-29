import { desc, max } from 'drizzle-orm'

export default defineEventHandler(async (_event) => {
  const { components } = tables
  const res = await useDB()
  // @ts-expect-error fetch latest components
    .select({
      ...components,
      value: max(components.createdAt),
    })
    .from(components)
    .orderBy(desc(components.createdAt))
    .groupBy(components.slug)
    .all()

  return res
})
