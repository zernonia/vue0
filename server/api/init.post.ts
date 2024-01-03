import { z } from 'zod'
import { readValidatedBody } from 'h3'

export default defineEventHandler(async (event) => {
  const result = await readValidatedBody(event, z.object({
    slug: z.string().optional(),
    prompt: z.string(),
  }).safeParse)
  const user = await validateUser(event)

  if (result.success) {
    const { slug, prompt } = result.data

    return useDB().insert(tables.components).values({
      slug,
      description: prompt,
      userId: user.id,
    }).returning().get()
  }
  else {
    return createError(result.error.message)
  }
})
