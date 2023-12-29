<script setup lang="ts">
import { getHighlighter } from 'shikiji'

const props = defineProps<{
  sfcString: string
}>()

const highlighter = await getHighlighter({
  themes: ['rose-pine'],
  langs: ['vue'],
})

const code = computed(() => highlighter.codeToHtml(props.sfcString, {
  lang: 'vue',
  theme: 'rose-pine',
}))
</script>

<template>
  <div class="text-sm px-6 pb-6 absolute w-full overflow-y-auto h-full z-10 bg-[#191724] text-primary-foreground" v-html="code" />
</template>
