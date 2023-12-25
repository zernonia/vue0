<script setup lang="ts">
// Vue component setup code here
</script>

<template>
  <div class="bg-gray-100 dark:bg-black p-4 rounded-lg max-w-md mx-auto mt-10">
    <form class="flex flex-col space-y-4">
      <div>
        <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Your name</label>
        <input id="name" type="text" placeholder="John Doe" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">
      </div>
      <div>
        <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Email address</label>
        <input id="email" type="email" placeholder="john@example.com" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">
      </div>
      <div>
        <label for="message" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Your message</label>
        <textarea id="message" rows="4" placeholder="Your message..." class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" />
      </div>
      <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        Submit
      </button>
    </form>
  </div>
</template>
