import { useState, useEffect, useRef } from 'react'
import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    Users, Search, Plus, Edit, Trash2, Eye, Shield, UserCheck, UserX,
    Download, Phone, GraduationCap, MoreVertical
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PageSkeleton } from '@/components/ui/page-skeleton'
import api from '@/lib/api'
import { UserRole } from '@/types/roles'

interface User {
    _id: string
    firstName: string
    lastName: string
    email: string
    phoneNumber?: string
    role: UserRole[]
    university?: string
    major?: string
    studentId?: string
    isActive: boolean
    createdAt: string
}

export default function UserManagement() {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const observerTarget = useRef<HTMLDivElement>(null)

    const [searchQuery, setSearchQuery] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [roleFilter, setRoleFilter] = useState<UserRole | 'ALL'>('ALL')
    const [statusFilter, setStatusFilter] = useState<'active' | 'inactive' | 'ALL'>('ALL')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [selectedUsers, setSelectedUsers] = useState<string[]>([])

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500)
        return () => clearTimeout(timer)
    }, [searchQuery])

    const { data: stats } = useQuery({
        queryKey: ['users-stats'],
        queryFn: async () => {
            const response = await api.get('/users/stats')
            return response.data.data
        },
    })

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey: ['users-infinite', roleFilter, statusFilter, debouncedSearch],
        queryFn: async ({ pageParam = 1 }) => {
            const params = new URLSearchParams({
                page: pageParam.toString(),
                limit: '20',
            })

            if (roleFilter !== 'ALL') params.append('role', roleFilter)
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

    const allUsers = data?.pages.flatMap(page => page.users) || []

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
        if (currentTarget) observer.observe(currentTarget)
        return () => { if (currentTarget) observer.unobserve(currentTarget) }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage])

    const deleteMutation = useMutation({
        mutationFn: async (userId: string) => {
            await api.delete(`/users/${userId}`)
        },
        onSuccess: () => {
            console.log('کاربر با موفقیت حذف شد')
            queryClient.invalidateQueries({ queryKey: ['users-infinite'] })
            queryClient.invalidateQueries({ queryKey: ['users-stats'] })
        },
    })

    const toggleStatusMutation = useMutation({
        mutationFn: async (userId: string) => {
            await api.patch(`/users/${userId}/toggle-status`)
        },
        onSuccess: () => {
            console.log('وضعیت کاربر تغییر کرد')
            queryClient.invalidateQueries({ queryKey: ['users-infinite'] })
            queryClient.invalidateQueries({ queryKey: ['users-stats'] })
        },
    })

    if (isLoading) {
        return <PageSkeleton showHeader showStats statsCount={4} showFilters itemsCount={10} />
    }

    return (
        <div className="h-[calc(100vh-4rem)] w-full max-w-full overflow-x-hidden overflow-y-auto p-3 flex flex-col gap-2" dir="rtl">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-3 text-white shadow-lg flex-shrink-0"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                            <Users className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">مدیریت کاربران</h1>
                            <p className="text-white/80 text-sm">مدیریت کاربران و نقش‌ها</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="text-center px-3 py-2 bg-white/10 backdrop-blur-sm rounded-xl">
                            <p className="text-xl font-bold">{stats?.total || 0}</p>
                            <p className="text-xs opacity-80">کل کاربران</p>
                        </div>
                        <div className="text-center px-3 py-2 bg-white/10 backdrop-blur-sm rounded-xl">
                            <p className="text-xl font-bold text-green-300">{stats?.active || 0}</p>
                            <p className="text-xs opacity-80">فعال</p>
                        </div>
                        <div className="text-center px-3 py-2 bg-white/10 backdrop-blur-sm rounded-xl">
                            <p className="text-xl font-bold text-blue-300">{stats?.verified || 0}</p>
                            <p className="text-xs opacity-80">تایید شده</p>
                        </div>
                        <Button className="bg-white text-indigo-600 hover:bg-white/90" size="sm">
                            <Plus className="h-4 w-4 ml-2" />
                            کاربر جدید
                        </Button>
                    </div>
                </div>
            </motion.div>

            {/* Filters */}
            <Card className="border-0 shadow flex-shrink-0">
                <CardContent className="p-2">
                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="relative flex-1 min-w-[200px]">
                            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="جستجو کاربران..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pr-10 pl-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                            />
                        </div>

                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value as UserRole | 'ALL')}
                            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                        >
                            <option value="ALL">همه نقش‌ها</option>
                            <option value="APPLICANT">متقاضی</option>
                            <option value="CLUB_MEMBER">عضو باشگاه</option>
                            <option value="MANAGER">مدیر</option>
                            <option value="ADMIN">ادمین</option>
                            <option value="DIRECTOR">مدیرکل</option>
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as 'active' | 'inactive' | 'ALL')}
                            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                        >
                            <option value="ALL">همه وضعیت‌ها</option>
                            <option value="active">فعال</option>
                            <option value="inactive">غیرفعال</option>
                        </select>

                        <div className="flex gap-1">
                            <Button
                                onClick={() => setViewMode('grid')}
                                variant={viewMode === 'grid' ? 'default' : 'outline'}
                                size="sm"
                            >
                                شبکه‌ای
                            </Button>
                            <Button
                                onClick={() => setViewMode('list')}
                                variant={viewMode === 'list' ? 'default' : 'outline'}
                                size="sm"
                            >
                                لیستی
                            </Button>
                        </div>

                        <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 ml-2" />
                            خروجی
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Bulk Actions */}
            {selectedUsers.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40"
                >
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-2xl p-3 flex items-center gap-3 text-white">
                        <span className="font-bold text-sm">{selectedUsers.length} کاربر انتخاب شده</span>
                        <Button size="sm" className="bg-green-500 hover:bg-green-600">
                            <UserCheck className="h-4 w-4 ml-2" />
                            فعال
                        </Button>
                        <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600">
                            <UserX className="h-4 w-4 ml-2" />
                            غیرفعال
                        </Button>
                        <Button size="sm" className="bg-red-500 hover:bg-red-600">
                            <Trash2 className="h-4 w-4 ml-2" />
                            حذف
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => setSelectedUsers([])}
                            className="bg-white/20 hover:bg-white/30"
                        >
                            لغو
                        </Button>
                    </div>
                </motion.div>
            )}

            {/* Users Grid/List */}
            <Card className="border-0 shadow flex-1 flex flex-col overflow-hidden">
                <CardContent className="flex-1 overflow-hidden p-3">
                    <div className="h-full overflow-y-auto">
                        {viewMode === 'grid' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {allUsers.map((user: User, index: number) => (
                                    <UserCard
                                        key={user._id}
                                        user={user}
                                        index={index}
                                        isSelected={selectedUsers.includes(user._id)}
                                        onSelect={(id) => {
                                            setSelectedUsers(prev =>
                                                prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
                                            )
                                        }}
                                        onView={() => navigate(`/director/users/${user._id}`)}
                                        onEdit={() => navigate(`/director/users/${user._id}/edit`)}
                                        onDelete={() => {
                                            if (confirm('آیا از حذف این کاربر اطمینان دارید؟')) {
                                                deleteMutation.mutate(user._id)
                                            }
                                        }}
                                        onToggleStatus={() => toggleStatusMutation.mutate(user._id)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {allUsers.map((user: User, index: number) => (
                                    <UserListItem
                                        key={user._id}
                                        user={user}
                                        index={index}
                                        isSelected={selectedUsers.includes(user._id)}
                                        onSelect={(id) => {
                                            setSelectedUsers(prev =>
                                                prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
                                            )
                                        }}
                                        onView={() => navigate(`/director/users/${user._id}`)}
                                        onEdit={() => navigate(`/director/users/${user._id}/edit`)}
                                        onDelete={() => {
                                            if (confirm('آیا از حذف این کاربر اطمینان دارید؟')) {
                                                deleteMutation.mutate(user._id)
                                            }
                                        }}
                                        onToggleStatus={() => toggleStatusMutation.mutate(user._id)}
                                    />
                                ))}
                            </div>
                        )}

                        {allUsers.length === 0 && (
                            <div className="text-center py-16">
                                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">کاربری یافت نشد</h3>
                                <p className="text-gray-600">فیلترها را تغییر دهید</p>
                            </div>
                        )}

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
        </div>
    )
}

interface UserCardProps {
    user: User
    index: number
    isSelected: boolean
    onSelect: (id: string) => void
    onView: () => void
    onEdit: () => void
    onDelete: () => void
    onToggleStatus: () => void
}

function UserCard({ user, index, isSelected, onSelect, onView, onEdit, onDelete, onToggleStatus }: UserCardProps) {
    const [showActions, setShowActions] = useState(false)

    const getRoleColor = (role: UserRole) => {
        const colors: Partial<Record<UserRole, string>> = {
            [UserRole.APPLICANT]: 'bg-blue-100 text-blue-800',
            [UserRole.CLUB_MEMBER]: 'bg-green-100 text-green-800',
            [UserRole.MANAGER]: 'bg-purple-100 text-purple-800',
            [UserRole.ADMIN]: 'bg-red-100 text-red-800',
            [UserRole.DIRECTOR]: 'bg-yellow-100 text-yellow-800',
        }
        return colors[role] || 'bg-gray-100 text-gray-800'
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.02 }}
            whileHover={{ y: -2 }}
            className={`relative ${isSelected ? 'ring-2 ring-indigo-500' : ''}`}
        >
            <Card className="overflow-hidden hover:shadow-lg transition-all h-full">
                <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => onSelect(user._id)}
                                className="w-4 h-4 text-indigo-600 rounded"
                            />
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                {user.firstName[0]}{user.lastName[0]}
                            </div>
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => setShowActions(!showActions)}
                                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <MoreVertical className="h-4 w-4" />
                            </button>
                            {showActions && (
                                <div className="absolute left-0 top-8 bg-white rounded-lg shadow-lg py-1 w-32 z-10">
                                    <button onClick={onView} className="w-full px-3 py-1.5 text-right hover:bg-gray-100 flex items-center gap-2 text-sm">
                                        <Eye className="h-3 w-3" />
                                        مشاهده
                                    </button>
                                    <button onClick={onEdit} className="w-full px-3 py-1.5 text-right hover:bg-gray-100 flex items-center gap-2 text-sm">
                                        <Edit className="h-3 w-3" />
                                        ویرایش
                                    </button>
                                    <button onClick={onToggleStatus} className="w-full px-3 py-1.5 text-right hover:bg-gray-100 flex items-center gap-2 text-sm">
                                        <Shield className="h-3 w-3" />
                                        تغییر وضعیت
                                    </button>
                                    <button onClick={onDelete} className="w-full px-3 py-1.5 text-right hover:bg-gray-100 flex items-center gap-2 text-red-600 text-sm">
                                        <Trash2 className="h-3 w-3" />
                                        حذف
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <h3 className="text-base font-bold text-gray-900 mb-1">
                        {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-xs text-gray-600 mb-3">{user.email}</p>

                    <div className="space-y-2 mb-3">
                        {user.phoneNumber && (
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                <Phone className="h-3 w-3" />
                                {user.phoneNumber}
                            </div>
                        )}
                        {user.university && (
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                <GraduationCap className="h-3 w-3" />
                                {user.university}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                        {user.role.map((role: UserRole) => (
                            <span key={role} className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRoleColor(role)}`}>
                                {role === UserRole.APPLICANT ? 'متقاضی' :
                                    role === UserRole.CLUB_MEMBER ? 'عضو' :
                                        role === UserRole.MANAGER ? 'مدیر' :
                                            role === UserRole.ADMIN ? 'ادمین' : 'مدیرکل'}
                            </span>
                        ))}
                    </div>

                    <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                            {user.isActive ? 'فعال' : 'غیرفعال'}
                        </span>
                        <Button onClick={onView} size="sm" variant="outline">
                            مشاهده
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}

interface UserListItemProps {
    user: User
    index: number
    isSelected: boolean
    onSelect: (id: string) => void
    onView: () => void
    onEdit: () => void
    onDelete: () => void
    onToggleStatus: () => void
}

function UserListItem({ user, index, isSelected, onSelect, onView, onEdit, onDelete }: UserListItemProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.02 }}
        >
            <Card className={`hover:shadow-md transition-all ${isSelected ? 'ring-2 ring-indigo-500' : ''}`}>
                <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                            <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => onSelect(user._id)}
                                className="w-4 h-4 text-indigo-600 rounded"
                            />
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                                {user.firstName[0]}{user.lastName[0]}
                            </div>

                            <div className="flex-1">
                                <h3 className="text-sm font-bold text-gray-900">
                                    {user.firstName} {user.lastName}
                                </h3>
                                <p className="text-xs text-gray-600">{user.email}</p>
                            </div>

                            <div className="flex gap-1">
                                {user.role.slice(0, 2).map((role: UserRole) => (
                                    <span key={role} className="px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                        {role === UserRole.APPLICANT ? 'متقاضی' :
                                            role === UserRole.CLUB_MEMBER ? 'عضو' :
                                                role === UserRole.MANAGER ? 'مدیر' :
                                                    role === UserRole.ADMIN ? 'ادمین' : 'مدیرکل'}
                                    </span>
                                ))}
                            </div>

                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                {user.isActive ? 'فعال' : 'غیرفعال'}
                            </span>
                        </div>

                        <div className="flex items-center gap-1">
                            <Button onClick={onView} size="sm" variant="outline">
                                <Eye className="h-3 w-3 ml-1" />
                                مشاهده
                            </Button>
                            <Button onClick={onEdit} size="sm" variant="outline">
                                <Edit className="h-3 w-3" />
                            </Button>
                            <Button onClick={onDelete} size="sm" variant="outline" className="text-red-600 hover:bg-red-50">
                                <Trash2 className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
