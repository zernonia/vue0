<script setup lang="ts">
import type { Component } from 'vue'

const { data } = useFetch('/api/component/all')
const componentList = shallowRef<{ name: string, comp: Component }[]>()

watch(data, async (items) => {
  if (!items)
    return
  componentList.value = await Promise.all(items.map(async (item) => {
    const comp = (await import(`@/components/generated/${item?.name.replace('.json', '')}.vue`)).default
    return {
      name: item!.name,
      comp,
    }
  }))
}, { immediate: true, deep: true })
</script>

<template>
  <div class="w-full px-4 flex flex-col gap-8">
    <NuxtLink
      v-for="comp in componentList"
      :key="comp.name"
      :to="`/t/${comp.name}`"
      class="border rounded-xl block shadow overflow-hidden"
    >
      <component :is="comp.comp" />
    </NuxtLink>
  </div>
</template>
