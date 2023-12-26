export default defineEventHandler(async (event) => {
  await validateCreateBody(event)

  // Enable SSE endpoint
  setHeader(event, 'cache-control', 'no-cache')
  setHeader(event, 'connection', 'keep-alive')
  setHeader(event, 'content-type', 'text/event-stream')
  setResponseStatus(event, 200)

  // Let the connection opened
  event._handled = true

  await designComponentNew(event)
  await buildComponentGeneration(event)
  await generateComponentNew(event)
  await storeComponent(event)
})
