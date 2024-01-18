import { z } from 'zod'

export default defineEventHandler(async (event) => {
  const { id } = await validateBody(event, z.object({
    id: z.string(),
    prompt: z.string(),
  }).safeParse)
  const { close } = useSSE(event)

  try {
    await designComponentNew(event)
    await buildComponentGeneration(event)
    await generateComponentNew(event)
    await storeComponent(event, id)
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
