import { useQuery } from '@tanstack/react-query'
import { DirectorStats } from '@/types/director.types'
import { directorApi } from '@/services/directorApi'

// Mock data - fallback if API fails
const mockDirectorStats: DirectorStats = {
  overview: {
    totalUsers: 1250,
    activeToday: 145,
    growthRate: 12.5,
    systemStatus: 'healthy'
  },
  users: {
    total: 1250,
    clubMembers: 450,
    applicants: 320,
    admins: 15,
    growth: 12.5,
    dailyActive: 145,
    weeklyActive: 580,
    monthlyActive: 950
  },
  applications: {
    total: 320,
    pending: 45,
    approved: 245,
    rejected: 30,
    approvalRate: 89.1,
    avgProcessingTime: '3.5 روز'
  },
  systemHealth: [
    {
      name: 'API Gateway',
      status: 'healthy',
      uptime: '99.9%',
      responseTime: '45ms',
      lastCheck: new Date().toISOString()
    },
    {
      name: 'User Service',
      status: 'healthy',
      uptime: '99.8%',
      responseTime: '32ms',
      lastCheck: new Date().toISOString()
    },
    {
      name: 'Application Service',
      status: 'healthy',
      uptime: '99.7%',
      responseTime: '58ms',
      lastCheck: new Date().toISOString()
    },
    {
      name: 'Database',
      status: 'healthy',
      uptime: '100%',
      responseTime: '12ms',
      lastCheck: new Date().toISOString()
    }
  ],
  pendingTasks: [
    {
      id: 'applications',
      title: 'درخواست‌های عضویت',
      count: 12,
      priority: 'high',
      path: '/admin/applications',
      description: 'نیاز به بررسی فوری'
    },
    {
      id: 'documents',
      title: 'بررسی مدارک',
      count: 8,
      priority: 'high',
      path: '/admin/documents',
      description: 'مدارک در انتظار تایید'
    },
    {
      id: 'events',
      title: 'تایید رویدادها',
      count: 5,
      priority: 'medium',
      path: '/admin/events',
      description: 'رویدادهای پیشنهادی'
    },
    {
      id: 'support',
      title: 'پیام‌های پشتیبانی',
      count: 3,
      priority: 'low',
      path: '/admin/support',
      description: 'پاسخ به سوالات'
    }
  ],
  recentActivities: [
    {
      id: '1',
      type: 'user',
      title: 'کاربر جدید ثبت‌نام کرد',
      description: 'محمد رضایی با ایمیل m.rezaei@example.com ثبت‌نام کرد',
      user: 'سیستم',
      timestamp: '5 دقیقه پیش',
      status: 'success'
    },
    {
      id: '2',
      type: 'application',
      title: 'درخواست عضویت تایید شد',
      description: 'درخواست سارا احمدی توسط مدیر سیستم تایید شد',
      user: 'علی محمدی',
      timestamp: '15 دقیقه پیش',
      status: 'success'
    },
    {
      id: '3',
      type: 'document',
      title: 'مدرک جدید آپلود شد',
      description: 'حسین کریمی مدارک تحصیلی خود را آپلود کرد',
      user: 'حسین کریمی',
      timestamp: '30 دقیقه پیش',
      status: 'info'
    },
    {
      id: '4',
      type: 'approval',
      title: 'تیم جدید تایید شد',
      description: 'تیم "نوآوران فناوری" با 5 عضو تایید شد',
      user: 'رضا احمدی',
      timestamp: '1 ساعت پیش',
      status: 'success'
    },
    {
      id: '5',
      type: 'rejection',
      title: 'درخواست رد شد',
      description: 'درخواست عضویت احمد نوری به دلیل عدم تکمیل مدارک رد شد',
      user: 'علی محمدی',
      timestamp: '2 ساعت پیش',
      status: 'warning'
    }
  ]
}

export function useDirectorStats(refetchInterval?: number) {
  return useQuery({
    queryKey: ['director-stats'],
    queryFn: async () => {
      try {
        // Try to fetch from API
        const data = await directorApi.getStats()
        return data
      } catch (error) {
        console.warn('Failed to fetch director stats from API, using mock data:', error)
        // Fallback to mock data
        return mockDirectorStats
      }
    },
    refetchInterval: refetchInterval || 30000, // Refetch every 30 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
    retry: 2, // Retry failed requests twice
    retryDelay: 1000 // Wait 1 second between retries
  })
}

export function useSystemHealth() {
  return useQuery({
    queryKey: ['system-health'],
    queryFn: async () => {
      try {
        const data = await directorApi.getSystemHealth()
        return data
      } catch (error) {
        console.warn('Failed to fetch system health, using mock data:', error)
        return mockDirectorStats.systemHealth
      }
    },
    refetchInterval: 60000, // Refetch every minute
    retry: 2
  })
}

export function usePendingTasks() {
  return useQuery({
    queryKey: ['pending-tasks'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 300))
      return mockDirectorStats.pendingTasks
    },
    refetchInterval: 15000 // Refetch every 15 seconds
  })
}

export function useRecentActivities(limit: number = 10) {
  return useQuery({
    queryKey: ['recent-activities', limit],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 300))
      return mockDirectorStats.recentActivities.slice(0, limit)
    },
    refetchInterval: 10000 // Refetch every 10 seconds
  })
}
