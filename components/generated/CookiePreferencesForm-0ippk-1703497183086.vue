
<script setup lang="ts">
import { ref } from 'vue';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
</script>

<template>
  <div class="bg-white dark:bg-black p-6 rounded-lg max-w-md mx-auto my-8">
    <h2 class="text-lg font-semibold mb-4">Cookie Preferences</h2>
    <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
      Manage your cookie settings by toggling the check for each category.
    </p>
    <div class="flex flex-col gap-4 mb-6">
      <div>
        <Checkbox id="necessary" />
        <label
          for="necessary"
          class="ml-2 text-sm text-gray-600 dark:text-gray-400"
        >
          Necessary Cookies
        </label>
      </div>
      <div>
        <Checkbox id="analytics" />
        <label
          for="analytics"
          class="ml-2 text-sm text-gray-600 dark:text-gray-400"
        >
          Analytics Cookies
        </label>
      </div>
      <div>
        <Checkbox id="marketing" />
        <label
          for="marketing"
          class="ml-2 text-sm text-gray-600 dark:text-gray-400"
        >
          Marketing Cookies
        </label>
      </div>
    </div>
    <div class="border-t pt-4">
      <Checkbox id="selectAll" />
      <label
        for="selectAll"
        class="ml-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer"
      >
        Select All
      </label>
    </div>
    <div class="mt-6 flex justify-between">
      <Button variant="secondary">Cancel</Button>
      <Button>Save Preferences</Button>
    </div>
  </div>
</template>
