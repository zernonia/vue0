import { z } from 'zod'

export default defineEventHandler(async (event) => {
  const { id } = await validateBody(event, z.object({
    id: z.string(),
    prompt: z.string(),
  }).safeParse)
  const { close } = useSSE(event)

  await designComponentNew(event)
  await buildComponentGeneration(event)
  await generateComponentNew(event)
  await storeComponent(event, id)

  close()
})
