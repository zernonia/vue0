<script setup lang="ts">
import { ref, computed } from 'vue'
import { z } from 'zod'

const props = defineProps<{
  componentId: string
  componentTitle?: string
}>()

const emit = defineEmits<{
  success: [data: any]
  close: []
}>()

const open = defineModel<boolean>('open', { default: false })

// Form data
const form = ref({
  title: props.componentTitle || '',
  description: '',
  longDescription: '',
  category: '',
  tags: [] as string[],
  license: 'MIT',
  repositoryUrl: '',
})

const loading = ref(false)
const errors = ref<Record<string, string>>({})
const submitError = ref('')
const submitSuccess = ref(false)

// Fetch categories and tags
const { data: categoriesData } = await useFetch('/api/marketplace/categories')
const { data: tagsData } = await useFetch('/api/marketplace/tags')

const categories = computed(() => categoriesData.value?.data || [])
const tags = computed(() => tagsData.value?.data.all || [])

async function handleSubmit() {
  loading.value = true
  errors.value = {}
  submitError.value = ''

  try {
    const response = await $fetch('/api/marketplace/submit', {
      method: 'POST',
      body: {
        componentId: props.componentId,
        ...form.value,
      },
    })

    submitSuccess.value = true
    emit('success', response)

    // Close dialog after 2 seconds
    setTimeout(() => {
      open.value = false
      submitSuccess.value = false
    }, 2000)
  }
  catch (error: any) {
    if (error.data?.data) {
      // Validation errors
      errors.value = error.data.data
    }
    else {
      submitError.value = error.data?.message || 'Failed to submit component'
    }
  }
  finally {
    loading.value = false
  }
}

function handleClose() {
  if (!loading.value) {
    emit('close')
    open.value = false
  }
}
</script>

<template>
  <UiDialog v-model:open="open">
    <UiDialogContent class="max-w-2xl max-h-[90vh] overflow-y-auto">
      <UiDialogHeader>
        <UiDialogTitle>Submit to Marketplace</UiDialogTitle>
        <UiDialogDescription>
          Share your component with the community. It will be reviewed before being published.
        </UiDialogDescription>
      </UiDialogHeader>

      <form
        v-if="!submitSuccess"
        class="space-y-6 py-4"
        @submit.prevent="handleSubmit"
      >
        <!-- Title -->
        <div class="space-y-2">
          <UiLabel for="title">
            Title
            <span class="text-destructive">*</span>
          </UiLabel>
          <UiInput
            id="title"
            v-model="form.title"
            placeholder="Authentication Form"
            :disabled="loading"
            required
          />
          <p v-if="errors.title" class="text-sm text-destructive">
            {{ errors.title }}
          </p>
        </div>

        <!-- Description -->
        <div class="space-y-2">
          <UiLabel for="description">
            Short Description
            <span class="text-destructive">*</span>
          </UiLabel>
          <UiTextarea
            id="description"
            v-model="form.description"
            placeholder="A beautiful authentication form with validation..."
            rows="3"
            :disabled="loading"
            required
          />
          <p class="text-xs text-muted-foreground">
            {{ form.description.length }}/500 characters
          </p>
          <p v-if="errors.description" class="text-sm text-destructive">
            {{ errors.description }}
          </p>
        </div>

        <!-- Long Description (optional) -->
        <div class="space-y-2">
          <UiLabel for="longDescription">
            Detailed Description (optional)
          </UiLabel>
          <UiTextarea
            id="longDescription"
            v-model="form.longDescription"
            placeholder="This component includes email and password fields with real-time validation..."
            rows="4"
            :disabled="loading"
          />
        </div>

        <!-- Category -->
        <div class="space-y-2">
          <UiLabel for="category">
            Category
            <span class="text-destructive">*</span>
          </UiLabel>
          <MarketplaceCategorySelect
            v-model="form.category"
            :categories="categories"
            :disabled="loading"
          />
          <p v-if="errors.category" class="text-sm text-destructive">
            {{ errors.category }}
          </p>
        </div>

        <!-- Tags -->
        <div class="space-y-2">
          <UiLabel for="tags">
            Tags
            <span class="text-destructive">*</span>
          </UiLabel>
          <MarketplaceTagInput
            v-model="form.tags"
            :tags="tags"
            :disabled="loading"
          />
          <p class="text-xs text-muted-foreground">
            Select 1-10 tags to help users find your component
          </p>
          <p v-if="errors.tags" class="text-sm text-destructive">
            {{ errors.tags }}
          </p>
        </div>

        <!-- License -->
        <div class="space-y-2">
          <UiLabel for="license">License</UiLabel>
          <UiSelect v-model="form.license" :disabled="loading">
            <UiSelectTrigger>
              <UiSelectValue placeholder="Select license" />
            </UiSelectTrigger>
            <UiSelectContent>
              <UiSelectItem value="MIT">
                MIT
              </UiSelectItem>
              <UiSelectItem value="Apache-2.0">
                Apache 2.0
              </UiSelectItem>
              <UiSelectItem value="GPL-3.0">
                GPL 3.0
              </UiSelectItem>
              <UiSelectItem value="BSD-3-Clause">
                BSD 3-Clause
              </UiSelectItem>
            </UiSelectContent>
          </UiSelect>
        </div>

        <!-- Repository URL (optional) -->
        <div class="space-y-2">
          <UiLabel for="repositoryUrl">
            Repository URL (optional)
          </UiLabel>
          <UiInput
            id="repositoryUrl"
            v-model="form.repositoryUrl"
            type="url"
            placeholder="https://github.com/username/repo"
            :disabled="loading"
          />
          <p v-if="errors.repositoryUrl" class="text-sm text-destructive">
            {{ errors.repositoryUrl }}
          </p>
        </div>

        <!-- Error message -->
        <UiAlert v-if="submitError" variant="destructive">
          <UiAlertDescription>{{ submitError }}</UiAlertDescription>
        </UiAlert>

        <UiDialogFooter>
          <UiButton
            type="button"
            variant="outline"
            :disabled="loading"
            @click="handleClose"
          >
            Cancel
          </UiButton>
          <UiButton type="submit" :disabled="loading">
            <span v-if="loading">Submitting...</span>
            <span v-else>Submit for Review</span>
          </UiButton>
        </UiDialogFooter>
      </form>

      <!-- Success message -->
      <div v-else class="py-8 text-center">
        <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 class="mb-2 text-lg font-semibold">
          Successfully Submitted!
        </h3>
        <p class="text-sm text-muted-foreground">
          Your component has been submitted for review. You'll be notified once it's approved.
        </p>
      </div>
    </UiDialogContent>
  </UiDialog>
</template>
