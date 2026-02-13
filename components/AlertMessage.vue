<template>
  <div
    class="rounded-lg border p-4"
    :class="{
      'bg-red-50 border-red-200': type === 'error',
      'bg-yellow-50 border-yellow-200': type === 'warning',
      'bg-blue-50 border-blue-200': type === 'info',
      'bg-green-50 border-green-200': type === 'success',
    }"
  >
    <div class="flex items-start">
      <div class="flex-shrink-0">
        <Icon
          :name="iconName"
          class="h-5 w-5"
          :class="{
            'text-red-600': type === 'error',
            'text-yellow-600': type === 'warning',
            'text-blue-600': type === 'info',
            'text-green-600': type === 'success',
          }"
        />
      </div>
      <div class="ml-3 flex-1">
        <h3
          v-if="title"
          class="text-sm font-medium"
          :class="{
            'text-red-800': type === 'error',
            'text-yellow-800': type === 'warning',
            'text-blue-800': type === 'info',
            'text-green-800': type === 'success',
          }"
        >
          {{ title }}
        </h3>
        <div
          class="text-sm"
          :class="[
            title ? 'mt-2' : '',
            {
              'text-red-700': type === 'error',
              'text-yellow-700': type === 'warning',
              'text-blue-700': type === 'info',
              'text-green-700': type === 'success',
            }
          ]"
        >
          <slot>{{ message }}</slot>
        </div>
        <div v-if="$slots.actions || retryable" class="mt-3">
          <slot name="actions">
            <button
              v-if="retryable"
              @click="$emit('retry')"
              class="text-sm font-medium hover:underline"
              :class="{
                'text-red-600 hover:text-red-500': type === 'error',
                'text-yellow-600 hover:text-yellow-500': type === 'warning',
                'text-blue-600 hover:text-blue-500': type === 'info',
                'text-green-600 hover:text-green-500': type === 'success',
              }"
            >
              Coba Lagi
            </button>
          </slot>
        </div>
      </div>
      <button
        v-if="dismissible"
        @click="$emit('dismiss')"
        class="ml-3 flex-shrink-0"
        :class="{
          'text-red-400 hover:text-red-500': type === 'error',
          'text-yellow-400 hover:text-yellow-500': type === 'warning',
          'text-blue-400 hover:text-blue-500': type === 'info',
          'text-green-400 hover:text-green-500': type === 'success',
        }"
      >
        <Icon name="lucide:x" class="h-5 w-5" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  type?: 'error' | 'warning' | 'info' | 'success'
  title?: string
  message?: string
  dismissible?: boolean
  retryable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'error',
  title: '',
  message: '',
  dismissible: false,
  retryable: false,
})

defineEmits<{
  retry: []
  dismiss: []
}>()

const iconName = computed(() => {
  switch (props.type) {
    case 'error':
      return 'lucide:alert-circle'
    case 'warning':
      return 'lucide:alert-triangle'
    case 'info':
      return 'lucide:info'
    case 'success':
      return 'lucide:check-circle'
    default:
      return 'lucide:alert-circle'
  }
})
</script>
