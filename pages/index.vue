<script setup lang="ts">
definePageMeta({
  layout: 'blank',
})

useSeoMeta({
  title: 'vue0 — new version coming soon',
  description: 'A new version of vue0 is on the way.',
})
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
    <div class="h-20 w-20 md:h-24 md:w-24">
      <Logo />
    </div>
    <h1 class="text-center text-2xl font-black md:text-4xl">
      Revamping vue0!
    </h1>
  </div>
</template>
