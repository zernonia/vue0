import fs from 'node:fs'
import type { EventHandlerRequest, H3Event } from 'h3'

declare module 'h3' {
  interface NodeIncomingMessage {
    componentGeneratedCode: string
  }
}

export default async (event: H3Event<EventHandlerRequest>, slug?: string | null) => {
  console.log('> init : store component')
  const componentDesignTask = event.node.req.componentDesignTask
  const componentGeneratedCode = event.node.req.componentGeneratedCode

  const result = await useDB().insert(tables.components).values({
    slug,
    code: componentGeneratedCode,
    description: componentDesignTask.description.user,
  }).returning().get()

  console.dir(result)
  return result
}
