<script setup lang="ts">
const route = useRoute()
const slug = computed(() => route.params.slug.toString())

const { data } = await useFetch<DBComponent[]>(`/api/component/${slug.value}`)
const sfcString = ref(data.value?.[0].code ?? '')
const errorMessage = ref(data.value?.[0].error)

onMounted(() => {
  window.addEventListener('message', (e: MessageEvent) => {
    const message = e.data as { from: string, data: IframeData }
    if (e.origin === location.origin && message.from === 'vue0') {
      sfcString.value = message.data.code
      errorMessage.value = message.data.error
    }
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
      <Output v-if="sfcString || errorMessage" :sfc-string="sfcString" :error-message="errorMessage" />
    </OutputWrapper>
  </div>
</template>
