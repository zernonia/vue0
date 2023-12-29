<script setup lang="ts">
const openaiKey = useOpenAIKey()

useHead({
  script: [
    { src: '/cdn/tailwind.js' },
  ],
})
</script>

<template>
  <div>
    <div class="w-full h-full flex flex-col items-center justify-center ">
      <header class="flex p-4 w-full">
        <NuxtLink to="/" class="font-bold text-2xl ">
          vue0
        </NuxtLink>

        <div class="mx-auto" />

        <div>
          <UiInput v-model="openaiKey" placeholder="OpenAI API key" />
        </div>
      </header>
      <div class="p-4 w-full">
        <NuxtPage />
      </div>
    </div>

    <UiToaster />
  </div>
</template>
