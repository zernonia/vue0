import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const { basedOnResultId } = await validateIterateBody(event)
  const { components } = tables
  const result = await useDB().select().from(components).where(eq(components.id, basedOnResultId))
  const previousResult = result?.[0]

  if (!previousResult.code)
    return createError('Previous code not found')

  // Enable SSE endpoint
  setHeader(event, 'cache-control', 'no-cache')
  setHeader(event, 'connection', 'keep-alive')
  setHeader(event, 'content-type', 'text/event-stream')
  setResponseStatus(event, 200)

  // Let the connection opened
  event._handled = true

  await designComponentIteration(event, previousResult)
  await buildComponentGeneration(event)
  await generateComponentIteration(event, previousResult)
  await storeComponent(event, previousResult.slug)
})
