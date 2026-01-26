<script setup lang="ts">
import { Bug, GalleryThumbnails, Github, LogOut, Menu, MessageCircleQuestion } from 'lucide-vue-next'

const openaiKey = useOpenAIKey()
const { loggedIn, user, clear } = useUserSession()
</script>

<template>
  <UiDropdownMenu>
    <UiDropdownMenuTrigger as-child>
      <UiButton class="relative flex-shrink-0 rounded-full" size="icon" variant="secondary">
        <div class=" rounded-full overflow-hidden">
          <Menu v-if="!loggedIn" class="p-1" />
          <img v-else-if="user.avatar_url" :src="user.avatar_url" class="w-full h-full">
        </div>

        <div v-if="!openaiKey" class="absolute -bottom-0.5 -left-1">
          <div class="w-3 h-3 rounded-full  bg-green-500" />
          <div class="w-3 h-3 absolute top-0 rounded-full  bg-green-400 animate-ping" />
        </div>
      </UiButton>
    </UiDropdownMenuTrigger>

    <UiDropdownMenuContent align="end" class="w-64">
      <UiDropdownMenuItem v-if="!loggedIn" as-child>
        <a href="/api/auth/github" @click="umTrackEvent('login')">
          <Github class="mr-2 h-4 w-4" />
          <span>Login with GitHub</span>
        </a>
      </UiDropdownMenuItem>

      <UiDropdownMenuGroup v-if="loggedIn">
        <UiDropdownMenuLabel class="text-xs">
          OpenAI Key *
        </UiDropdownMenuLabel>
        <div class="px-1 pb-1">
          <UiInput v-model="openaiKey" placeholder="sk-************ (Required)" />
        </div>
      </UiDropdownMenuGroup>

      <UiDropdownMenuSeparator />
      <UiDropdownMenuItem v-if="user" as-child>
        <NuxtLink :to="`/${user.login}`">
          <GalleryThumbnails class="mr-2 h-4 w-4" />
          <span>Gallery</span>
        </NuxtLink>
      </UiDropdownMenuItem>
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
