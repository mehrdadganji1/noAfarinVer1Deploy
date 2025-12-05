import axios, { AxiosError } from 'axios'
import { toast } from '@/components/ui/toast'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Log API URL on startup
console.log('🔧 API Configuration:', {
  API_URL,
  BASE_URL: `${API_URL}/api`,
  NODE_ENV: import.meta.env.MODE,
})
const FILE_SERVICE_URL = import.meta.env.VITE_FILE_SERVICE_URL || 'http://localhost:3007'

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
})

// Separate axios instance for File Service
export const fileApi = axios.create({
  baseURL: `${FILE_SERVICE_URL}/api`,
  timeout: 60000, // 60 seconds for file uploads
})

// Request interceptor for main API
api.interceptors.request.use(
  (config) => {
    const url = config.url || ''
    
    // Don't send token for auth endpoints (login, register, etc.)
    const isAuthEndpoint = url.includes('/auth/login') || 
                          url.includes('/auth/register') ||
                          url.includes('/auth/forgot-password') ||
                          url.includes('/auth/reset-password') ||
                          url.includes('/auth/verify-email')
    
    if (import.meta.env.DEV && isAuthEndpoint) {
      console.log('🔓 Auth endpoint detected, skipping token:', url)
    }
    
    if (!isAuthEndpoint) {
      // Try to get token from localStorage first (direct storage)
      let token = localStorage.getItem('token')
      
      // If not found, try to get from zustand persist storage
      if (!token) {
        try {
          const authStorage = localStorage.getItem('auth-storage')
          if (authStorage) {
            const parsed = JSON.parse(authStorage)
            token = parsed.state?.token
          }
        } catch (e) {
          console.warn('Failed to parse auth-storage:', e)
        }
      }
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    
    // Log request in development (skip profile endpoints to reduce noise)
    if (import.meta.env.DEV) {
      const shouldLog = !url.includes('/profile/') && !url.includes('/completion')
      if (shouldLog) {
        console.log(`🔵 ${config.method?.toUpperCase()} ${config.url}`, config.data)
      }
    }
    
    return config
  },
  (error) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

// Request interceptor for File API
fileApi.interceptors.request.use(
  (config) => {
    // Try to get token from localStorage first (direct storage)
    let token = localStorage.getItem('token')
    
    // If not found, try to get from zustand persist storage
    if (!token) {
      try {
        const authStorage = localStorage.getItem('auth-storage')
        if (authStorage) {
          const parsed = JSON.parse(authStorage)
          token = parsed.state?.token
        }
      } catch (e) {
        console.warn('Failed to parse auth-storage:', e)
      }
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`📁 ${config.method?.toUpperCase()} ${config.url}`, config.data)
    }
    
    return config
  },
  (error) => {
    console.error('❌ File Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Log response in development (skip profile endpoints to reduce noise)
    if (import.meta.env.DEV) {
      const url = response.config.url || ''
      const shouldLog = !url.includes('/profile/') && !url.includes('/completion')
      if (shouldLog) {
        console.log(`🟢 ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data)
      }
    }
    return response
  },
  (error: AxiosError<any>) => {
    const message = error.response?.data?.error || error.message || 'خطای غیرمنتظره'
    const url = error.config?.url || ''
    
    // Don't log 404 errors for endpoints where it's expected (normal case)
    const is404Expected = error.response?.status === 404 && 
      (url.includes('/applications/user/') || 
       url.includes('/applications/my-application') ||
       url.includes('/aaco-applications/my-application') ||
       url.includes('/aaco-applications/check-status') ||
       url.includes('/documents') ||
       url.includes('/interviews') ||
       url.includes('/messages') ||
       url.includes('/teams') ||
       url.includes('/trainings') ||
       url.includes('/evaluations') ||
       url.includes('/community/') ||
       url.includes('/courses') ||
       url.includes('/xp/') ||
       url.includes('/profile/') ||
       url.includes('/completion'))
    
    if (!is404Expected) {
      // Log error
      console.error('❌ API Error:', {
        url,
        status: error.response?.status,
        message,
        data: error.response?.data,
      })
    }
    
    // Handle different error statuses
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      console.error('🚨 401 Unauthorized Error:', {
        url: error.config?.url,
        method: error.config?.method,
        currentPath: window.location.pathname,
        hasToken: !!localStorage.getItem('token')
      })
      
      // Don't logout if we're already on login page or during login request
      const isLoginRequest = error.config?.url?.includes('/auth/login')
      const isOnLoginPage = window.location.pathname.includes('/login')
      
      // Don't logout for optional endpoints (membership, stats, etc.)
      const isOptionalEndpoint = error.config?.url?.includes('/membership/') ||
                                 error.config?.url?.includes('/stats/') ||
                                 error.config?.url?.includes('/xp/') ||
                                 error.config?.url?.includes('/achievements/') ||
                                 error.config?.url?.includes('/streaks/') ||
                                 error.config?.url?.includes('/challenges')
      
      // Don't redirect if we're on a public page (landing, home, etc.)
      const isOnPublicPage = window.location.pathname === '/' ||
                             window.location.pathname === '/home' ||
                             window.location.pathname === '/landing' ||
                             window.location.pathname.startsWith('/register') ||
                             window.location.pathname.startsWith('/forgot-password') ||
                             window.location.pathname.startsWith('/verify-email') ||
                             window.location.pathname.startsWith('/reset-password')
      
      if (!isLoginRequest && !isOnLoginPage && !isOptionalEndpoint && !isOnPublicPage) {
        console.error('🚪 Logging out due to 401 error')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('auth-storage')
        toast.error('نشست شما منقضی شده است. لطفاً دوباره وارد شوید.')
        window.location.href = '/login'
      } else if (isOptionalEndpoint) {
        console.log('⚠️ Optional endpoint failed with 401, not logging out')
      }
    } else if (error.response?.status === 403) {
      // Forbidden
      toast.error('شما دسترسی لازم برای این عملیات را ندارید.')
    } else if (error.response?.status === 404) {
      // Not Found - but don't show toast for certain endpoints where 404 is expected
      const url = error.config?.url || ''
      const is404Expected = url.includes('/applications/user/') ||
                            url.includes('/community/') ||
                            url.includes('/courses') || 
                            url.includes('/applications/my-application') ||
                            url.includes('/aaco-applications/my-application') ||
                            url.includes('/aaco-applications/check-status') ||
                            url.includes('/documents') ||
                            url.includes('/interviews') ||
                            url.includes('/messages') ||
                            url.includes('/teams') ||
                            url.includes('/trainings') ||
                            url.includes('/evaluations') ||
                            url.includes('/xp/') ||
                            url.includes('/profile/') ||
                            url.includes('/completion')
      
      if (!is404Expected) {
        toast.error('منبع مورد نظر یافت نشد.')
      }
    } else if (error.response?.status === 422) {
      // Validation Error
      toast.error(message)
    } else if (error.response?.status === 500) {
      // Server Error - Don't show toast for missing services
      const url = error.config?.url || ''
      if (!url.includes('/teams') && !url.includes('/events') && !url.includes('/trainings')) {
        toast.error('خطای سرور. لطفاً بعداً تلاش کنید.')
      }
    } else if (error.response?.status === 503) {
      // Service Unavailable - Don't show toast for optional services
      const url = error.config?.url || ''
      const is503Expected = url.includes('/projects') ||
                            url.includes('/teams') ||
                            url.includes('/events') ||
                            url.includes('/trainings') ||
                            url.includes('/fundings') ||
                            url.includes('/achievements') ||
                            url.includes('/xp/')
      
      if (!is503Expected) {
        toast.error('سرویس موقتاً در دسترس نیست.')
      }
    } else if (error.code === 'ECONNABORTED') {
      // Timeout
      toast.error('زمان درخواست تمام شد. لطفاً دوباره تلاش کنید.')
    } else if (!error.response) {
      // Network Error
      toast.error('خطای شبکه. لطفاً اتصال اینترنت خود را بررسی کنید.')
    } else {
      // Other errors
      toast.error(message)
    }
    
    return Promise.reject(error)
  }
)

// Add same response interceptor for fileApi
fileApi.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`📂 ${response.config.method?.toUpperCase()} ${response.config.url}`)
    }
    return response
  },
  (error: AxiosError<any>) => {
    console.error('❌ File API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.error || error.message,
    })
    return Promise.reject(error)
  }
)

export default api
