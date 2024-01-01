<script setup lang="ts">
import { Primitive, type PrimitiveProps } from 'radix-vue'
import { Loader2 } from 'lucide-vue-next'
import { buttonVariants } from '.'

interface Props extends PrimitiveProps {
  variant?: NonNullable<Parameters<typeof buttonVariants>[0]>['variant']
  size?: NonNullable<Parameters<typeof buttonVariants>[0]>['size']
  as?: string
  loading?: boolean
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  as: 'button',
})
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    :class="cn(buttonVariants({ variant, size }), $attrs.class ?? '')"
    :disabled="loading || disabled"
  >
    <slot v-if="!loading" />
    <Loading v-else class="p-0.5" />
  </Primitive>
</template>
