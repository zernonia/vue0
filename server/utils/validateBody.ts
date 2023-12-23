import { z } from 'zod'
import type { EventHandlerRequest, H3Event } from 'h3'
import { readValidatedBody } from 'h3'

const paramSchema = z.object({
  description: z.string(),
})

export async function validateBody(event: H3Event<EventHandlerRequest>) {
  const result = await readValidatedBody(event, paramSchema.safeParse)

  if (result.success) { return result.data }

  else {
    throw createError({
      statusCode: 400,
      statusMessage: result.error.message,
    })
  }
}
