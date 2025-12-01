import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  _id: string
  email: string
  firstName: string
  lastName: string
  role: string[]
  phoneNumber?: string
  university?: string
  major?: string
  studentId?: string
  bio?: string
  avatar?: string
  expertise?: string[]
  isActive?: boolean
  isVerified?: boolean
  emailVerified?: boolean
  phoneVerified?: boolean
  hasPassword?: boolean
  createdAt?: string
  updatedAt?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  setAuth: (user: User, token: string) => void
  setUser: (user: User) => void
  refreshUser: () => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        console.log('🔐 authStore.setAuth called:', {
          userId: user._id,
          email: user.email,
          roles: user.role,
          tokenLength: token.length
        })
        
        // Store in zustand state (will be persisted by middleware)
        set({ user, token, isAuthenticated: true })
        
        // Also store token directly in localStorage for immediate access
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        
        console.log('✅ authStore.setAuth completed')
        console.log('   Token stored in localStorage:', !!localStorage.getItem('token'))
        console.log('   User stored in localStorage:', !!localStorage.getItem('user'))
      },
      setUser: (user) => {
        console.log('👤 authStore.setUser called:', user._id)
        set({ user })
        localStorage.setItem('user', JSON.stringify(user))
      },
      refreshUser: async () => {
        try {
          const token = localStorage.getItem('token')
          if (!token) return
          
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
          
          if (response.ok) {
            const data = await response.json()
            if (data.success && data.data) {
              set({ user: data.data })
              localStorage.setItem('user', JSON.stringify(data.data))
              console.log('🔄 User refreshed successfully')
            }
          }
        } catch (error) {
          console.error('❌ Failed to refresh user:', error)
        }
      },
      logout: () => {
        console.log('🚪 authStore.logout called')
        set({ user: null, token: null, isAuthenticated: false })
        
        // Also clear from localStorage
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('auth-storage')
        
        console.log('✅ Logout completed, all storage cleared')
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)
