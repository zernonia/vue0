<script setup lang="ts">
const route = useRoute()
const slug = computed(() => route.params.slug.toString())

const { data } = await useFetch<DBComponent[]>(`/api/component/${slug.value}`)
const sfcString = computed(() => data.value?.[0].code ?? '')

definePageMeta({
  layout: 'blank',
})
</script>

<template>
  <OutputWrapper>
    <Output v-if="sfcString" :sfc-string="sfcString" />
  </OutputWrapper>
</template>
