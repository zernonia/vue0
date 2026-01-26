<script setup lang="ts">
import { PaginationPrev, type PaginationPrevProps, useForwardProps } from 'radix-vue'
import { ChevronLeftIcon } from '@radix-icons/vue'
import {
  Button,
} from '@/components/ui/button'

const props = withDefaults(defineProps<PaginationPrevProps>(), {
  asChild: true,
})
const forwarded = useForwardProps(props)
</script>

<template>
  <PaginationPrev v-bind="forwarded">
    <Button class="w-10 h-10 p-0" variant="outline">
      <slot>
        <ChevronLeftIcon />
      </slot>
    </Button>
  </PaginationPrev>
</template>
