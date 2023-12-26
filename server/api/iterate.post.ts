export default defineEventHandler(async (event) => {
  await validateBody(event)

  // Enable SSE endpoint
  setHeader(event, 'cache-control', 'no-cache')
  setHeader(event, 'connection', 'keep-alive')
  setHeader(event, 'content-type', 'text/event-stream')
  setResponseStatus(event, 200)

  // Let the connection opened
  event._handled = true

  await designComponentIteration(event)
  await buildComponentGeneration(event)
  await generateComponentIteration(event)
  await storeComponent(event)
})
