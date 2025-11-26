import { ref } from 'vue'

const toastInstance = ref(null)

export function useToast() {
  const setToastInstance = (instance) => {
    toastInstance.value = instance
  }

  const showToast = (options) => {
    if (toastInstance.value) {
      return toastInstance.value.addToast(options)
    }
  }

  const success = (title, message = '', duration = 3000) => {
    return showToast({ type: 'success', title, message, duration })
  }

  const error = (title, message = '', duration = 4000) => {
    return showToast({ type: 'error', title, message, duration })
  }

  const info = (title, message = '', duration = 3000) => {
    return showToast({ type: 'info', title, message, duration })
  }

  const warning = (title, message = '', duration = 3000) => {
    return showToast({ type: 'warning', title, message, duration })
  }

  const loading = (title, message = '') => {
    return showToast({ type: 'loading', title, message })
  }

  const updateToast = (id, updates) => {
    if (toastInstance.value) {
      toastInstance.value.updateToast(id, updates)
    }
  }

  const removeToast = (id) => {
    if (toastInstance.value) {
      toastInstance.value.removeToast(id)
    }
  }

  return {
    setToastInstance,
    showToast,
    success,
    error,
    info,
    warning,
    loading,
    updateToast,
    removeToast
  }
}
