<script setup lang="ts">
import { computed } from 'vue'

interface Category {
  id: string
  name: string
  slug: string
  icon: string
  description: string
}

const props = defineProps<{
  categories: Category[]
  disabled?: boolean
}>()

const modelValue = defineModel<string>()

const selectedCategory = computed(() => {
  return props.categories.find(c => c.slug === modelValue.value)
})
</script>

<template>
  <UiSelect v-model="modelValue" :disabled="disabled">
    <UiSelectTrigger>
      <UiSelectValue placeholder="Select a category">
        <div v-if="selectedCategory" class="flex items-center gap-2">
          <component :is="selectedCategory.icon" class="h-4 w-4" />
          <span>{{ selectedCategory.name }}</span>
        </div>
      </UiSelectValue>
    </UiSelectTrigger>
    <UiSelectContent>
      <UiSelectItem
        v-for="category in categories"
        :key="category.id"
        :value="category.slug"
      >
        <div class="flex items-center gap-2">
          <component :is="category.icon" class="h-4 w-4" />
          <div>
            <div class="font-medium">
              {{ category.name }}
            </div>
            <div class="text-xs text-muted-foreground">
              {{ category.description }}
            </div>
          </div>
        </div>
      </UiSelectItem>
    </UiSelectContent>
  </UiSelect>
</template>
