<script setup lang="ts">
import { GithubLogoIcon } from '@radix-icons/vue'

const prompt = ref('Simple chat app')

const { data, refresh } = await useFetch<DBComponent[]>('/api/component/all')
const { handleSubmit, content, onDone } = usePrompt('/api/create', () => ({
  prompt: prompt.value,
}))

onDone(async () => {
  await refresh()
  await navigateTo(`/t/${data.value?.[0].slug}`)
})
</script>

<template>
  <div class="mb-8 w-full">
    <UiCard class="w-96 mx-auto ">
      <UiCardHeader>
        <UiCardTitle>vue0</UiCardTitle>
      </UiCardHeader>

      <UiCardContent>
        <div class="flex items-center gap-2">
          <UiInput v-model="prompt" />
          <UiButton :disabled="!prompt.length" @click="handleSubmit">
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

  <div class="w-full p-6 border-t">
    <GeneratedList :data="data" />
  </div>
</template>
