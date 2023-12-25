<script setup lang="ts">
const { data } = useFetch('/api/list')
const componentList = shallowRef()

watch(data, async (items) => {
  if (!items)
    return
  componentList.value = await Promise.all(items.map(async (item) => {
    return (await import(`@/components/generated/${item?.name.replace('.json', '')}.vue`)).default
  }))
}, { immediate: true, deep: true })
</script>

<template>
  <div class="w-full px-4 flex flex-col gap-8">
    <div v-for="(comp, index) in componentList" :key="index" class="border rounded-xl shadow overflow-hidden">
      <component :is="comp" />
    </div>
  </div>
</template>
