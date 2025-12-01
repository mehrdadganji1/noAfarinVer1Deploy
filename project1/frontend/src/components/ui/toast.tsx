import * as React from "react"
import { createRoot } from "react-dom/client"
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react"

export interface ToastProps {
  title?: string
  description?: string
  variant?: "default" | "destructive" | "success"
}

interface ToastItem {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
}

let toastContainer: HTMLDivElement | null = null
let toastRoot: any = null
const toasts: ToastItem[] = []
let updateToasts: (() => void) | null = null

const getIcon = (type: ToastItem['type']) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="h-5 w-5" />
    case 'error':
      return <XCircle className="h-5 w-5" />
    case 'warning':
      return <AlertTriangle className="h-5 w-5" />
    default:
      return <Info className="h-5 w-5" />
  }
}

const getStyles = (type: ToastItem['type']) => {
  switch (type) {
    case 'success':
      return 'bg-green-50 text-green-800 border-green-200'
    case 'error':
      return 'bg-red-50 text-red-800 border-red-200'
    case 'warning':
      return 'bg-yellow-50 text-yellow-800 border-yellow-200'
    default:
      return 'bg-blue-50 text-blue-800 border-blue-200'
  }
}

const ToastContainer: React.FC = () => {
  const [items, setItems] = React.useState<ToastItem[]>([])

  React.useEffect(() => {
    updateToasts = () => setItems([...toasts])
    return () => {
      updateToasts = null
    }
  }, [])

  const removeToast = (id: string) => {
    const index = toasts.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.splice(index, 1)
      updateToasts?.()
    }
  }

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-md">
      {items.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg animate-in slide-in-from-right duration-300 ${getStyles(toast.type)}`}
        >
          <div className="flex-shrink-0 mt-0.5">
            {getIcon(toast.type)}
          </div>
          <div className="flex-1 text-sm font-medium leading-relaxed">
            {toast.message}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}

const initToastContainer = () => {
  if (!toastContainer) {
    toastContainer = document.createElement('div')
    document.body.appendChild(toastContainer)
    toastRoot = createRoot(toastContainer)
    toastRoot.render(<ToastContainer />)
  }
}

const showToast = (message: string, type: ToastItem['type']) => {
  initToastContainer()
  
  const id = `toast-${Date.now()}-${Math.random()}`
  toasts.push({ id, message, type })
  updateToasts?.()

  // Auto remove after 5 seconds
  setTimeout(() => {
    const index = toasts.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.splice(index, 1)
      updateToasts?.()
    }
  }, 5000)
}

export const Toaster: React.FC = () => {
  return null
}

// Helper function for showing toasts
export const toast = (options: ToastProps | string) => {
  if (typeof options === 'string') {
    showToast(options, 'info')
    return
  }
  
  const message = options.title ? `${options.title}${options.description ? ': ' + options.description : ''}` : options.description || ''
  const type = options.variant === 'destructive' ? 'error' : options.variant === 'success' ? 'success' : 'info'
  showToast(message, type)
}

toast.success = (message: string) => {
  console.log('✅ Success:', message)
  showToast(message, 'success')
}

toast.error = (message: string) => {
  console.error('❌ Error:', message)
  showToast(message, 'error')
}

toast.info = (message: string) => {
  console.log('ℹ️ Info:', message)
  showToast(message, 'info')
}

toast.warning = (message: string) => {
  console.warn('⚠️ Warning:', message)
  showToast(message, 'warning')
}
