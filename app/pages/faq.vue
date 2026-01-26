<script setup lang="ts">
useSeoMeta({
  title: 'FAQs',
  description: 'Get answers to common questions about vue0, the generative UI tool.',
})
</script>

<template>
  <div class="prose mx-auto py-6">
    <h1 class="font-bold text-4xl px-6 ">
      FAQs
    </h1>

    <article class="mt-8 bg-muted rounded-xl px-6 py-4 prose transition-all prose-slate prose-headings:relative prose-headings:scroll-mt-20 [&_a]:prose-h2:font-semibold [&_a]:prose-h2:no-underline prose-li:my-0">
      <ContentDoc />
    </article>
  </div>
</template>
