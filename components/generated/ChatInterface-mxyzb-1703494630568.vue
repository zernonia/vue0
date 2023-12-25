<script setup lang="ts">
import { ChatBubbleIcon, PersonIcon } from '@radix-icons/vue'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
</script>

<template>
  <div class="flex h-screen bg-white dark:bg-black">
    <!-- Sidebar -->
    <div class="flex flex-col w-1/4 border-r dark:border-gray-800">
      <div class="flex items-center justify-between p-4 border-b dark:border-gray-800">
        <h2 class="text-lg font-semibold">
          Chats
        </h2>
        <Button>
          <PersonIcon class="w-5 h-5" />
        </Button>
      </div>
      <div class="overflow-y-auto">
        <div v-for="i in 10" :key="i" class="p-4">
          <div class="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src="https://via.placeholder.com/40" alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div>
              <h3 class="text-sm font-medium">
                User Name
              </h3>
              <p class="text-xs text-gray-600 dark:text-gray-400">
                Last Message
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Chat Area -->
    <div class="flex flex-col flex-1">
      <div class="flex items-center justify-between p-4 border-b dark:border-gray-800">
        <div class="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src="https://via.placeholder.com/40" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div>
            <h3 class="text-lg font-semibold">
              User Name
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Online
            </p>
          </div>
        </div>
        <Button>
          <ChatBubbleIcon class="w-5 h-5" />
        </Button>
      </div>
      <div class="flex-1 p-4 overflow-y-auto space-y-4">
        <div class="flex justify-start">
          <div class="max-w-xs p-2 bg-gray-200 rounded-md dark:bg-gray-700">
            <p class="text-sm">
              Received message
            </p>
          </div>
        </div>
        <div class="flex justify-end">
          <div class="max-w-xs p-2 bg-blue-500 rounded-md text-white">
            <p class="text-sm">
              Sent message
            </p>
          </div>
        </div>
      </div>
      <div class="p-4">
        <div class="flex items-center space-x-2">
          <Input class="flex-1" placeholder="Type a message..." />
          <Button variant="outline">
            Send
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
