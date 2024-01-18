import { eq } from 'drizzle-orm'
import { z } from 'zod'

export default defineEventHandler(async (event) => {
  const { id, basedOnResultId } = await validateBody(event, z.object({
    id: z.string(),
    prompt: z.string(),
    basedOnResultId: z.string(),
  }).safeParse)
  const { components } = tables
  const result = await useDB().select().from(components).where(eq(components.id, basedOnResultId))
  const previousResult = result?.[0]

  if (!previousResult.code)
    return createError('Previous code not found')

  const { close } = useSSE(event)

  try {
    await designComponentIteration(event, previousResult)
    await buildComponentGeneration(event)
    await generateComponentIteration(event, previousResult)
    await storeComponent(event, id, previousResult.slug)

    close()
  }
  catch (err) {
    if (err instanceof Error) {
      console.log('error caught ', err.message)
      event.node.res.write(`[Error]: ${err.message}`)
    }
    close()
  }
})
