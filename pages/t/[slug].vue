<script setup lang="ts">
import { SparklesIcon } from 'lucide-vue-next'

const route = useRoute()
const slug = computed(() => route.params.slug)

const { data, refresh } = await useFetch(`/api/component/${slug.value}`)
const selectedVersion = ref<NonNullable<typeof data.value>[number]>()

watch(data, (n) => {
  selectedVersion.value = n?.[0]
}, { immediate: true })

const prompt = ref('')
const { handleSubmit, loading, onDone } = usePrompt('/api/iterate', () => ({
  prompt: prompt.value,
  basedOnResultId: selectedVersion.value?.id,
}))

onDone(() => {
  // when finish, refresh the data
  refresh()
  prompt.value = ''
})
</script>

<template>
  <div>
    <div class="flex w-full">
      <div class="flex-shrink-0 w-64 mr-4">
        <h2 class="font-bold ">
          History
        </h2>
        <div class="mt-4 flex flex-col-reverse gap-3">
          <UiButton
            v-for="(version, index) in data"
            :key="version.id"
            class="text-left h-auto justify-start outline-1 text-gray-400 hover:text-primary"
            :class="{ 'outline outline-primary !text-primary': selectedVersion?.id === version.id }"
            variant="secondary"
            @click="selectedVersion = version"
          >
            <div>
              <UiBadge variant="outline" class="bg-white">
                v{{ data!.length - 1 - index }}
              </UiBadge>
              <span class="ml-2 ">{{ version.description }}</span>
            </div>
          </UiButton>
        </div>
      </div>

      <div class="flex-1 w-full">
        <UiCard class=" h-[80vh] w-full flex overflow-auto py-12">
          <UiCardContent class="m-auto">
            <OutputWrapper>
              <LazyOutput v-if="selectedVersion?.code" :sfc-string="selectedVersion?.code" />
            </OutputWrapper>
          </UiCardContent>
        </UiCard>
      </div>
    </div>

    <div class="mt-4 flex justify-center items-center w-full">
      <UiInput v-model="prompt" :disabled="loading" placeholder="Make the padding larger" class="w-96" @keyup.enter.prevent="handleSubmit" />
      <UiButton size="icon" class="p-2" :disabled="loading" @click="handleSubmit">
        <SparklesIcon />
      </UiButton>
    </div>
  </div>
</template>
