import { eq } from 'drizzle-orm'
import { connect, launch } from 'puppeteer-core'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id ?? ''
  if (id) {
    const result = await useDB().select().from(tables.images).where(eq(tables.images.id, id)).get()
    if (result) {
      setHeaders(event, {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'max-age=604800, public',
      })
      return result.buffer
    }
    else {
      return createError('Invalid id found')
    }
  }
  else {
    return createError('Missing id')
  }
})
