import { OpenAI } from 'openai'

export { upperFirst as capitalize } from 'scule'

export const openai = new OpenAI({
  // eslint-disable-next-line node/prefer-global/process
  apiKey: process.env.NUXT_OPENAI_API_KEY,
})
