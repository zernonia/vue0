export default defineEventHandler(async (event) => {
  const slug = event.context.params?.slug ?? ''

  type Item = typeof event.node.req.componentDesignTask & {
    created: number
    code: string
  }
  return useStorage<Item>('fs').getItem(`${slug}.json`)
})
