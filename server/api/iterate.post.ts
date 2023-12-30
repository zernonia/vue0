import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const { id, basedOnResultId } = await validateIterateBody(event)
  const { components } = tables
  const result = await useDB().select().from(components).where(eq(components.id, basedOnResultId))
  const previousResult = result?.[0]

  if (!previousResult.code)
    return createError('Previous code not found')

  const { close } = useSSE(event)

  await designComponentIteration(event, previousResult)
  await buildComponentGeneration(event)
  await generateComponentIteration(event, previousResult)
  await storeComponent(event, id, previousResult.slug)

  close()
})
