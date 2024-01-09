<script setup lang="ts">
import { upperFirst } from 'scule'
import { Clipboard, ClipboardCheck, Clock, Code2Icon, GitBranch, MoreVertical, MousePointerSquare, Share, Trash, Trash2 } from 'lucide-vue-next'
import { useToast } from '~/components/ui/toast'

const route = useRoute()
const slug = computed(() => route.params.slug.toString())

const { toast } = useToast()
const { data, refresh } = await useFetch<DBComponent[]>(`/api/component/${slug.value}`)
const { user } = useUserSession()
const dataUser = computed(() => data.value?.at(-1)?.user)
const isUserCreator = computed(() => dataUser.value?.id === user.value?.id)

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
  if (!prompt.value)
    return
  umTrackEvent('iterate-generation', { slug: slug.value })
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

const dropdownOpen = ref(false)
const isPreviewing = ref(false)
const { copy, copied } = useClipboard()
const { copy: copyLink } = useClipboard()

function handleShare() {
  copyLink(location.href)
  umTrackEvent('share-generation', { slug: slug.value })
}

const isForking = ref(false)
async function handleFork() {
  isForking.value = true
  umTrackEvent('fork-generation')
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

const isDeleting = ref(false)
async function handleDelete(all = false) {
  isDeleting.value = true
  const body = all ? { slug: slug.value, id: selectedVersion.value?.id } : { id: selectedVersion.value?.id }
  umTrackEvent('delete-generation')
  try {
    const result = await $fetch<DBComponent>('/api/component/delete', {
      method: 'POST',
      body,
    })
    if (result) {
      if (all)
        await navigateTo('/')
      else
        await refresh()
    }
  }
  catch (err) {
    console.log(err)
  }
  finally {
    isDeleting.value = false
    dropdownOpen.value = false
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
</script>

<template>
  <div class="pb-2 md:pb-8">
    <div class="flex flex-col md:flex-row w-full">
      <div class="flex-shrink-0 md:mt-4 md:mr-4 flex flex-row md:flex-col items-center gap-3 ">
        <div class="flex gap-2 items-center">
          <Clock class="w-4 h-4 text-gray-400" />
          <span class="text-gray-400 font-medium text-sm hidden md:inline-flex">Versions</span>
        </div>
        <div class="flex flex-row-reverse md:flex-col-reverse gap-3 overflow-x-auto p-1 md:p-0">
          <div
            v-for="(version, index) in data"
            :key="version.id"
          >
            <UiTooltip :delay-duration="100">
              <UiTooltipTrigger as-child>
                <UiButton
                  class="justify-start h-auto min-w-[6rem] min-h-6 p-1 overflow-hidden text-left text-gray-400 rounded-lg outline-1 hover:text-primary relative "
                  :class="{ 'outline outline-primary !text-primary': selectedVersion?.id === version.id }"
                  variant="secondary"
                  @click="handleChangeVersion(version)"
                >
                  <UiBadge variant="outline" class="bg-white absolute bottom-2 left-2">
                    v{{ data!.length - 1 - index }}
                  </UiBadge>
                  <img :src="`/api/image/${version.id}`" class="aspect-video object-cover w-32 h-auto">
                </UiButton>
              </UiTooltipTrigger>

              <UiTooltipContent align="start" side="right" class="max-w-64 flex flex-col gap-2 p-1.5">
                <img :src="`/api/image/${version.id}`" class="aspect-video object-cover w-auto h-auto rounded">
                <span class="text-sm p-0.5">{{ version.description }}</span>
              </UiTooltipContent>
            </UiTooltip>
          </div>
        </div>
      </div>

      <div class="flex-1 mt-2 md:mt-0 w-full">
        <div class="flex justify-between">
          <div class="flex items-center gap-2">
            <NuxtLink v-if="dataUser" class="inline-flex" :to="`/${dataUser.name}`">
              <UiAvatar class="w-9 h-9">
                <UiAvatarImage :src="dataUser.avatarUrl ?? ''" />
                <UiAvatarFallback>{{ dataUser.name?.slice(0, 1) }}</UiAvatarFallback>
              </UiAvatar>
            </NuxtLink>
            <div class="text-sm max-w-[9rem] md:max-w-[32rem] text-ellipsis whitespace-nowrap overflow-hidden">
              {{ selectedVersion?.description }}
            </div>
          </div>

          <div class="flex items-center gap-2">
            <UiDropdownMenu v-model:open="dropdownOpen">
              <UiDropdownMenuTrigger as-child>
                <UiButton
                  size="icon"
                  :disabled="!sfcString" variant="outline"
                >
                  <MoreVertical class="p-1" />
                </UiButton>
              </UiDropdownMenuTrigger>

              <UiDropdownMenuContent align="end">
                <UiDropdownMenuItem @click="handleFork">
                  <GitBranch class="py-1 mr-1" />
                  <span>Fork</span>
                </UiDropdownMenuItem>
                <UiDropdownMenuItem @click="handleShare">
                  <Share class="py-1 mr-1" />
                  <span>Share</span>
                </UiDropdownMenuItem>

                <template v-if="isUserCreator">
                  <UiDropdownMenuSeparator />
                  <DialogDelete
                    v-if="selectedVersion?.id !== data?.at(-1)?.id"
                    title="Are you sure you want to delete this version?"
                    description="This will delete the current selected version. This action cannot be undone."
                  >
                    <UiDropdownMenuItem class="!text-destructive" @select.prevent>
                      <Trash class="py-1 mr-1" />
                      <span>Delete Version</span>
                    </UiDropdownMenuItem>

                    <template #footer>
                      <UiAlertDialogCancel :disabled="isDeleting">
                        Cancel
                      </UiAlertDialogCancel>
                      <UiAlertDialogAction as-child>
                        <UiButton variants="'destructive'" :loading="isDeleting" @click="handleDelete()">
                          Delete Version
                        </UiButton>
                      </UiAlertDialogAction>
                    </template>
                  </DialogDelete>
                  <DialogDelete
                    title="Are you sure you want to delete this generation?"
                    description="This will delete the generation and all results. This action cannot be undone."
                  >
                    <UiDropdownMenuItem class="!text-destructive" @select.prevent>
                      <Trash2 class="py-1 mr-1" />
                      <span>Delete Generation</span>
                    </UiDropdownMenuItem>

                    <template #footer>
                      <UiAlertDialogCancel :disabled="isDeleting">
                        Cancel
                      </UiAlertDialogCancel>
                      <UiAlertDialogAction as-child>
                        <UiButton variants="'destructive'" :loading="isDeleting" @click="handleDelete(true)">
                          Delete Generation
                        </UiButton>
                      </UiAlertDialogAction>
                    </template>
                  </DialogDelete>
                </template>
              </UiDropdownMenuContent>
            </UiDropdownMenu>

            <UiButton class="px-1.5 md:px-4" :disabled="!sfcString" variant="outline" @click="copy(selectedVersion?.code ?? ''); umTrackEvent('copy-code', { slug }) ">
              <ClipboardCheck v-if="copied" class="py-1 md:mr-1 md:-ml-1" />
              <Clipboard v-else class="py-1 md:mr-1 md:-ml-1" />
              <span class="hidden md:inline">{{ copied ? 'Copied' : 'Copy' }}</span>
            </UiButton>
            <UiButton class="px-1.5 md:px-4" :loading="!sfcString" @click="isPreviewing = !isPreviewing">
              <MousePointerSquare v-if="isPreviewing" class="py-1 md:mr-1 md:-ml-1" />
              <Code2Icon v-else class="py-1 md:mr-1 md:-ml-1" />
              <span class="hidden md:inline">{{ isPreviewing ? 'Preview' : 'Code' }}</span>
            </UiButton>
          </div>
        </div>

        <div class="relative z-0 flex w-full mt-3 md:mt-4 overflow-hidden border rounded-xl" :class="[isUserCreator ? 'h-[calc(100vh-14rem)]' : 'h-[calc(100vh-10rem)]']">
          <LazyOutputCode v-show="isPreviewing" :sfc-string="sfcString" />
          <iframe ref="iframeRef" :src="`/p/${slug}`" class="w-full h-full" />
        </div>
      </div>
    </div>

    <div v-if="isUserCreator" class="relative flex items-center justify-center w-full gap-2 mt-3 md:mt-16">
      <PromptInput v-model="prompt" :loading="loading" class="md:absolute bottom-0 w-full md:w-fit md:-translate-x-1/2 left-1/2" placeholder="Make the padding larger" @submit="handleSubmit" />
    </div>
  </div>
</template>
