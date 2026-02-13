<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="rounded-lg border shadow-lg p-4 bg-white"
          :class="{
            'border-green-200': toast.type === 'success',
            'border-red-200': toast.type === 'error',
            'border-yellow-200': toast.type === 'warning',
            'border-blue-200': toast.type === 'info',
          }"
        >
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <Icon
                :name="getIcon(toast.type)"
                class="h-5 w-5"
                :class="{
                  'text-green-600': toast.type === 'success',
                  'text-red-600': toast.type === 'error',
                  'text-yellow-600': toast.type === 'warning',
                  'text-blue-600': toast.type === 'info',
                }"
              />
            </div>
            <div class="ml-3 flex-1">
              <h3
                v-if="toast.title"
                class="text-sm font-medium"
                :class="{
                  'text-green-800': toast.type === 'success',
                  'text-red-800': toast.type === 'error',
                  'text-yellow-800': toast.type === 'warning',
                  'text-blue-800': toast.type === 'info',
                }"
              >
                {{ toast.title }}
              </h3>
              <p
                class="text-sm"
                :class="[
                  toast.title ? 'mt-1' : '',
                  {
                    'text-green-700': toast.type === 'success',
                    'text-red-700': toast.type === 'error',
                    'text-yellow-700': toast.type === 'warning',
                    'text-blue-700': toast.type === 'info',
                  }
                ]"
              >
                {{ toast.message }}
              </p>
            </div>
            <button
              @click="remove(toast.id)"
              class="ml-3 flex-shrink-0"
              :class="{
                'text-green-400 hover:text-green-500': toast.type === 'success',
                'text-red-400 hover:text-red-500': toast.type === 'error',
                'text-yellow-400 hover:text-yellow-500': toast.type === 'warning',
                'text-blue-400 hover:text-blue-500': toast.type === 'info',
              }"
            >
              <Icon name="lucide:x" class="h-5 w-5" />
            </button>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const { toasts, remove } = useToast()

const getIcon = (type: string) => {
  switch (type) {
    case 'success':
      return 'lucide:check-circle'
    case 'error':
      return 'lucide:alert-circle'
    case 'warning':
      return 'lucide:alert-triangle'
    case 'info':
      return 'lucide:info'
    default:
      return 'lucide:info'
  }
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
