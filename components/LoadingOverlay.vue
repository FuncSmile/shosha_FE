<template>
  <div v-if="visible" class="relative">
    <div
      v-if="state.loading"
      class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg"
    >
      <LoadingSpinner size="sm" />
    </div>
    <div :class="{ 'opacity-50 pointer-events-none': state.loading }">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  visible?: boolean
  state: {
    loading?: boolean
  }
}

withDefaults(defineProps<Props>(), {
  visible: true,
})
</script>
