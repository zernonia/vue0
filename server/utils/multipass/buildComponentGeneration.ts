import fs from 'node:fs'
import type { EventHandlerRequest, H3Event } from 'h3'
import { get_encoding } from '@dqbd/tiktoken'
import type { OpenAI } from 'openai'

declare module 'h3' {
  interface NodeIncomingMessage {
    componentDesignContext: OpenAI.ChatCompletionMessageParam[]
  }
}

export default async (event: H3Event<EventHandlerRequest>) => {
  console.log('> init : building component generation')
  const tiktokenEncoder = get_encoding('cl100k_base')
  const TOKEN_LIMIT = 600
  const componentDesignTask = event.node.req.componentDesignTask
  const components = (await import('@/template/shadcn-vue/metadata.json')).default

  const retrievedComponent = components.filter(i => componentDesignTask.components.find(j => j.name === i.name))

  const mappedComponent = retrievedComponent.map((component) => {
    const componentExamples = [...component.examples]
    const examples: typeof componentExamples = []
    let totalTokens = 0

    while (totalTokens < TOKEN_LIMIT && componentExamples.length) {
      const randomExample = componentExamples.splice(
        Math.floor(Math.random() * componentExamples.length),
        1,
      )[0]

      totalTokens += tiktokenEncoder.encode(randomExample.code).length

      if (totalTokens < TOKEN_LIMIT)
        examples.push(randomExample)

      console.log(
          `tokens for context entry ${component.name} : ${totalTokens} `
          + `(limit : ${TOKEN_LIMIT})`,
      )
    }

    return {
      ...component,
      examples,
    }
  })

  const componentContext = mappedComponent.map((component, idx) => {
    const examplesBlock = !component.examples.length
      ? ''
      : `\n\n`
      + `# full code examples of Vue components that use ${component.name} :\n${
     component.examples
      .map((example) => {
        return (
          `\`\`\`${example.source}\n${example.code.trim()}\n\`\`\``
        )
      })
      .join(`\n\n`)}`

    return {

      role: 'user',
      content: `Library components can be used while making the new Vue component\n\n`
      + `Suggested library component (${idx + 1}/${mappedComponent.length}) : ${component.name} - ${component.description}\n`
      + `Suggested usage : ${component.usage}\n\n\n`
      // + `# ${component.name} can be imported into the new component like this:\n`
      // + `\`\`\`vue\n${
      // e.docs.import.code.trim()
      // }\n\`\`\`\n\n---\n\n`
      + `# examples of how ${component.name} can be used inside the new component:\n${examplesBlock}`,
    } satisfies OpenAI.ChatCompletionMessageParam
  })

  event.node.req.componentDesignContext = componentContext
}
