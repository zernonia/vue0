<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  avatarUrl?: string
  imageUrl?: string
}>(), {
  title: 'title',
})
</script>

<template>
  <div class="relative h-full w-full flex items-center justify-center bg-slate-100">
    <div class="flex items-center justify-center w-full h-full">
      <img :src="imageUrl" class="w-[48rem] h-[27rem] mb-12 border border-solid border-slate-200 rounded-2xl overflow-hidden">
    </div>

    <div class="absolute bottom-8 left-8 flex items-center">
      <img :src="avatarUrl" class="flex-shrink-0 w-32 h-32 rounded-full overflow-hidden">

      <p class="max-w-[1000px] text-balance text-4xl font-semibold ml-6">
        {{ title }}
      </p>
    </div>
  </div>
</template>
