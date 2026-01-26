<script setup lang="ts">
const route = useRoute()
const name = computed(() => route.params.name)

const { data } = await useFetch<DBComponent[]>(`/api/component/user/${name.value}`)
const dataUser = computed(() => data.value?.at(-1)?.user)

if (!data.value?.length) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page Not Found',
  })
}
</script>

<template>
  <div>
    <div v-if="dataUser" class="w-full flex flex-col justify-center items-center py-8">
      <UiAvatar size="lg">
        <UiAvatarImage :src="dataUser?.avatarUrl ?? ''" />
        <UiAvatarFallback>{{ dataUser?.name?.slice(0, 1) }}</UiAvatarFallback>
      </UiAvatar>

      <h2 class="text-2xl font-bold my-4">
        {{ dataUser.name }}
      </h2>
    </div>
    <GeneratedList :data="data" />
  </div>
</template>
