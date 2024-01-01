<script setup lang="ts">
import { getHighlighter } from 'shikiji'

const props = defineProps<{
  sfcString: string
}>()

const highlighter = await getHighlighter({
  langs: ['vue'],
  themes: [
    {
      name: 'my-theme',
      settings: [
        {
          scope: 'string',
          settings: {
            foreground: '#00D8FF',
          },
        },
        {
          scope: 'entity.other.attribute-name',
          settings: {
            foreground: '#E62286',
          },
        },
        {
          scope: 'keyword',
          settings: {
            foreground: '#9f9f9f',
          },
        },
        {
          scope: 'comment',
          settings: {
            foreground: '#9f9f9f',
          },
        },
      ],
      bg: 'hsl(var(--primary))',
      fg: 'hsl(var(--secondary))',
    },
  ],
})

const code = computed(() => highlighter.codeToHtml(props.sfcString, {
  lang: 'vue',
  theme: 'my-theme',
}))
</script>

<template>
  <div class="text-sm px-6 pb-6 absolute w-full overflow-y-auto h-full z-[100] bg-primary text-primary-foreground" v-html="code" />
</template>
