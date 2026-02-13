import { ref } from 'vue'

export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  duration?: number
}

const toasts = ref<Toast[]>([])
let toastId = 0

export const useToast = () => {
  const show = (
    message: string,
    options: {
      type?: Toast['type']
      title?: string
      duration?: number
    } = {}
  ) => {
    const id = `toast-${++toastId}`
    const toast: Toast = {
      id,
      type: options.type || 'info',
      title: options.title,
      message,
      duration: options.duration || 5000,
    }

    toasts.value.push(toast)

    if (toast.duration && toast.duration > 0) {
      setTimeout(() => {
        remove(id)
      }, toast.duration)
    }

    return id
  }

  const success = (message: string, title?: string) => {
    return show(message, { type: 'success', title })
  }

  const error = (message: string, title?: string) => {
    return show(message, { type: 'error', title, duration: 7000 })
  }

  const warning = (message: string, title?: string) => {
    return show(message, { type: 'warning', title })
  }

  const info = (message: string, title?: string) => {
    return show(message, { type: 'info', title })
  }

  const remove = (id: string) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }

  return {
    toasts: readonly(toasts),
    show,
    success,
    error,
    warning,
    info,
    remove,
  }
}
