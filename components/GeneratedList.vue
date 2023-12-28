<script setup lang="ts">
import type { Component } from 'vue'

const { data } = await useFetch('/api/component/all')
</script>

<template>
  <div class="w-full px-4 flex flex-col gap-8">
    <NuxtLink
      v-for="item in data"
      :key="item.id"
      :to="`/t/${item.slug}`"
    >
      <UiCard class="py-12  hover:shadow-lg transition">
        <UiCardContent>
          <Output v-if="item.code" :sfc-string="item.code" />
          <div v-else>
            Empty
          </div>
        </UiCardContent>
      </UiCard>
    </NuxtLink>
  </div>
</template>
