<script setup lang="ts">
import { compileScript, compileTemplate, parse } from '@vue/compiler-sfc'
import * as Icon from 'lucide-vue-next'
import Raw from '@/components/generated/CookiePreferencesForm-0ippk-1703497183086.vue?raw'

const files = import.meta.glob('../components/ui/**/*.ts', { eager: true })

const { descriptor } = parse(Raw)
const template = compileTemplate({ id: '123', filename: 'main.vue', source: descriptor.template?.content ?? '' })
const script = compileScript(descriptor, { id: '123' })
console.log({ descriptor, script, template })

const components = {}
Object.entries(script.imports!).forEach(async ([key, value]) => {
  if (value.source === 'lucide-vue-next')
  // @ts-expect-error ignore ts
    components[key] = Icon[key]

  if (value.source.includes('components/ui')) {
    const path = `${value.source.replace('@/components/', './')}/index.ts`
    // @ts-expect-error ignore ts
    components[key] = files[path]?.[key]
  }
})

const Comp = defineComponent({
  components,
  template: descriptor.template?.content ?? '<div>Empty</div>',
})
</script>

<template>
  <div>
    <Comp />
  </div>
</template>
