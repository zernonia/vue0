<script setup lang="ts">
import { SparklesIcon } from 'lucide-vue-next'

const props = defineProps<{
  modelValue?: string
  loading?: boolean
  disabled?: boolean
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
const textareaFocused = ref(false)

// @ts-expect-error based on docs it shouldn't need 3rd argument
syncRef(input, modelValue)

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
</script>

<template>
  <div class="flex items-end px-2 md:px-4 py-2 text-sm border rounded-lg text-muted-foreground bg-muted focus-within:ring-1 focus-within:ring-primary">
    <textarea
      ref="textarea"
      v-model="input"
      :disabled="loading || disabled"
      class="outline-none resize-none my-1 h-[20px] no-scrollbar font-medium w-full md:min-w-[26rem] bg-transparent px-1"
      :placeholder="`${placeholder}.   ${textareaFocused ? '(Press ‘Cmd+Enter‘ to generate)' : '(Press ‘/‘ to type)'}`"
      @focus="textareaFocused = true"
      @blur="textareaFocused = false"
      @keydown.meta.enter="emits('submit', input)"
      @keydown.ctrl.enter="emits('submit', input)"
    />
    <UiTooltip :delay-duration="100">
      <UiTooltipTrigger as-child>
        <UiButton size="icon" class="ml-4 mb-0.5 p-0 w-6 h-6 rounded" variant="ghost" :loading="loading" :disabled="disabled || loading || !input?.length" @click="emits('submit', input)">
          <SparklesIcon class="p-0.5" />
        </UiButton>
      </UiTooltipTrigger>

      <UiTooltipContent>
        Click to submit prompt
      </UiTooltipContent>
    </UiTooltip>
  </div>
</template>
