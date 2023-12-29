<script setup lang="ts">
</script>

<template>
  <NuxtErrorBoundary>
    <Suspense>
      <slot />

      <template #fallback>
        <p> loading...</p>
      </template>
    </Suspense>

    <template #error="{ error }">
      <p>An error occurred: {{ error }}</p>
    </template>
  </NuxtErrorBoundary>
</template>
