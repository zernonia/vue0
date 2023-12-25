vue
<script setup lang="ts">
// If icons would be needed
// import { IconsPlugin } from someIconLibrary
</script>

<template>
  <div class="flex flex-col h-full dark:bg-black">
    <!-- Chat header -->
    <div class="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
      <h1 class="text-xl font-semibold dark:text-white">Chat</h1>
      <!-- Add icons if needed -->
    </div>
    <!-- Messages area -->
    <div class="flex-1 p-4 overflow-y-auto">
      <!-- Message - placeholder -->
      <div class="flex items-end space-x-2 mb-4">
        <div class="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600"></div>
        <div class="max-w-xs bg-gray-100 p-2 rounded-lg dark:bg-gray-700 dark:text-white">
          Hello there, this is a message!
        </div>
      </div>
      <!-- Another Message - placeholder -->
      <div class="flex items-end space-x-2 mb-4 flex-row-reverse">
        <div class="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600"></div>
        <div class="max-w-xs bg-blue-100 p-2 rounded-lg dark:bg-blue-900 dark:text-white">
          Hi! Great to hear from you!
        </div>
      </div>
    </div>
    <!-- Message input area -->
    <div class="p-4 border-t border-gray-200 dark:border-gray-700">
      <div class="flex items-center space-x-3">
        <input
          type="text"
          class="flex-1 bg-gray-200 p-2 rounded-full outline-none dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
          placeholder="Type a message"
        />
        <button
          class="bg-blue-500 text-white px-4 py-2 rounded-full focus:outline-none hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  </div>
</template>
```