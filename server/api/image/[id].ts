import { and, desc, eq, max } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event)
  const { slug } = getQuery(event)
  const { components, images } = tables
  if (id) {
    let result: typeof images.$inferSelect | undefined

    // If slug is true, meaning the id being passed is actually slug's id
    if (slug) {
      const test = await useDB()
        .select()
        .from(images)
        .leftJoin(components, eq(images.id, components.id))
        .where(and(eq(components.completed, true), eq(components.slug, id)))
        .orderBy(desc(components.createdAt))
        .get()

      result = test?.images
    }
    else {
      result = await useDB().select().from(images).where(eq(images.id, id)).get()
    }

    if (result) {
      setHeaders(event, {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'max-age=604800, public',
      })
      return result.buffer
    }
    else {
      sendRedirect(event, '/placeholder.svg')
      // return createError('Invalid id found')
    }
  }
  else {
    return createError('Missing id')
  }
})
