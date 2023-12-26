export default defineEventHandler(async (event) => {
  type Item = typeof event.node.req.componentDesignTask & {
    created: number
    code: string
  }

  const keys = await useStorage('fs').getKeys()
  const items = await Promise.all(keys.map(key => useStorage<Item>('fs').getItem(key)))
  return items.sort((a, b) => b!.created - a!.created)
})
