<script setup lang="ts">
import { GithubLogoIcon } from '@radix-icons/vue'

const openaiKey = useOpenAIKey()
</script>

<template>
  <div>
    <div class="w-full h-full flex flex-col items-center justify-center ">
      <header class="flex p-4 w-full">
        <NuxtLink to="/" class="font-bold text-2xl ">
          vue0
        </NuxtLink>

        <div class="mx-auto" />

        <div class="flex items-center gap-2">
          <UiButton as-child>
            <NuxtLink to="https://github.com/zernonia/vue0" target="_blank">
              <GithubLogoIcon class="mr-2" /> GitHub
            </NuxtLink>
          </UiButton>
          <UiInput v-model="openaiKey" placeholder="OpenAI API key" />
        </div>
      </header>
      <div class="px-4 w-full">
        <slot />
      </div>
    </div>

    <UiToaster />
  </div>
</template>
