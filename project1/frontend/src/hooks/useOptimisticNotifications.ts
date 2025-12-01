import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { toast } from '@/components/ui/toast'

export function useOptimisticMarkAsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await api.patch(`/api/notifications/${notificationId}/read`)
      return response.data
    },
    onMutate: async (notificationId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['notifications'] })
      await queryClient.cancelQueries({ queryKey: ['unread-count'] })

      // Snapshot previous values
      const previousNotifications = queryClient.getQueryData(['notifications'])
      const previousCount = queryClient.getQueryData(['unread-count'])

      // Optimistically update notifications
      queryClient.setQueryData(['notifications'], (old: any) => {
        if (!old?.data?.notifications) return old
        return {
          ...old,
          data: {
            ...old.data,
            notifications: old.data.notifications.map((n: any) =>
              n._id === notificationId ? { ...n, isRead: true } : n
            )
          }
        }
      })

      // Optimistically update count
      queryClient.setQueryData(['unread-count'], (old: number = 0) => Math.max(0, old - 1))

      return { previousNotifications, previousCount }
    },
    onError: (_err, _notificationId, context) => {
      // Rollback on error
      if (context?.previousNotifications) {
        queryClient.setQueryData(['notifications'], context.previousNotifications)
      }
      if (context?.previousCount !== undefined) {
        queryClient.setQueryData(['unread-count'], context.previousCount)
      }
      toast.error('خطا در علامت‌گذاری اعلان')
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['unread-count'] })
    }
  })
}

export function useOptimisticDelete() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await api.delete(`/api/notifications/${notificationId}`)
      return response.data
    },
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] })

      const previousNotifications = queryClient.getQueryData(['notifications'])

      // Optimistically remove notification
      queryClient.setQueryData(['notifications'], (old: any) => {
        if (!old?.data?.notifications) return old
        return {
          ...old,
          data: {
            ...old.data,
            notifications: old.data.notifications.filter((n: any) => n._id !== notificationId)
          }
        }
      })

      return { previousNotifications }
    },
    onError: (_err, _notificationId, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(['notifications'], context.previousNotifications)
      }
      toast.error('خطا در حذف اعلان')
    },
    onSuccess: () => {
      toast.success('اعلان حذف شد')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['unread-count'] })
    }
  })
}

export function useOptimisticBulkMarkAsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (notificationIds: string[]) => {
      await Promise.all(
        notificationIds.map(id => api.patch(`/api/notifications/${id}/read`))
      )
    },
    onMutate: async (notificationIds) => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] })

      const previousNotifications = queryClient.getQueryData(['notifications'])

      queryClient.setQueryData(['notifications'], (old: any) => {
        if (!old?.data?.notifications) return old
        return {
          ...old,
          data: {
            ...old.data,
            notifications: old.data.notifications.map((n: any) =>
              notificationIds.includes(n._id) ? { ...n, isRead: true } : n
            )
          }
        }
      })

      return { previousNotifications }
    },
    onError: (_err, _notificationIds, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(['notifications'], context.previousNotifications)
      }
      toast.error('خطا در علامت‌گذاری اعلانات')
    },
    onSuccess: () => {
      toast.success('اعلانات علامت‌گذاری شدند')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['unread-count'] })
    }
  })
}

export function useOptimisticBulkDelete() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (notificationIds: string[]) => {
      await Promise.all(
        notificationIds.map(id => api.delete(`/api/notifications/${id}`))
      )
    },
    onMutate: async (notificationIds) => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] })

      const previousNotifications = queryClient.getQueryData(['notifications'])

      queryClient.setQueryData(['notifications'], (old: any) => {
        if (!old?.data?.notifications) return old
        return {
          ...old,
          data: {
            ...old.data,
            notifications: old.data.notifications.filter((n: any) => !notificationIds.includes(n._id))
          }
        }
      })

      return { previousNotifications }
    },
    onError: (_err, _notificationIds, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(['notifications'], context.previousNotifications)
      }
      toast.error('خطا در حذف اعلانات')
    },
    onSuccess: () => {
      toast.success('اعلانات حذف شدند')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['unread-count'] })
    }
  })
}
