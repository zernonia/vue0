<script setup lang="ts">
import { GithubLogoIcon } from '@radix-icons/vue'

const description = ref('Simple chat app')
const content = ref('')
async function handleSubmit() {
  const completion = await $fetch<ReadableStream>('/api/create', {
    method: 'POST',
    body: {
      description: description.value,
    },
    responseType: 'stream',
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
</script>

<template>
  <div class="h-screen w-screen flex flex-col items-center justify-center">
    <UiCard class="w-96 mb-8">
      <UiCardHeader>
        <UiCardTitle>vue0</UiCardTitle>
      </UiCardHeader>

      <UiCardContent>
        <div class="flex items-center gap-2">
          <UiInput v-model="description" />
          <UiButton :disabled="!description.length" @click="handleSubmit">
            Send
          </UiButton>
        </div>

        {{ content }}
      </UiCardContent>

      <UiCardFooter class="justify-end">
        <UiButton as-child>
          <NuxtLink to="https://github.com/zernonia/vue0">
            <GithubLogoIcon class="mr-2" /> GitHub
          </NuxtLink>
        </UiButton>
      </UiCardFooter>
    </UiCard>
  </div>
</template>
