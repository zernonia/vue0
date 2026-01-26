<script setup lang="ts">
const route = useRoute()
const id = computed(() => route.params.id.toString())

const { data } = await useFetch<DBComponent[]>(`/api/component/id/${id.value}`)
const sfcString = ref(data.value?.[0].code ?? '')

definePageMeta({
  layout: 'blank',
})

useHead({
  script: [
    { src: 'https://cdn.jsdelivr.net/gh/zernonia/vue0/public/cdn/tailwind.js' },
  ],
})
</script>

<template>
  <div>
    <OutputWrapper>
      <Output v-if="sfcString" :sfc-string="sfcString" />
    </OutputWrapper>
  </div>
</template>
