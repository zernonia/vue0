<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
}>()
</script>

<template>
  <UiDialog>
    <UiDialogTrigger v-if="$slots.default" as-child>
      <slot />
    </UiDialogTrigger>

    <UiDialogContent>
      <UiDialogHeader v-if="title || description">
        <UiDialogTitle v-if="title">
          {{ title }}
        </UiDialogTitle>
        <UiDialogDescription v-if="description">
          {{ description }}
        </UiDialogDescription>
      </UiDialogHeader>

      <slot name="body" />

      <UiDialogFooter v-if="$slots.footer" class="sm:justify-center">
        <slot name="footer" />
      </UiDialogFooter>
    </UiDialogContent>
  </UiDialog>
</template>
