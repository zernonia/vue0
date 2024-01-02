import { z } from 'zod'
import type { EventHandlerRequest, H3Event, ValidateFunction } from 'h3'
import { readValidatedBody } from 'h3'
import type { UserSession } from '#auth-utils'

export async function validateBody<T, U>(event: H3Event<EventHandlerRequest>, validate: ValidateFunction<z.SafeParseReturnType<T, U>>) {
  const result = await readValidatedBody(event, validate)

  if (result.success) { return result.data }

  else {
    throw createError({
      statusCode: 400,
      statusMessage: result.error.message,
    })
  }
}

export async function validateUser(event: H3Event<EventHandlerRequest>) {
  const session = await getUserSession(event)
  // @ts-expect-error user session types
  if (!session.user?.id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No user session found',
    })
  }
  else {
    return session.user as UserSession
  }
}

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
