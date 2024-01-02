<script setup lang="ts">
defineProps<{
  data: DBComponent[] | null
}>()
</script>

<template>
  <div v-if="data?.length" class="w-full px-4 grid md:grid-cols-3 gap-8 max-w-[1200px] mx-auto">
    <NuxtLink
      v-for="item in data"
      :key="item.id"
      :to="`/t/${item.slug}`"
    >
      <UiCard class="shadow-none hover:shadow-lg hover:outline-primary overflow-hidden outline-transparent outline outline-1 transition-all flex w-full h-[300px]">
        <UiCardContent class="w-full h-full p-0 relative pointer-events-none">
          <OutputWrapper>
            <!-- TODO: Improve this is a wacky solution with better preview -->
            <div class="scale-[0.9] md:scale-[calc(0.2925)] origin-top-left left-0 top-0 absolute w-screen h-screen">
              <LazyOutput v-if="item.code" :sfc-string="item.code" />
              <div v-else>
                Empty
              </div>
            </div>
          </OutputWrapper>
        </UiCardContent>
      </UiCard>
      <UiTooltip>
        <div class="px-4 py-2 flex gap-2 items-center w-full">
          <UiAvatar class="w-6 h-6 flex-shrink-0">
            <UiAvatarImage :src="item?.user?.avatarUrl ?? ''" />
            <UiAvatarFallback>{{ item?.user?.name?.slice(0, 1) }}</UiAvatarFallback>
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
