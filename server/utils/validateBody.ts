import { z } from 'zod'
import type { EventHandlerRequest, H3Event } from 'h3'
import { readValidatedBody } from 'h3'

export async function validateCreateBody(event: H3Event<EventHandlerRequest>) {
  const result = await readValidatedBody(event, z.object({
    id: z.string(),
    prompt: z.string(),
  }).safeParse)

  if (result.success) { return result.data }

  else {
    throw createError({
      statusCode: 400,
      statusMessage: result.error.message,
    })
  }
}

export async function validateIterateBody(event: H3Event<EventHandlerRequest>) {
  const result = await readValidatedBody(event, z.object({
    id: z.string(),
    prompt: z.string(),
    basedOnResultId: z.string(),
  }).safeParse)

  if (result.success) { return result.data }

  else {
    throw createError({
      statusCode: 400,
      statusMessage: result.error.message,
    })
  }
}
