<script setup lang="ts">
import { upperFirst } from 'scule'
import { Clipboard, ClipboardCheck, Code2Icon, GitBranch, SparklesIcon } from 'lucide-vue-next'
import { useToast } from '~/components/ui/toast'

const route = useRoute()
const slug = computed(() => route.params.slug.toString())

const { toast } = useToast()
const { data, refresh } = await useFetch<DBComponent[]>(`/api/component/${slug.value}`)
const { user } = useUserSession()
const dataUser = computed(() => data.value?.[0]?.user)
const selectedVersion = ref<NonNullable<typeof data.value>[number]>()

const iframeRef = ref<HTMLIFrameElement>()

watch(data, (n) => {
  const item = n?.[0]
  selectedVersion.value = item
  sendDataToIframe(item?.code ?? '')
}, { immediate: true })

const prompt = ref('')
const { loading, contentCode, onDone, onStream, isNewPrompt, handleInit, handleIterate, handleCreate } = usePrompt()

const sfcString = computed(() => selectedVersion.value?.code ?? contentCode.value ?? '')

function sendDataToIframe(data: string) {
  const channel = new MessageChannel()
  if (iframeRef.value)
    iframeRef.value.contentWindow?.postMessage({ from: 'vue0', data }, '*', [channel.port2])
}

function handleChangeVersion(version: DBComponent) {
  selectedVersion.value = version
  sendDataToIframe(version.code!)
}

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

onStream(sendDataToIframe)

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

const isForking = ref(false)
async function handleFork() {
  isForking.value = true
  try {
    const result = await $fetch<DBComponent>('/api/component/fork', {
      method: 'POST',
      body: {
        id: selectedVersion.value?.id,
        slug: slug.value,
      },
    })
    if (result.id)
      navigateTo(`/t/${result.slug}`)
  }
  catch (err) {
    console.log(err)
  }
  finally {
    isForking.value = false
  }
}

const componentDescription = computed(() => upperFirst(data.value?.at(-1)?.description ?? ''))

// Page meta section
useHead({
  title() {
    return componentDescription.value
  },
})
defineOgImageComponent('Generated', {
  title: componentDescription.value,
  avatarUrl: dataUser.value?.avatarUrl,
  imageUrl: `${useRuntimeConfig().public.siteUrl}/api/image/${slug.value}`,
})
console.log(`${useRuntimeConfig().public.siteUrl}/api/image/${slug.value}`)
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
            @click="handleChangeVersion(version)"
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
            <UiAvatar v-if="dataUser" class="w-9 h-9">
              <UiAvatarImage :src="dataUser.avatarUrl ?? ''" />
              <UiAvatarFallback>{{ dataUser.name?.slice(0, 1) }}</UiAvatarFallback>
            </UiAvatar>
            <div class="text-sm max-w-64 text-ellipsis whitespace-nowrap overflow-hidden">
              {{ componentDescription }}
            </div>
          </div>

          <div class="flex items-center gap-2">
            <UiButton
              :disabled="!sfcString" :loading="isForking" variant="outline" @click="handleFork"
            >
              <GitBranch class="py-1 -ml-1 mr-1" />
              <span>Fork</span>
            </UiButton>
            <UiButton :disabled="!sfcString" variant="outline" @click="copy(selectedVersion?.code ?? '')">
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
          <iframe ref="iframeRef" :src="`/p/${slug}`" class="w-full h-full" />
        </div>
      </div>
    </div>
    <div v-if="user?.id === dataUser?.id" class="mt-4 flex justify-center items-center w-full gap-2">
      <UiInput v-model="prompt" :disabled="loading" placeholder="Make the padding larger" class="w-96" @keyup.enter.prevent="handleSubmit" />
      <UiButton size="icon" :disabled="loading || !prompt.length" :loading="loading" @click="handleSubmit">
        <SparklesIcon class="p-1" />
      </UiButton>
    </div>
  </div>
</template>
