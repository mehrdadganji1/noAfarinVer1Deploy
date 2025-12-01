// Simple toast notification utility
// Can be replaced with a library like sonner or react-hot-toast later

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastOptions {
  type: ToastType
  message: string
  duration?: number
}

const showToast = ({ type, message, duration: _duration = 3000 }: ToastOptions) => {
  // For now, use browser's alert/console
  // TODO: Implement proper toast UI component
  console.log(`[${type.toUpperCase()}]:`, message)
  
  // Simple browser notification
  if (type === 'error') {
    alert(`خطا: ${message}`)
  } else if (type === 'success') {
    // For success, just log to console for now
    console.log('✅', message)
  }
}

export const toast = {
  success: (message: string) => showToast({ type: 'success', message }),
  error: (message: string) => showToast({ type: 'error', message }),
  info: (message: string) => showToast({ type: 'info', message }),
  warning: (message: string) => showToast({ type: 'warning', message }),
}
