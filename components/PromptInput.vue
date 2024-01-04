<script setup lang="ts">
import { SparklesIcon } from 'lucide-vue-next'

const props = defineProps<{
  modelValue?: string
  loading?: boolean
  placeholder?: string
}>()

const emits = defineEmits<{
  'update:modelValue': [payload: string]
  'submit': [prompt: string]
}>()

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
})

const { textarea, input } = useTextareaAutosize()

syncRef(input, modelValue, { direction: 'ltr' })

useMagicKeys({
  passive: false,
  onEventFired(e) {
    // only trigger on slash and blurred
    if (e.code === 'Slash' && e.type === 'keydown' && document.activeElement !== textarea.value) {
      e.preventDefault()
      textarea.value?.focus()
    }
  },
})

function handleSubmit() {
  emits('submit', input.value)
}
</script>

<template>
  <div class="flex items-end text-muted-foreground text-sm bg-muted px-4 py-2 rounded-lg border focus-within:ring-1 focus-within:ring-primary">
    <textarea
      ref="textarea"
      v-model="input"
      class="outline-none resize-none my-1 h-[20px] no-scrollbar font-medium w-96 bg-transparent px-1"
      :placeholder="`${placeholder}.   (Press ‘/‘ to type)`"
      @keyup.ctrl.enter="handleSubmit"
      @keydown.meta.enter="handleSubmit"
    />
    <UiTooltip :delay-duration="100">
      <UiTooltipTrigger as-child>
        <UiButton size="icon" class="ml-4 mb-0.5 p-0 w-6 h-6 rounded" variant="ghost" :loading="loading" :disabled="loading || !input?.length" @click="handleSubmit">
          <SparklesIcon class="p-0.5" />
        </UiButton>
      </UiTooltipTrigger>

      <UiTooltipContent>
        Click to submit prompt
      </UiTooltipContent>
    </UiTooltip>
  </div>
</template>
