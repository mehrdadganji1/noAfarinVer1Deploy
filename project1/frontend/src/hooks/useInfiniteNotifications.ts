import { useInfiniteQuery } from '@tanstack/react-query'
import api from '@/lib/api'

interface NotificationsResponse {
  success: boolean
  data: {
    notifications: any[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
      hasNextPage: boolean
    }
  }
}

interface UseInfiniteNotificationsOptions {
  limit?: number
  typeFilter?: string
  readFilter?: string
  searchQuery?: string
}

export function useInfiniteNotifications(options: UseInfiniteNotificationsOptions = {}) {
  const { limit = 10, typeFilter = 'all', readFilter = 'all', searchQuery = '' } = options

  return useInfiniteQuery({
    queryKey: ['infinite-notifications', limit, typeFilter, readFilter, searchQuery],
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams({
        page: pageParam.toString(),
        limit: limit.toString(),
      })

      if (typeFilter !== 'all') params.append('type', typeFilter)
      if (readFilter !== 'all') params.append('isRead', readFilter === 'read' ? 'true' : 'false')
      if (searchQuery) params.append('search', searchQuery)

      const response = await api.get<NotificationsResponse>(`/api/notifications?${params.toString()}`)
      return response.data.data
    },
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasNextPage ? lastPage.pagination.page + 1 : undefined
    },
    initialPageParam: 1,
  })
}
