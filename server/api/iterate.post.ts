import { eq } from 'drizzle-orm'
import { alias } from 'drizzle-orm/sqlite-core'
import { z } from 'zod'

export default defineEventHandler(async (event) => {
  const { id } = await validateBody(event, z.object({
    id: z.string(),
    prompt: z.string(),
  }).safeParse)
  const { components } = tables

  const componentAlias = alias(components, 'baseComponent')
  const result = await useDB().select()
    .from(components)
    .leftJoin(componentAlias, eq(components.basedOnId, componentAlias.id))
    .where(eq(components.id, id))

  const previousResult = result?.[0].baseComponent

  if (!previousResult?.code)
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
      await useDB().update(tables.components).set({ id, error: err.message }).where(eq(tables.components.id, id))
      event.node.res.write(`[Error]: ${err.message}`)
    }
    close()
  }
})
