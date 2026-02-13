<template>
  <NuxtLayout>
    <NuxtPage />
    <ToastContainer />
  </NuxtLayout>
</template>

<script setup lang="ts">
useHead({
  titleTemplate: (title) => title ? `${title} - ShoshaMart` : 'ShoshaMart',
})
</script>
