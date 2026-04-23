export default defineEventHandler((event) => {
  if (event.path.startsWith('/api/')) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Service unavailable — new version coming soon',
    })
  }
})
