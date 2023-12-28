<script setup lang="ts">
import * as Vue from 'vue'
import * as Icon from 'lucide-vue-next'

// @ts-expect-error package type issue
import { loadModule } from 'vue3-sfc-loader/dist/vue3-sfc-loader.esm.js'

const Comp = defineAsyncComponent(() => loadModule('Comp.vue', {
  moduleCache: {
    'vue': Vue,
    'lucide-vue-next': Icon,
  },
  // pathResolve({ refPath, relPath }) {
  //   return refPath
  // },
  getFile: async (url) => {
    return `<template>vue3-sfc-loader esm version</template>`
  },
  addStyle() {},
  // getResource({ refPath, relPath }, options) {
  //   return {
  //     id: '123',
  //     path: refPath,
  //     getContent() {
  //       return ''
  //     },
  //   }
  // },
}))
</script>

<template>
  <div>
    <Comp />
  </div>
</template>
