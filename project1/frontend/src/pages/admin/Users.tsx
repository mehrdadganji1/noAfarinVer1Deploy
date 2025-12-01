import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Users as UsersIcon } from 'lucide-react'
import api from '@/lib/api'
import { toast } from '@/components/ui/toast'
import { UserRole } from '@/types/roles'
import { PageSkeleton } from '@/components/ui/page-skeleton'
import { getUserProfilePath } from '@/utils/navigation'

// Components
import UserFilters from '@/components/users/UserFilters'
import UserTable from '@/components/users/UserTable'
import UserGrid from '@/components/users/UserGrid'
import RoleManagementDialog from '@/components/users/RoleManagementDialog'

interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  role: UserRole[]
  university?: string
  major?: string
  degree?: string
  studentId?: string
  phoneNumber?: string
  dateOfBirth?: string
  expertise?: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

interface UsersData {
  users: User[]
  pagination: Pagination
}

interface Stats {
  total: number
  active: number
  verified: number
}

export default function Users() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  // Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid')

  // Infinite scroll
  const observerTarget = useRef<HTMLDivElement>(null)

  // Modal states
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [rolesDialogOpen, setRolesDialogOpen] = useState(false)

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch users stats
  const { data: stats } = useQuery<Stats>({
    queryKey: ['users-stats'],
    queryFn: async () => {
      const response = await api.get('/users/stats')
      return response.data.data
    },
  })

  // Fetch users with infinite scroll
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: usersLoading,
  } = useInfiniteQuery({
    queryKey: ['users-infinite', roleFilter, statusFilter, debouncedSearch],
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams({
        page: pageParam.toString(),
        limit: '20',
      })

      if (roleFilter !== 'all') params.append('role', roleFilter)
      if (debouncedSearch) params.append('search', debouncedSearch)

      const response = await api.get(`/users?${params.toString()}`)
      return {
        users: response.data.data || [],
        pagination: response.data.pagination || { page: 1, limit: 20, total: 0, pages: 0 }
      }
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page < lastPage.pagination.pages) {
        return lastPage.pagination.page + 1
      }
      return undefined
    },
    initialPageParam: 1,
  })

  // Flatten all users from pages
  const allUsers = data?.pages.flatMap(page => page.users) || []
  const totalUsers = data?.pages[0]?.pagination.total || 0

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.1 }
    )

    const currentTarget = observerTarget.current
    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])



  // Update user roles mutation
  const updateRolesMutation = useMutation({
    mutationFn: async ({ userId, roles }: { userId: string; roles: UserRole[] }) => {
      const response = await api.patch(`/users/${userId}/roles`, { roles })
      return response.data
    },
    onSuccess: () => {
      toast({
        title: 'موفقیت',
        description: 'نقش‌های کاربر با موفقیت بروزرسانی شد',
      })
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['users-stats'] })
      setRolesDialogOpen(false)
      setSelectedUser(null)
    },
    onError: (error: any) => {
      toast({
        title: 'خطا',
        description: error.response?.data?.error || 'خطا در بروزرسانی نقش‌ها',
        variant: 'destructive',
      })
    },
  })

  // Toggle user status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await api.patch(`/users/${userId}/toggle-status`)
      return response.data
    },
    onSuccess: (data) => {
      toast({
        title: 'موفقیت',
        description: data.message,
      })
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['users-stats'] })
    },
    onError: (error: any) => {
      toast({
        title: 'خطا',
        description: error.response?.data?.error || 'خطا در تغییر وضعیت کاربر',
        variant: 'destructive',
      })
    },
  })

  // Delete user mutation
  const deleteMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await api.delete(`/users/${userId}`)
      return response.data
    },
    onSuccess: () => {
      toast({
        title: 'موفقیت',
        description: 'کاربر با موفقیت حذف شد',
      })
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['users-stats'] })
    },
    onError: (error: any) => {
      toast({
        title: 'خطا',
        description: error.response?.data?.error || 'خطا در حذف کاربر',
        variant: 'destructive',
      })
    },
  })

  // Handlers
  const handleViewDetails = (userId: string) => {
    navigate(getUserProfilePath(userId))
  }

  const handleEditRoles = (userId: string) => {
    const user = allUsers.find((u: User) => u._id === userId)
    if (user) {
      setSelectedUser(user)
      setRolesDialogOpen(true)
    }
  }

  const handleToggleStatus = (userId: string) => {
    if (confirm('آیا از تغییر وضعیت این کاربر اطمینان دارید؟')) {
      toggleStatusMutation.mutate(userId)
    }
  }

  const handleDelete = (userId: string) => {
    if (confirm('آیا از حذف این کاربر اطمینان دارید؟ این عملیات قابل بازگشت نیست.')) {
      deleteMutation.mutate(userId)
    }
  }

  const handleResetFilters = () => {
    setSearchQuery('')
    setDebouncedSearch('')
    setRoleFilter('all')
    setStatusFilter('all')
  }

  const handleSaveRoles = (userId: string, roles: UserRole[]) => {
    updateRolesMutation.mutate({ userId, roles })
  }

  // Show skeleton while initial loading
  if (usersLoading) {
    return <PageSkeleton showHeader showStats statsCount={4} showFilters itemsCount={10} />
  }

  return (
    <div className="h-[calc(100vh-4rem)] w-full max-w-full overflow-x-hidden overflow-y-auto p-3 flex flex-col gap-2">
      {/* Compact Header with Stats */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-3 text-white shadow-lg flex-shrink-0 w-full max-w-full"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
              <UsersIcon className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">مدیریت کاربران</h1>
              <p className="text-white/80 text-sm">مدیریت کاربران و نقش‌ها</p>
            </div>
          </div>

          {/* Inline Stats */}
          <div className="flex items-center gap-3">
            <div className="text-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl">
              <p className="text-2xl font-bold">{stats?.total || 0}</p>
              <p className="text-xs opacity-80">کل کاربران</p>
            </div>
            <div className="text-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl">
              <p className="text-2xl font-bold text-green-300">{stats?.active || 0}</p>
              <p className="text-xs opacity-80">فعال</p>
            </div>
            <div className="text-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl">
              <p className="text-2xl font-bold text-blue-300">{stats?.verified || 0}</p>
              <p className="text-xs opacity-80">تایید شده</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters Bar - Compact */}
      <Card className="border-0 shadow flex-shrink-0 w-full max-w-full">
        <CardContent className="p-2">
          <UserFilters
            searchQuery={searchQuery}
            roleFilter={roleFilter}
            statusFilter={statusFilter}
            viewMode={viewMode}
            totalUsers={totalUsers}
            onSearchChange={setSearchQuery}
            onRoleChange={setRoleFilter}
            onStatusChange={setStatusFilter}
            onViewModeChange={setViewMode}
            onReset={handleResetFilters}
          />
        </CardContent>
      </Card>

      {/* Users Grid/List - Takes remaining space */}
      <Card className="border-0 shadow flex-1 flex flex-col overflow-hidden w-full max-w-full">

        <CardContent className="flex-1 overflow-hidden p-3">
          <div className="h-full overflow-y-auto">
            {viewMode === 'list' ? (
              <UserTable
                users={allUsers}
                isLoading={usersLoading}
                onViewDetails={handleViewDetails}
                onEditRoles={handleEditRoles}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDelete}
              />
            ) : (
              <UserGrid
                users={allUsers}
                isLoading={usersLoading}
                onViewDetails={handleViewDetails}
                onEditRoles={handleEditRoles}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDelete}
              />
            )}

            {/* Infinite Scroll Trigger */}
            <div ref={observerTarget} className="h-10 flex items-center justify-center">
              {isFetchingNextPage && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600" />
                  <span>در حال بارگذاری...</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <RoleManagementDialog
        open={rolesDialogOpen}
        onClose={() => {
          setRolesDialogOpen(false)
          setSelectedUser(null)
        }}
        user={selectedUser}
        onSave={handleSaveRoles}
        isLoading={updateRolesMutation.isPending}
      />
    </div>
  )
}
