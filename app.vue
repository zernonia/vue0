<script setup lang="ts">
useHead({
  script: [
    { src: '/cdn/tailwind.js' },
  ],
})
</script>

<template>
  <UiTooltipProvider>
    <NuxtLoadingIndicator color="hsl(var(--primary))" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UiTooltipProvider>
</template>
