<script setup lang="ts">
import { AlertDialogOverlay, DialogClose } from 'radix-vue'
import { X } from 'lucide-vue-next'

defineProps<{
  title?: string
  description?: string
}>()

defineEmits<{
  (event: 'update:open', value: boolean): void
}>()
</script>

<template>
  <UiAlertDialog>
    <UiAlertDialogTrigger v-if="$slots.default" as-child>
      <slot />
    </UiAlertDialogTrigger>

    <UiAlertDialogContent>
      <UiAlertDialogHeader v-if="title || description">
        <UiAlertDialogTitle v-if="title">
          {{ title }}
        </UiAlertDialogTitle>
        <UiAlertDialogDescription v-if="description">
          {{ description }}
        </UiAlertDialogDescription>
      </UiAlertDialogHeader>

      <slot name="body" />

      <DialogClose
        class="absolute top-2 right-2 appearance-none items-center justify-center rounded-full focus:outline-none cursor-pointer"
        aria-label="Close"
      >
        <X @click="$emit('update:open', false)" />
      </DialogClose>

      <UiAlertDialogFooter v-if="$slots.footer" class="sm:justify-center">
        <slot name="footer" />
      </UiAlertDialogFooter>
    </UiAlertDialogContent>
  </UiAlertDialog>
</template>
