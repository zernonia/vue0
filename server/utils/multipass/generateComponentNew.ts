import type { EventHandlerRequest, H3Event } from 'h3'
import { get_encoding } from '@dqbd/tiktoken'
import type { OpenAI } from 'openai'

declare module 'h3' {
  interface NodeIncomingMessage {
    componentGeneratedCode: string
  }
}

export default async (event: H3Event<EventHandlerRequest>) => {
  console.log('> init : generate new component')
  const tiktokenEncoder = get_encoding('cl100k_base')
  const componentDesignContext = event.node.req.componentDesignContext
  const componentDesignTask = event.node.req.componentDesignTask

  const context: OpenAI.ChatCompletionMessageParam[] = [
    {
      role: `system`,
      content:
        `You are an expert at writing Vue components.\n`
        + `Your task is to write a new Vue component for a web app, according to the provided task details.\n`
        + `The Vue component you write can make use of Tailwind classes for styling.\n`
        + `If you judge it is relevant to do so, you can use library components and icons.\n\n`
        + `If the component is using imported component, dont overwrite the style for background color and text color.\n`
        + `You will write the full Vue component code, which should include all imports.`
        + `The code should always start with <script setup lang="ts"> first, then only <template>`
        + `Your generated code will be directly written to a .vue component file and used in production.`,
    },
    ...componentDesignContext,
    {
      role: `user`,
      content:
        `- COMPONENT NAME : ${componentDesignTask.name}\n\n`
        + `- COMPONENT DESCRIPTION :\n`
        + `\`\`\`\n${componentDesignTask.description.user}\n\`\`\`\n\n`
        + `- additional component suggestions :\n`
        + `\`\`\`\n${componentDesignTask.description.llm}\n\`\`\`\n\n\n`
        + `Write the full code for the new Vue component, which uses Tailwind classes if needed (add tailwind dark: classes too if you can; backgrounds in dark: classes should be black), and optionally, library components and icons, based on the provided design task.\n`
        + `The full code of the new Vue component that you write will be written directly to a .vue file inside the Vue project.\n`
        + `Answer with generated code only. DO NOT ADD ANY EXTRA TEXT DESCRIPTION OR COMMENTS BESIDES THE CODE. Your answer contains code only ! component code only !\n`
        + `Important :\n`
        + `- Make sure you import provided components libraries and icons that are provided to you if you use them !\n`
        + `- Tailwind classes should be written directly in the elements class tags. DO NOT WRITE ANY CSS OUTSIDE OF CLASSES. DO NOT USE ANY <style> IN THE CODE ! CLASSES STYLING ONLY !\n`
        + `- Do not use libraries or imports except what is provided in this task; otherwise it would crash the component because not installed. Do not import extra libraries besides what is provided above !\n`
        + `- DO NOT HAVE ANY DYNAMIC DATA OR DATA PROPS ! Components are meant to be working as is without supplying any variable to them when importing them ! Only write a component that render directly with placeholders as data, component not supplied with any dynamic data.\n`
        + `- DO NOT HAVE ANY DYNAMIC DATA OR DATA PROPS ! `
        + `- Only write the code for the component; Do not write extra code to import it! The code will directly be stored in an individual .vue file !\n`
        + `Write the Vue component code as the creative genius and Vue component genius you are - with good ui formatting.\n`,
    },
  ]

  const contextPromptToken = tiktokenEncoder.encode(context.map(i => i.content).join('')).length
  console.log(`> total context prompt tokens (estimate) : ${contextPromptToken}`)

  const stream = await useOpenAI(event).chat.completions.create({
    model: 'gpt-4-1106-preview',
    messages: context,
    stream: true,
  })

  let completion = ''
  for await (const part of stream) {
    const chunk = part.choices[0].delta.content || ''
    completion += chunk
    event.node.res.write(chunk)
  }

  event.node.req.componentGeneratedCode = completion.replace('```vue', '').replaceAll('```', '')
}
