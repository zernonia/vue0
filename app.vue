<script setup lang="ts">
import { GithubLogoIcon } from '@radix-icons/vue'
</script>

<template>
  <div class="h-screen w-screen flex items-center justify-center">
    <UiCard class="w-64">
      <UiCardHeader>
        <UiCardTitle>vue0</UiCardTitle>
      </UiCardHeader>

      <UiCardContent>
        <p class="text-muted-foreground">
          Work in progress
        </p>
      </UiCardContent>

      <UiCardFooter class="justify-end">
        <UiButton as-child>
          <NuxtLink to="https://github.com/zernonia/vue0">
            <GithubLogoIcon class="mr-2" /> GitHub
          </NuxtLink>
        </UiButton>
      </UiCardFooter>
    </UiCard>
  </div>
</template>
