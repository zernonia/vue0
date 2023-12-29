<script setup lang="ts">
defineProps<{
  data: DBComponent[] | null
}>()
</script>

<template>
  <div v-if="data?.length" class="w-full px-4 flex flex-col gap-8">
    <NuxtLink
      v-for="item in data"
      :key="item.id"
      :to="`/t/${item.slug}`"
    >
      <UiCard class="py-12 hover:shadow-lg transition  flex w-full h-full">
        <UiCardContent class="m-auto">
          <OutputWrapper>
            <LazyOutput v-if="item.code" :sfc-string="item.code" />
            <div v-else>
              Empty
            </div>
          </OutputWrapper>
        </UiCardContent>
      </UiCard>
    </NuxtLink>
  </div>
</template>
