<script setup lang="ts">
import { PaginationFirst, type PaginationFirstProps, useForwardProps } from 'radix-vue'
import { DoubleArrowLeftIcon } from '@radix-icons/vue'
import {
  Button,
} from '@/components/ui/button'

const props = withDefaults(defineProps<PaginationFirstProps>(), {
  asChild: true,
})
const forwarded = useForwardProps(props)
</script>

<template>
  <PaginationFirst v-bind="forwarded">
    <Button class="w-10 h-10 p-0" variant="outline">
      <slot>
        <DoubleArrowLeftIcon />
      </slot>
    </Button>
  </PaginationFirst>
</template>
