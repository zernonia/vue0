export default defineEventHandler(async (event) => {
  console.log(event.node.req.headers)
  console.log(event.node.req.headers['x-openai-key'])

  await validateCreateBody(event)
  const { close } = useSSE(event)

  await designComponentNew(event)
  await buildComponentGeneration(event)
  await generateComponentNew(event)
  await storeComponent(event)

  close()
})
