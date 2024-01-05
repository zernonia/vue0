<script setup lang="ts">
import { GithubLogoIcon } from '@radix-icons/vue'
</script>

<template>
  <div>
    <div class=" w-full h-full flex flex-col items-center justify-center ">
      <header class="sticky top-0 flex p-2 md:p-4 w-full z-10">
        <NuxtLink to="/" class="group h-10 flex items-center gap-1 text-xl md:text-3xl font-black">
          <Logo />
          <span>vue0</span>
        </NuxtLink>

        <div class="mx-auto" />

        <div class="flex items-center gap-2">
          <UiButton as-child class="flex-shrink-0 bg-white" variant="outline">
            <NuxtLink to="https://github.com/zernonia/vue0" target="_blank">
              <GithubLogoIcon class="mr-1" />
              <span>GitHub</span>
            </NuxtLink>
          </UiButton>
          <UserMenu />
        </div>
      </header>
      <div class="px-2 md:px-4 w-full">
        <slot />
      </div>
    </div>

    <UiToaster />
  </div>
</template>
