<script setup lang="ts">
defineProps<{
  data: DBComponent[] | null
}>()
</script>

<template>
  <div v-if="data?.length" class="w-full md:px-4 grid md:grid-cols-3 gap-4 md:gap-8 max-w-[1200px] mx-auto">
    <NuxtLink
      v-for="item in data"
      :key="item.id"
      :to="`/t/${item.slug}`"
    >
      <UiCard class="shadow-none hover:shadow-lg hover:outline-primary overflow-hidden outline-transparent outline outline-1 transition-all flex">
        <UiCardContent class="w-full h-full p-0">
          <UiAspectRatio :ratio="16 / 9">
            <img :src="`/api/image/${item.slug}`" class="w-full h-full object-cover">
          </UiAspectRatio>
        </UiCardContent>
      </UiCard>
      <UiTooltip>
        <div class="px-4 py-2 flex gap-2 items-center w-full">
          <UiAvatar v-if="item.user" class="w-6 h-6 flex-shrink-0">
            <UiAvatarImage :src="item.user.avatarUrl ?? ''" />
            <UiAvatarFallback>{{ item.user.name?.slice(0, 1) }}</UiAvatarFallback>
          </UiAvatar>
          <UiTooltipTrigger as="div">
            <p class="text-sm line-clamp-1 overflow-hidden">
              {{ item.description }}
            </p>
          </UiTooltipTrigger>

          <UiTooltipContent class="max-w-64 text-sm">
            {{ item.description }}
          </UiTooltipContent>
        </div>
      </UiTooltip>
    </NuxtLink>
  </div>
</template>
