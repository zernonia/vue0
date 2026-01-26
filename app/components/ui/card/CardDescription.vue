<script setup lang="ts">
 

const props = defineProps({
  class: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <p :class="cn('text-sm text-muted-foreground', props.class)">
    <slot />
  </p>
</template>
