<template>
  <div class="space-y-3 animate-pulse">
    <div v-for="i in count" :key="i" class="flex items-center space-x-4">
      <div v-if="avatar" class="h-12 w-12 bg-gray-200 rounded-full"></div>
      <div class="flex-1 space-y-2">
        <div class="h-4 bg-gray-200 rounded" :style="{ width: `${Math.random() * 30 + 70}%` }"></div>
        <div v-if="lines > 1" class="h-3 bg-gray-200 rounded" :style="{ width: `${Math.random() * 40 + 50}%` }"></div>
        <div v-if="lines > 2" class="h-3 bg-gray-200 rounded" :style="{ width: `${Math.random() * 30 + 40}%` }"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  count?: number
  lines?: number
  avatar?: boolean
}

withDefaults(defineProps<Props>(), {
  count: 3,
  lines: 2,
  avatar: false,
})
</script>
