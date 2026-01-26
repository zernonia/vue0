<!-- eslint-disable vue/one-component-per-file -->
<script setup lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import { compileScript, parse } from '@vue/compiler-sfc'
import * as Icon from 'lucide-vue-next'
import { useToast } from '@/components/ui/toast'

const props = defineProps<{
  sfcString: string
  errorMessage: string | null | undefined
}>()

const files = import.meta.glob('../components/ui/**/*.ts', { eager: true })

const Comp = computed(() => {
  if (props.errorMessage) {
    return defineComponent({
      template: `<div class="w-screen h-screen flex items-center justify-center text-destructive"><div>Error: ${props.errorMessage}</div></div>`,
    })
  }
  const [_, templateString] = props?.sfcString?.split('<template>')
  if (!templateString || !props?.sfcString) {
    return defineComponent({
      template: '<div class="w-screen h-screen flex items-center justify-center"><div>Generating...</div></div>',
    })
  }

  const { descriptor } = parse(props?.sfcString)
  const template = parseTemplate(templateString ?? '')
  const script = compileScript(descriptor, { id: '123' })

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

  const otherNodes = script.scriptSetupAst?.filter(i => i.type !== 'ImportDeclaration')
  const variableNodes = script.scriptSetupAst?.filter(i => i.type === 'VariableDeclaration')
  const returnedValue: string[] = []

  variableNodes?.forEach((node) => {
    if ('declarations' in node) {
      const childNode = node.declarations[0].id
      switch (childNode.type) {
        case 'Identifier': {
          returnedValue.push(childNode.name)
          break
        }
        case 'ObjectPattern': {
          if (childNode.properties[0].type === 'ObjectProperty' && childNode.properties[0].value.type === 'Identifier')
            returnedValue.push(childNode.properties[0].value.name)
          break
        }
        default: {
          // very bad manual parsing.. not sure if there's a better way
        }
      }
    }
  })

  // no-eval allow eval temporarily
  // eslint-disable-next-line no-eval
  const setupString = eval(`({ setup() {
    ${otherNodes?.map(node => `${script.loc.source.slice(node.start!, node.end!)}\n`).join('')}
    return { ${returnedValue.join(',')} }
  }})`)

  console.log({
    setupString,
    template,
  })

  return defineComponent({
    components,
    setup: setupString?.setup,
    template: template ?? '<div class="w-screen h-screen flex items-center justify-center"><div>Empty</div></div>',
  })
})
</script>

<template>
  <Comp />
</template>
