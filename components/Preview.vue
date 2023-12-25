<script setup>
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
</script>

<template>
  <div class="flex h-full flex-col bg-white dark:bg-black">
    <div class="flex-1 overflow-hidden">
      <ScrollArea class="h-full w-full">
        <div class="space-y-4 p-4">
          <!-- Chat message - sample -->
          <div class="flex items-end space-x-3">
            <Avatar>
              <AvatarImage src="https://github.com/radix-vue.png" alt="@radix-vue" />
              <AvatarFallback>R</AvatarFallback>
            </Avatar>
            <div class="max-w-xs rounded-lg bg-gray-100 p-3 text-sm text-gray-800 dark:bg-gray-700 dark:text-white">
              Hi there, this is a sample message for the chat app. - <span class="text-gray-400">8:40 AM</span>
            </div>
          </div>
          <!-- Another chat message - sample -->
          <div class="flex items-end justify-end space-x-3">
            <div class="max-w-xs rounded-lg bg-blue-500 p-3 text-sm text-white">
              Hey! This is another sample response message. - <span class="text-blue-200">8:45 AM</span>
            </div>
            <Avatar>
              <AvatarImage src="https://github.com/radix-vue.png" alt="@radix-vue" />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
          </div>
          <!-- Add more messages -->
        </div>
      </ScrollArea>
    </div>
    <div class="border-t p-3">
      <div class="rounded-md bg-gray-100 p-2 dark:bg-gray-800">
        <Input type="text" class="w-full border-none bg-transparent px-3 focus:ring-0" placeholder="Type a message..." />
        <Button variant="link" class="  right-4 top-5 text-blue-500">
          Send
        </Button>
      </div>
    </div>
  </div>
</template>
