<script setup lang="ts">
import { Clipboard, ClipboardCheck, Code2Icon, SparklesIcon } from 'lucide-vue-next'
import { useToast } from '~/components/ui/toast'

const route = useRoute()
const slug = computed(() => route.params.slug)

const { toast } = useToast()
const { data, refresh } = useFetch<DBComponent[]>(`/api/component/${slug.value}`)
const user = computed(() => data.value?.[0].user)
const selectedVersion = ref<NonNullable<typeof data.value>[number]>()

watch(data, (n) => {
  selectedVersion.value = n?.[0]
}, { immediate: true })

const prompt = ref('')
const { loading, contentCode, onDone, isNewPrompt, handleInit, handleIterate, handleCreate } = usePrompt()

const sfcString = computed(() => selectedVersion.value?.code ?? contentCode.value ?? '')

async function handleSubmit() {
  const basedOnResultId = selectedVersion.value?.id
  const result = await handleInit(prompt.value, selectedVersion.value?.slug)

  data.value = [result, ...(data.value ?? [])]
  handleIterate({
    id: result.id,
    prompt: result.description,
    basedOnResultId,
  })
}

onDone(() => {
  refresh()
  prompt.value = ''
  toast({
    title: 'Completed',
    description: 'Latest generation is completed!',
  })
})

onMounted(() => {
  if (isNewPrompt.value && data.value?.length === 1) {
    // need not to handleInit as it will be done on the landing page
    handleCreate({
      id: data.value[0].id,
      prompt: data.value[0].description,
    })
  }
})

const isPreviewing = ref(false)
const { copy, copied } = useClipboard()
</script>

<template>
  <div class="pb-8">
    <div class="flex w-full">
      <div class="flex-shrink-0 mt-2 w-64 mr-4">
        <h2 class="font-bold text-lg">
          History
        </h2>
        <div class="mt-4 flex flex-col-reverse gap-3">
          <UiButton
            v-for="(version, index) in data"
            :key="version.id"
            class="text-left overflow-hidden h-auto justify-start outline-1 text-gray-400 hover:text-primary"
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
        <div class="flex justify-between">
          <div class="flex items-center gap-2">
            <UiAvatar class="w-9 h-9">
              <UiAvatarImage :src="user?.avatarUrl ?? ''" />
              <UiAvatarFallback>{{ user?.name?.slice(0, 1) }}</UiAvatarFallback>
            </UiAvatar>
            <div class="text-sm max-w-64 text-ellipsis whitespace-nowrap overflow-hidden">
              {{ selectedVersion?.description }}
            </div>
          </div>

          <div class="flex items-center gap-2">
            <UiButton :loading="!sfcString" variant="outline" @click="copy(selectedVersion?.code ?? '')">
              <ClipboardCheck v-if="copied" class="py-1 -ml-1 mr-1" />
              <Clipboard v-else class="py-1 -ml-1 mr-1" />
              <span>{{ copied ? 'Copied' : 'Copy' }}</span>
            </UiButton>
            <UiButton :loading="!sfcString" @click="isPreviewing = !isPreviewing">
              <Code2Icon class="py-1 -ml-1 mr-1" />
              <span>Preview</span>
            </UiButton>
          </div>
        </div>

        <div class="border mt-4 rounded-xl overflow-hidden h-[80vh] w-full flex relative">
          <LazyOutputCode v-show="isPreviewing" :sfc-string="sfcString" />
          <div class="m-auto overflow-auto h-full w-full ">
            <OutputWrapper>
              <LazyOutput v-if="sfcString" :sfc-string="sfcString" />
              <Loading v-else size="lg" class="m-4" />
            </OutputWrapper>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-4 flex justify-center items-center w-full gap-2">
      <UiInput v-model="prompt" :disabled="loading" placeholder="Make the padding larger" class="w-96" @keyup.enter.prevent="handleSubmit" />
      <UiButton size="icon" :disabled="loading || !prompt.length" :loading="loading" @click="handleSubmit">
        <SparklesIcon class="p-1" />
      </UiButton>
    </div>
  </div>
</template>
