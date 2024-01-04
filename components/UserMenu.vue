<script setup lang="ts">
import { Bug, Github, LogOut, Menu, MessageCircleQuestion } from 'lucide-vue-next'

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

    <UiDropdownMenuContent align="end" class="w-64">
      <UiDropdownMenuItem v-if="!loggedIn" as-child>
        <a href="/api/auth/github">
          <Github class="mr-2 h-4 w-4" />
          <span>Login with GitHub</span>
        </a>
      </UiDropdownMenuItem>

      <UiDropdownMenuGroup v-if="loggedIn">
        <UiDropdownMenuLabel class="text-xs">
          OpenAI Key
        </UiDropdownMenuLabel>
        <div class="px-1 pb-1">
          <UiInput v-model="openaiKey" />
        </div>
      </UiDropdownMenuGroup>

      <UiDropdownMenuSeparator />
      <UiDropdownMenuItem as-child>
        <NuxtLink to="/faq">
          <MessageCircleQuestion class="mr-2 h-4 w-4" />
          <span>FAQs</span>
        </NuxtLink>
      </UiDropdownMenuItem>
      <UiDropdownMenuItem as-child>
        <NuxtLink to="https://github.com/zernonia/vue0/issues/new?labels=bug&title=New+bug+report" target="_blank">
          <Bug class="mr-2 h-4 w-4" />
          <span>Report an issue</span>
        </NuxtLink>
      </UiDropdownMenuItem>

      <template v-if="loggedIn">
        <UiDropdownMenuSeparator />
        <UiDropdownMenuItem @click="clear">
          <LogOut class="mr-2 h-4 w-4" />
          <span>Log out</span>
        </UiDropdownMenuItem>
      </template>
    </UiDropdownMenuContent>
  </UiDropdownMenu>
</template>
