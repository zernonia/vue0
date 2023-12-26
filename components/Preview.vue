<script setup lang="ts">
import type { Component } from 'vue'

const route = useRoute()
const slug = computed(() => route.params.slug)

const comp = shallowRef<Component>()
const { data } = useFetch(`/api/component/${slug.value}`)

watch(data, async (n) => {
  if (!n || Array.isArray(n))
    return
  comp.value = (await import(`@/components/generated/${n.name.replace('.json', '')}.vue`)).default
}, { immediate: true, deep: true })
</script>

<template>
  <div>
    <component :is="comp" />
  </div>
</template>
