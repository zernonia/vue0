<script setup lang="ts">
import { LogOut, Menu } from 'lucide-vue-next'

const openaiKey = useOpenAIKey()
const { loggedIn, user, clear } = useUserSession()
</script>

<template>
  <UiDropdownMenu>
    <UiDropdownMenuTrigger as-child>
      <UiButton class="flex-shrink-0 rounded-full overflow-hidden" size="icon" variant="secondary">
        <Menu v-if="!loggedIn" class="p-1" />
        <img v-else-if="user.avatar_url" :src="user.avatar_url" class="w-full h-full">
      </UiButton>
    </UiDropdownMenuTrigger>

    <UiDropdownMenuContent align="end" class="w-80">
      <UiDropdownMenuItem v-if="!loggedIn" as-child>
        <a href="/api/auth/github">
          Login with GitHub
        </a>
      </UiDropdownMenuItem>
      <template v-else>
        <UiDropdownMenuGroup>
          <UiDropdownMenuLabel class="text-xs">
            OpenAI Key
          </UiDropdownMenuLabel>
          <div class="px-1 pb-1">
            <UiInput v-model="openaiKey" />
          </div>
        </UiDropdownMenuGroup>
        <UiDropdownMenuSeparator />
        <UiDropdownMenuItem @click="clear">
          <LogOut class="mr-2 h-4 w-4" />
          <span>Log out</span>
        </UiDropdownMenuItem>
      </template>
    </UiDropdownMenuContent>
  </UiDropdownMenu>
</template>
