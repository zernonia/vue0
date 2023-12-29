export default defineEventHandler(async (event) => {
  console.log(event.node.req.headers)
  console.log(event.node.req.headers['x-openai-key'])
  const h = event.node.req.headers['x-openai-key']

  return {
    h,
    headers: event.node.req.headers,
  }
})
