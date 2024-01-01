<script setup lang="ts">
import { cva } from 'class-variance-authority'
import { Loader2 } from 'lucide-vue-next'

defineProps<{
  size?: NonNullable<Parameters<typeof loaderVariants>[0]>['size']
}>()

const loaderVariants = cva(
  'animate-spin',
  {
    variants: {
      size: {
        default: 'h-6 w-6',
        sm: 'h-4 w-4',
        lg: 'h-9 w-9',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
)
</script>

<template>
  <Loader2 :class="cn(loaderVariants({ size }), $attrs.class ?? '')" />
</template>
