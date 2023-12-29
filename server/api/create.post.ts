export default defineEventHandler(async (event) => {
  await validateCreateBody(event)
  const { close } = useSSE(event)

  await designComponentNew(event)
  await buildComponentGeneration(event)
  await generateComponentNew(event)
  await storeComponent(event)

  close()
})
