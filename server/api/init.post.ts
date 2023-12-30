import { z } from 'zod'
import { readValidatedBody } from 'h3'

export default defineEventHandler(async (event) => {
  const result = await readValidatedBody(event, z.object({
    slug: z.string().optional(),
    prompt: z.string(),
  }).safeParse)

  if (result.success) {
    const { slug, prompt } = result.data

    return useDB().insert(tables.components).values({
      slug,
      description: prompt,
    }).returning().get()
  }
  else {
    return createError(result.error.message)
  }
})
