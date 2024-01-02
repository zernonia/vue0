import { desc, eq } from 'drizzle-orm'
import { z } from 'zod'
import { validateBody, validateUser } from '~/server/utils/validateBody'

export default defineEventHandler(async (event) => {
  const { id, slug } = await validateBody(event, z.object({
    id: z.string(),
    slug: z.string(),
  }).safeParse)
  const user = await validateUser(event)

  const { components } = tables

  const res = await useDB()
    .select()
    .from(components)
    .orderBy(desc(components.createdAt))
    .where(eq(components.slug, slug))

  const selectedVersion = res.find(i => i.id === id)
  if (res.length && selectedVersion) {
    const { code, metadata, completed } = selectedVersion
    const { description } = res[res.length - 1] // get the first prompt
    return await useDB()
      .insert(components)
      .values({
        description,
        code,
        metadata,
        completed,
        userId: user?.id,
      })
      .returning().get()
  }
  else if (res.length) {
    return createError('No selected version found')
  }
  else {
    return createError('No component found')
  }
})
