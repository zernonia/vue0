import type { EventHandlerRequest, H3Event } from 'h3'
import { OpenAI } from 'openai'

export { upperFirst as capitalize } from 'scule'

export const openai = new OpenAI({
  apiKey: process.env.NUXT_OPENAI_API_KEY,
})

export function useOpenAI(event: H3Event<EventHandlerRequest>) {
  const apiKey = event.node.req.headers['x-openai-key']?.toString() || process.env.NUXT_OPENAI_API_KEY
  return new OpenAI({
    apiKey,
  })
}

export const randomString = (length = 5) => Math.random().toString(36).substr(2, length)
