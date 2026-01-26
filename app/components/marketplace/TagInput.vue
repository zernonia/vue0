<script setup lang="ts">
import { ref, computed } from 'vue'
import { X } from 'lucide-vue-next'

interface Tag {
  id: string
  name: string
  slug: string
  type: string
  color?: string
}

const props = defineProps<{
  tags: Tag[]
  disabled?: boolean
  max?: number
}>()

const modelValue = defineModel<string[]>({ default: [] })

const search = ref('')
const isOpen = ref(false)

const selectedTags = computed(() => {
  return props.tags.filter(tag => modelValue.value.includes(tag.id))
})

const availableTags = computed(() => {
  const query = search.value.toLowerCase()
  return props.tags
    .filter(tag => !modelValue.value.includes(tag.id))
    .filter(tag =>
      query === '' ||
      tag.name.toLowerCase().includes(query) ||
      tag.type.toLowerCase().includes(query)
    )
})

const tagsByType = computed(() => {
  return availableTags.value.reduce((acc, tag) => {
    if (!acc[tag.type]) {
      acc[tag.type] = []
    }
    acc[tag.type].push(tag)
    return acc
  }, {} as Record<string, Tag[]>)
})

const canAddMore = computed(() => {
  const maxTags = props.max || 10
  return modelValue.value.length < maxTags
})

function addTag(tagId: string) {
  if (!modelValue.value.includes(tagId) && canAddMore.value) {
    modelValue.value = [...modelValue.value, tagId]
  }
  search.value = ''
}

function removeTag(tagId: string) {
  modelValue.value = modelValue.value.filter(id => id !== tagId)
}

function getTagColor(color?: string) {
  const colors: Record<string, string> = {
    gray: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100',
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
    green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
    pink: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100',
    red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
    orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
    cyan: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-100',
  }
  return colors[color || 'gray'] || colors.gray
}

const typeLabels: Record<string, string> = {
  'style': 'Style',
  'framework': 'Framework',
  'feature': 'Feature',
  'use-case': 'Use Case',
}
</script>

<template>
  <div class="space-y-2">
    <!-- Selected tags -->
    <div v-if="selectedTags.length > 0" class="flex flex-wrap gap-2">
      <UiBadge
        v-for="tag in selectedTags"
        :key="tag.id"
        :class="getTagColor(tag.color)"
        class="flex items-center gap-1"
      >
        {{ tag.name }}
        <button
          type="button"
          :disabled="disabled"
          class="ml-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10"
          @click="removeTag(tag.id)"
        >
          <X class="h-3 w-3" />
        </button>
      </UiBadge>
    </div>

    <!-- Tag picker -->
    <UiPopover v-model:open="isOpen">
      <UiPopoverTrigger as-child>
        <UiButton
          type="button"
          variant="outline"
          :disabled="disabled || !canAddMore"
          class="w-full justify-start"
        >
          <span v-if="canAddMore">
            Add tags... ({{ modelValue.length }}/{{ max || 10 }})
          </span>
          <span v-else>
            Maximum tags reached
          </span>
        </UiButton>
      </UiPopoverTrigger>
      <UiPopoverContent class="w-[400px] p-0" align="start">
        <UiCommand>
          <UiCommandInput
            v-model="search"
            placeholder="Search tags..."
          />
          <UiCommandEmpty>No tags found.</UiCommandEmpty>
          <UiCommandList>
            <UiCommandGroup
              v-for="(groupTags, type) in tagsByType"
              :key="type"
              :heading="typeLabels[type] || type"
            >
              <UiCommandItem
                v-for="tag in groupTags"
                :key="tag.id"
                :value="tag.id"
                @select="addTag(tag.id)"
              >
                <UiBadge
                  :class="getTagColor(tag.color)"
                  class="text-xs"
                >
                  {{ tag.name }}
                </UiBadge>
              </UiCommandItem>
            </UiCommandGroup>
          </UiCommandList>
        </UiCommand>
      </UiPopoverContent>
    </UiPopover>
  </div>
</template>
