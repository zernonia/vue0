import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { validateBody, validateUser } from '~/server/utils/validateBody'

export default defineEventHandler(async (event) => {
  const { id, slug } = await validateBody(event, z.object({
    id: z.string(),
    slug: z.string().optional(),
  }).safeParse)
  const user = await validateUser(event)

  const { components } = tables
  const res = await useDB()
    .select()
    .from(components)
    .where(eq(components.id, id))
    .get()

  if (res?.userId !== user.id)
    return createError('This generation cannot be deleted by this user')

  try {
    if (slug) {
      return useDB()
        .delete(components)
        .where(eq(components.slug, slug))
    }
    else {
      return useDB()
        .delete(components)
        .where(eq(components.id, id))
    }
  }
  catch (err) {
    if (err instanceof Error)
      return createError(err.message)
  }
})
