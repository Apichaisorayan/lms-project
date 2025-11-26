import { ref } from 'vue'

const confirmInstance = ref(null)

export function useConfirm() {
  const setConfirmInstance = (instance) => {
    confirmInstance.value = instance
  }

  const confirm = async (options) => {
    if (confirmInstance.value) {
      return await confirmInstance.value.show(options)
    }
    return false
  }

  const show = async (message, title = 'ยืนยัน') => {
    return await confirm({
      type: 'warning',
      title,
      message,
      confirmText: 'ตกลง',
      cancelText: 'ยกเลิก'
    })
  }

  // Shorthand methods
  const warning = async (title, message) => {
    return await confirm({
      type: 'warning',
      title,
      message,
      confirmText: 'ตกลง',
      cancelText: 'ยกเลิก'
    })
  }

  const danger = async (title, message) => {
    return await confirm({
      type: 'danger',
      title,
      message,
      confirmText: 'ลบ',
      cancelText: 'ยกเลิก'
    })
  }

  const info = async (title, message) => {
    return await confirm({
      type: 'info',
      title,
      message,
      confirmText: 'ตกลง',
      cancelText: 'ยกเลิก'
    })
  }

  return {
    setConfirmInstance,
    confirm,
    show,
    warning,
    danger,
    info
  }
}
