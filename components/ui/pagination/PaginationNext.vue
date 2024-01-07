<script setup lang="ts">
import { PaginationNext, type PaginationNextProps, useForwardProps } from 'radix-vue'
import { ChevronRightIcon } from '@radix-icons/vue'
import {
  Button,
} from '@/components/ui/button'

const props = withDefaults(defineProps<PaginationNextProps>(), {
  asChild: true,
})
const forwarded = useForwardProps(props)
</script>

<template>
  <PaginationNext v-bind="forwarded">
    <Button class="w-10 h-10 p-0" variant="outline">
      <slot>
        <ChevronRightIcon />
      </slot>
    </Button>
  </PaginationNext>
</template>
