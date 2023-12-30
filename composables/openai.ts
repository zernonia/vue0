export function useOpenAIKey() {
  return useLocalStorage('openai_key', () => '')
}
export function useNewPrompt() {
  return useState('init', () => false)
}

type FetchRequest = Parameters<typeof $fetch>[0]
export function usePrompt() {
  const fetchResult = createEventHook<void>()

  const openaiKey = useOpenAIKey()
  const isNewPrompt = useNewPrompt()
  const loading = ref(false)
  const content = ref('')
  const contentCode = computed(() => content.value.split('\`\`\`vue')?.[1]?.replace('\`\`\`', '') ?? '')

  function handleInit(prompt: string, slug?: string | null) {
    loading.value = true
    return $fetch<DBComponent>('/api/init', {
      method: 'POST',
      body: {
        prompt,
        slug,
      },
    })
  }

  async function handlePrompt(request: FetchRequest, body: Record<string, any>) {
    loading.value = true
    content.value = ''

    const completion = await $fetch<ReadableStream>(request, {
      method: 'POST',
      body,
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
        loading.value = false
        fetchResult.trigger()
        return reader.releaseLock()
      }

      const chunk = decoder.decode(value, { stream: true })
      content.value += chunk
      return read()
    }
    await read()
  }

  const handleCreate = (body: Record<string, any>) => {
    isNewPrompt.value = false
    return handlePrompt('/api/create', body)
  }

  const handleIterate = (body: Record<string, any>) => {
    return handlePrompt('/api/iterate', body)
  }

  return {
    loading,
    content,
    contentCode,
    isNewPrompt,
    handleInit,
    handleCreate,
    handleIterate,
    onDone: fetchResult.on,
  }
}
