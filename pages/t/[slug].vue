<script setup lang="ts">
import { SparklesIcon } from 'lucide-vue-next'

const route = useRoute()
const slug = computed(() => route.params.slug)

const { data } = await useFetch(`/api/component/${slug.value}`)
const selectedVersion = ref<NonNullable<typeof data.value>[number]>()

watch(data, (n) => {
  selectedVersion.value = n?.[0]
}, { immediate: true })

const prompt = ref('')
const loading = ref(false)
const content = ref('')

async function handleSubmit() {
  loading.value = true

  const completion = await $fetch<ReadableStream>('/api/iterate', {
    method: 'POST',
    body: {
      prompt: prompt.value,
      basedOnResultId: selectedVersion.value?.id,
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
  <div>
    <div class="flex">
      <div class="flex-shrink-0 w-64 mr-4">
        <h2 class="font-bold ">
          History
        </h2>
        <div class="mt-4 flex flex-col-reverse gap-2">
          <UiButton
            v-for="(version, index) in data"
            :key="version.id"
            class="text-left h-auto justify-start"
            :class="{ 'border border-primary': selectedVersion?.id === version.id }"
            variant="secondary"
            @click="selectedVersion = version"
          >
            <div>
              <UiBadge variant="outline" class="bg-white">
                v{{ data!.length - 1 - index }}
              </UiBadge>
              <span class="ml-2">{{ version.description }}</span>
            </div>
          </UiButton>
        </div>
      </div>
      <div class="flex-1">
        <UiCard class=" h-[80vh] grid place-content-center py-12">
          <UiCardContent>
            <Output v-if="selectedVersion?.code" :sfc-string="selectedVersion?.code" />
          </UiCardContent>
        </UiCard>
      </div>
    </div>

    <div class="mt-4 flex justify-center items-center w-full">
      <UiInput v-model="prompt" placeholder="Make the padding larger" class="w-96" @keyup.enter.prevent="handleSubmit" />
      <UiButton size="icon" class="p-2" :disabled="loading" @click="handleSubmit">
        <SparklesIcon />
      </UiButton>
    </div>
  </div>
</template>
