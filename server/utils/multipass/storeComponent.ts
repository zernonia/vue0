import fs from 'node:fs'
import type { EventHandlerRequest, H3Event } from 'h3'

declare module 'h3' {
  interface NodeIncomingMessage {
    componentGeneratedCode: string
  }
}

export default async (event: H3Event<EventHandlerRequest>) => {
  console.log('> init : store component')
  const componentDesignTask = event.node.req.componentDesignTask
  const componentGeneratedCode = event.node.req.componentGeneratedCode

  const result = await useStorage('fs').setItem(`${componentDesignTask.name}.json`, {
    ...componentDesignTask,
    created: Date.now(),
    code: componentGeneratedCode,
  })

  fs.writeFileSync(
    `components/generated/${componentDesignTask.name}.vue`,
    componentGeneratedCode,
  )

  console.log(result)
}
