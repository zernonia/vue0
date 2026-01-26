<script setup lang="ts">
const props = defineProps<{
  data: DBComponent[] | null
}>()

const PAGE_SIZE = 15
const total = computed(() => (props.data?.length ?? 0))
const { currentPage } = useOffsetPagination({
  total,
  page: 1,
  pageSize: PAGE_SIZE,
})

const currentPageData = computed(() => props.data?.slice(((currentPage.value - 1) * PAGE_SIZE), (currentPage.value * PAGE_SIZE)))
</script>

<template>
  <div>
    <div v-if="data?.length" class="w-full md:px-4 grid md:grid-cols-3 gap-4 md:gap-8 max-w-[1200px] mx-auto">
      <NuxtLink
        v-for="item in currentPageData"
        :key="item.id"
        :to="`/t/${item.slug}`"
      >
        <UiCard class="shadow-none hover:shadow-lg hover:outline-primary overflow-hidden outline-transparent outline outline-1 transition-all flex">
          <UiCardContent class="w-full h-full p-0">
            <UiAspectRatio :ratio="16 / 9">
              <img :src="`/api/image/${item.id}`" class="w-full h-full object-cover">
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

    <div v-if="data?.length" class="w-full flex mt-8 mb-4 justify-center">
      <UiPagination v-model:page="currentPage" :total="total" :sibling-count="1" :items-per-page="PAGE_SIZE">
        <UiPaginationList v-slot="{ items }" class="flex items-center gap-2">
          <UiTooltip>
            <UiTooltipTrigger>
              <UiPaginationFirst />
            </UiTooltipTrigger>
            <UiTooltipContent>
              Go to first page
            </UiTooltipContent>
          </UiTooltip>
          <UiTooltip>
            <UiTooltipTrigger>
              <UiPaginationPrev />
            </UiTooltipTrigger>
            <UiTooltipContent>
              Go to previous page
            </UiTooltipContent>
          </UiTooltip>

          <template v-for="(item, index) in items">
            <UiPaginationListItem v-if="item.type === 'page'" :key="index" :value="item.value" as-child>
              <UiButton class="w-10 h-10 p-0" :variant="item.value === currentPage ? 'default' : 'outline'">
                {{ item.value }}
              </UiButton>
            </UiPaginationListItem>

            <UiPaginationEllipsis v-else :key="item.type" :index="index" />
          </template>

          <UiTooltip>
            <UiTooltipTrigger>
              <UiPaginationNext />
            </UiTooltipTrigger>
            <UiTooltipContent>
              Go to next page
            </UiTooltipContent>
          </UiTooltip>
          <UiTooltip>
            <UiTooltipTrigger>
              <UiPaginationLast />
            </UiTooltipTrigger>
            <UiTooltipContent>
              Go to last page
            </UiTooltipContent>
          </UiTooltip>
        </UiPaginationList>
      </UiPagination>
    </div>
  </div>
</template>
