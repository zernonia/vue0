<script setup lang="ts">
useHead({
  script: [
    { src: '/cdn/tailwind.js' },
  ],
})
</script>

<template>
  <UiTooltipProvider>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UiTooltipProvider>
</template>
