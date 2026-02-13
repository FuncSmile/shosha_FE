<template>
  <div class="flex items-center justify-center" :class="fullPage ? 'min-h-screen' : 'py-12'">
    <div class="text-center">
      <div class="inline-flex items-center justify-center">
        <div
          class="animate-spin rounded-full border-b-2"
          :class="[
            size === 'sm' ? 'h-8 w-8' : size === 'lg' ? 'h-16 w-16' : 'h-12 w-12',
            'border-primary-600'
          ]"
        ></div>
      </div>
      <p v-if="message" class="mt-4 text-sm text-gray-600">{{ message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg'
  message?: string
  fullPage?: boolean
}

withDefaults(defineProps<Props>(), {
  size: 'md',
  message: '',
  fullPage: false,
})
</script>
