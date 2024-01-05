<script setup lang="ts">
const route = useRoute()
const slug = computed(() => route.params.slug.toString())

const { data } = await useFetch<DBComponent[]>(`/api/component/${slug.value}`)
const sfcString = ref(data.value?.[0].code ?? '')

onMounted(() => {
  window.addEventListener('message', (e: MessageEvent) => {
    const message = e.data as { from: string, data: string }
    if (e.origin === location.origin && message.from === 'vue0')
      sfcString.value = message.data
  })
})

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
