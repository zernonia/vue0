export function useOpenAIKey() {
  return useLocalStorage('openai_key', () => '')
}

type FetchRequest = Parameters<typeof $fetch>[0]
export function usePrompt(request: FetchRequest, body: Record<string, any>) {
  const openaiKey = useOpenAIKey()
  const loading = ref(false)
  const content = ref('')

  async function handleSubmit() {
    loading.value = true

    const _body = typeof body === 'function' ? body() : body
    const completion = await $fetch<ReadableStream>(request, {
      method: 'POST',
      body: _body,
      responseType: 'stream',
      headers: {
        'x-openai-key': openaiKey.value,
      },
    })

    const reader = completion.getReader()
    const decoder = new TextDecoder('utf-8')

    const read = async (): Promise<void> => {
      const { done, value } = await reader.read()
      if (done) {
        console.log('release locked')
        return reader.releaseLock()
      }

      const chunk = decoder.decode(value, { stream: true })
      content.value += chunk
      return read()
    }
    await read()
  }

  return {
    loading,
    content,
    handleSubmit,
  }
}
