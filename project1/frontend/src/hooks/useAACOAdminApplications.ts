import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api'
import { toast } from '@/components/ui/toast'

// Types
export enum AACOApplicationStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under-review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export interface AACOApplication {
  _id: string
  userId: {
    _id: string
    firstName: string
    lastName: string
    email: string
  } | string
  firstName: string
  lastName: string
  email: string
  phone: string
  city: string
  university: string
  major: string
  degree: string
  graduationYear?: string
  startupIdea: string
  businessModel: string
  targetMarket: string
  teamSize?: string
  teamMembers?: string
  skills: string[]
  motivation: string
  goals: string
  experience?: string
  expectations?: string
  status: AACOApplicationStatus
  reviewedBy?: string
  reviewedAt?: string
  reviewNotes?: string
  submittedAt?: string
  createdAt: string
  updatedAt: string
}

export interface AACOApplicationsResponse {
  applications: AACOApplication[]
  pagination: {
    total: number
    page: number
    limit: number
    pages: number
  }
}

export interface AACOApplicationFilters {
  status?: AACOApplicationStatus | ''
  search?: string
  page?: number
  limit?: number
}

export interface AACOStats {
  total: number
  submitted: number
  underReview: number
  approved: number
  rejected: number
  draft: number
}

export function useAACOAdminApplications(initialFilters?: AACOApplicationFilters) {
  const [applications, setApplications] = useState<AACOApplication[]>([])
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    pages: 0,
  })
  const [stats, setStats] = useState<AACOStats>({
    total: 0,
    submitted: 0,
    underReview: 0,
    approved: 0,
    rejected: 0,
    draft: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<AACOApplicationFilters>(initialFilters || {})

  // Fetch applications
  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (filters.status) params.append('status', filters.status)
      if (filters.search) params.append('search', filters.search)
      if (filters.page) params.append('page', String(filters.page))
      if (filters.limit) params.append('limit', String(filters.limit))

      const response = await api.get<AACOApplicationsResponse>(
        `/aaco-applications?${params.toString()}`
      )

      setApplications(response.data.applications)
      setPagination(response.data.pagination)

      // Calculate stats from all applications (need separate call for accurate stats)
      calculateStats(response.data.applications)
    } catch (err: any) {
      console.error('Error fetching AACO applications:', err)
      setError(err.response?.data?.message || 'خطا در دریافت درخواست‌ها')
    } finally {
      setLoading(false)
    }
  }, [filters])

  // Calculate stats
  const calculateStats = (apps: AACOApplication[]) => {
    const newStats: AACOStats = {
      total: apps.length,
      submitted: 0,
      underReview: 0,
      approved: 0,
      rejected: 0,
      draft: 0,
    }

    apps.forEach((app) => {
      switch (app.status) {
        case AACOApplicationStatus.SUBMITTED:
          newStats.submitted++
          break
        case AACOApplicationStatus.UNDER_REVIEW:
          newStats.underReview++
          break
        case AACOApplicationStatus.APPROVED:
          newStats.approved++
          break
        case AACOApplicationStatus.REJECTED:
          newStats.rejected++
          break
        case AACOApplicationStatus.DRAFT:
          newStats.draft++
          break
      }
    })

    setStats(newStats)
  }

  // Fetch all stats (without filters)
  const fetchStats = useCallback(async () => {
    try {
      const response = await api.get<AACOApplicationsResponse>(
        '/aaco-applications?limit=1000'
      )
      calculateStats(response.data.applications)
    } catch (err) {
      console.error('Error fetching stats:', err)
    }
  }, [])

  // Update application status
  const updateStatus = useCallback(
    async (
      applicationId: string,
      status: AACOApplicationStatus,
      reviewNotes?: string
    ) => {
      try {
        await api.patch(`/aaco-applications/${applicationId}/status`, {
          status,
          reviewNotes,
        })

        toast.success('وضعیت درخواست با موفقیت به‌روزرسانی شد')
        
        // Refresh applications
        await fetchApplications()
        await fetchStats()

        return true
      } catch (err: any) {
        console.error('Error updating application status:', err)
        toast.error(err.response?.data?.message || 'خطا در به‌روزرسانی وضعیت')
        return false
      }
    },
    [fetchApplications, fetchStats]
  )

  // Delete application
  const deleteApplication = useCallback(
    async (applicationId: string) => {
      try {
        await api.delete(`/aaco-applications/${applicationId}`)
        toast.success('درخواست با موفقیت حذف شد')
        await fetchApplications()
        await fetchStats()
        return true
      } catch (err: any) {
        console.error('Error deleting application:', err)
        toast.error(err.response?.data?.message || 'خطا در حذف درخواست')
        return false
      }
    },
    [fetchApplications, fetchStats]
  )

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<AACOApplicationFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }))
  }, [])

  // Change page
  const changePage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchApplications()
  }, [fetchApplications])

  // Fetch stats on mount
  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return {
    applications,
    pagination,
    stats,
    loading,
    error,
    filters,
    updateFilters,
    changePage,
    updateStatus,
    deleteApplication,
    refetch: fetchApplications,
  }
}

// Helper function to get status label in Persian
export function getStatusLabel(status: AACOApplicationStatus): string {
  const labels: Record<AACOApplicationStatus, string> = {
    [AACOApplicationStatus.DRAFT]: 'پیش‌نویس',
    [AACOApplicationStatus.SUBMITTED]: 'ارسال شده',
    [AACOApplicationStatus.UNDER_REVIEW]: 'در حال بررسی',
    [AACOApplicationStatus.APPROVED]: 'تایید شده',
    [AACOApplicationStatus.REJECTED]: 'رد شده',
  }
  return labels[status] || status
}

// Helper function to get status color
export function getStatusColor(status: AACOApplicationStatus): string {
  const colors: Record<AACOApplicationStatus, string> = {
    [AACOApplicationStatus.DRAFT]: 'bg-gray-100 text-gray-800',
    [AACOApplicationStatus.SUBMITTED]: 'bg-blue-100 text-blue-800',
    [AACOApplicationStatus.UNDER_REVIEW]: 'bg-yellow-100 text-yellow-800',
    [AACOApplicationStatus.APPROVED]: 'bg-green-100 text-green-800',
    [AACOApplicationStatus.REJECTED]: 'bg-red-100 text-red-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}
