<script setup lang="ts">
import { upperFirst } from 'scule'
import { Clipboard, ClipboardCheck, Clock, Code2Icon, GitBranch, MoreVertical, Share, Trash, Trash2 } from 'lucide-vue-next'
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
}

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

const isDeleting = ref(false)
async function handleDelete(all = false) {
  isDeleting.value = true
  const body = all ? { slug: slug.value, id: selectedVersion.value?.id } : { id: selectedVersion.value?.id }
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
  <div class="pb-8">
    <div class="flex w-full">
      <div class="flex-shrink-0 mt-4 mr-4">
        <Clock class="w-6 h-6 text-gray-300" />
        <div class="flex flex-col-reverse gap-3 mt-3">
          <div
            v-for="(version, index) in data"
            :key="version.id"
          >
            <UiTooltip :delay-duration="100">
              <UiTooltipTrigger as-child>
                <UiButton
                  class="justify-start h-auto p-1 overflow-hidden text-left text-gray-400 rounded-lg outline-1 hover:text-primary"
                  :class="{ 'outline outline-primary !text-primary': selectedVersion?.id === version.id }"
                  variant="secondary"
                  @click="handleChangeVersion(version)"
                >
                  <UiBadge variant="outline" class="bg-white">
                    v{{ data!.length - 1 - index }}
                  </UiBadge>
                </UiButton>
              </UiTooltipTrigger>

              <UiTooltipContent align="start" side="right" class="text-sm max-w-64">
                {{ version.description }}
              </UiTooltipContent>
            </UiTooltip>
          </div>
        </div>
      </div>

      <div class="flex-1 w-full">
        <div class="flex justify-between">
          <div class="flex items-center gap-2">
            <UiAvatar v-if="dataUser" class="w-9 h-9">
              <UiAvatarImage :src="dataUser.avatarUrl ?? ''" />
              <UiAvatarFallback>{{ dataUser.name?.slice(0, 1) }}</UiAvatarFallback>
            </UiAvatar>
            <div class="text-sm max-w-[32rem] text-ellipsis whitespace-nowrap overflow-hidden">
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

            <UiButton :disabled="!sfcString" variant="outline" @click="copy(selectedVersion?.code ?? '')">
              <ClipboardCheck v-if="copied" class="py-1 mr-1 -ml-1" />
              <Clipboard v-else class="py-1 mr-1 -ml-1" />
              <span>{{ copied ? 'Copied' : 'Copy' }}</span>
            </UiButton>
            <UiButton :loading="!sfcString" @click="isPreviewing = !isPreviewing">
              <Code2Icon class="py-1 mr-1 -ml-1" />
              <span>Preview</span>
            </UiButton>
          </div>
        </div>

        <div class="relative z-0 flex w-full mt-4 overflow-hidden border rounded-xl" :class="[isUserCreator ? 'h-[calc(100vh-14rem)]' : 'h-[calc(100vh-10rem)]']">
          <LazyOutputCode v-show="isPreviewing" :sfc-string="sfcString" />
          <iframe ref="iframeRef" :src="`/p/${slug}`" class="w-full h-full" />
        </div>
      </div>
    </div>

    <div v-if="isUserCreator" class="relative flex items-center justify-center w-full gap-2 mt-16">
      <PromptInput v-model="prompt" :loading="loading" class="absolute bottom-0 -translate-x-1/2 left-1/2" placeholder="Make the padding larger" @submit="handleSubmit" />
    </div>
  </div>
</template>
