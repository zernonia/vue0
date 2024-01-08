<script setup lang="ts">
import { Github } from 'lucide-vue-next'
import { useToast } from '~/components/ui/toast'

const prompt = ref('')

const { data } = useFetch<DBComponent[]>('/api/component/all')
const { isNewPrompt, handleInit, loading } = usePrompt()
const { toast } = useToast()
const openaiKey = useOpenAIKey()
const { loggedIn } = useUserSession()

const showLoginDialog = ref(false)
const showSetupOpenAiDialog = ref(true)

async function handleSubmit() {
  if (!prompt.value)
    return

  if (!loggedIn.value) {
    showLoginDialog.value = true
    return
  }

  if (!openaiKey.value) {
    showSetupOpenAiDialog.value = true
    return
  }

  loading.value = true
  isNewPrompt.value = true
  umTrackEvent('create-generation')
  try {
    const result = await handleInit(prompt.value)
    await navigateTo(`/t/${result.slug}`)
  }
  catch (err) {
    console.log({ err })
    toast({
      variant: 'destructive',
      title: 'Error',
      // @ts-expect-error ignore error for now
      description: err?.data?.message ?? 'Something wrong',
    })
  }
  finally {
    loading.value = false
  }
}

function saveOpenaiKey() {
  if (openaiKey.value.startsWith('sk-') === false) {
    toast({
      variant: 'destructive',
      title: 'Error',
      description: 'Please enter a correct OpenAI API key',
    })
    return
  }

  showSetupOpenAiDialog.value = false
}

useSeoMeta({
  ogImage: `${useRuntimeConfig().public.siteUrl}/og.png`,
})
</script>

<template>
  <div class="pb-4 md:pb-8">
    <div class="mb-8 w-full h-[65vh] flex items-center justify-center magicpattern">
      <UiCard class="mx-auto md:min-w-96 w-full max-w-[600px]">
        <UiCardHeader>
          <UiCardTitle>Generate component with prompt</UiCardTitle>
        </UiCardHeader>

        <UiCardContent>
          <PromptInput v-model="prompt" placeholder="A login page" :loading="loading" @submit="handleSubmit" />
        </UiCardContent>
      </UiCard>
    </div>

    <div class="w-full p-3 md:p-6 border bg-secondary rounded-xl">
      <h2 class="my-3 md:my-6 text-2xl md:text-3xl font-bold text-center">
        Generated
      </h2>
      <GeneratedList :data="data" />
    </div>

    <DialogDelete
      v-model:open="showLoginDialog"
      title="Sign in to vue0.dev"
      description="A Github account is required to use vue0."
    >
      <template #footer>
        <a href="/api/auth/github" @click="umTrackEvent('login')">
          <UiButton>
            <Github class="mr-2 h-4 w-4" />
            <span>Login with GitHub</span>
          </UiButton>
        </a>
      </template>
    </DialogDelete>

    <DialogDelete
      v-model:open="showSetupOpenAiDialog"
      title="Setup OpenAI API Key"
    >
      <template #body>
        <form class="flex flex-col gap-4" @submit.prevent="saveOpenaiKey">
          <p class="text-sm">
            Get your own <a href="https://platform.openai.com/api-keys" target="_blank" class="underline">OpenAI API key</a> and enter it below:
          </p>

          <div class="px-1 pb-1 w-full">
            <UiInput v-model="openaiKey" placeholder="sk-************ (Required)" required />
          </div>

          <UiButton type="submit" class="mx-auto">
            <span>Save</span>
          </UiButton>
        </form>
      </template>
    </DialogDelete>
  </div>
</template>
