import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { PageSkeleton } from '@/components/ui/page-skeleton'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ClipboardCheck, LayoutGrid, List, Download } from 'lucide-react'
import { toast } from '@/components/ui/toast'
import {
    ApplicationsFilters,
    ApplicationsList,
    ApplicationDetailsModal,
    BulkActionsBar,
    AdvancedFilters,
    ApplicationsTimeline,
    ExportDialog,
} from '@/components/director/applications'
import type { FilterValues } from '@/components/director/applications/AdvancedFilters'

export interface Application {
    _id: string
    userId: {
        _id: string
        firstName: string
        lastName: string
        email: string
    }
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    university: string
    major: string
    degree: string
    studentId: string
    status: 'pending' | 'approved' | 'rejected' | 'under-review'
    submittedAt: string
    reviewedAt?: string
    reviewedBy?: string
    reviewNotes?: string
}

export default function DirectorApplications() {
    const queryClient = useQueryClient()
    const [statusFilter, setStatusFilter] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
    const [page, setPage] = useState(1)
    const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid')
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [advancedFilters, setAdvancedFilters] = useState<FilterValues>({})
    const [showExportDialog, setShowExportDialog] = useState(false)

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery)
        }, 500)
        return () => clearTimeout(timer)
    }, [searchQuery])

    // Fetch applications
    const { data, isLoading } = useQuery({
        queryKey: ['director-applications', statusFilter, debouncedSearch, page],
        queryFn: async () => {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '20',
            })

            if (statusFilter !== 'all') params.append('status', statusFilter)
            if (debouncedSearch) params.append('search', debouncedSearch)

            const response = await api.get(`/applications?${params.toString()}`)
            return response.data
        },
    })

    // Fetch stats
    const { data: stats } = useQuery({
        queryKey: ['applications-stats'],
        queryFn: async () => {
            const response = await api.get('/applications/stats')
            return response.data.data
        },
    })

    const handleResetFilters = () => {
        setSearchQuery('')
        setDebouncedSearch('')
        setStatusFilter('all')
        setPage(1)
    }

    if (isLoading) {
        return <PageSkeleton showHeader showStats statsCount={5} showFilters itemsCount={9} />
    }

    const applications = data?.data || []
    const pagination = data?.pagination || { total: 0, pages: 0 }

    return (
        <div className="h-[calc(100vh-4rem)] w-full max-w-full overflow-x-hidden overflow-y-auto p-3 flex flex-col gap-2" dir="rtl">
            {/* Compact Header with Stats */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-3 text-white shadow-lg flex-shrink-0 w-full max-w-full"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                            <ClipboardCheck className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">مدیریت درخواست‌ها</h1>
                            <p className="text-white/80 text-sm">بررسی و تصمیم‌گیری درباره درخواست‌های عضویت</p>
                        </div>
                    </div>

                    {/* Inline Stats */}
                    <div className="flex items-center gap-2">
                        <div className="text-center px-3 py-2 bg-white/10 backdrop-blur-sm rounded-xl">
                            <p className="text-xl font-bold">{stats?.total || 0}</p>
                            <p className="text-xs opacity-80">کل</p>
                        </div>
                        <div className="text-center px-3 py-2 bg-white/10 backdrop-blur-sm rounded-xl">
                            <p className="text-xl font-bold text-yellow-300">{stats?.pending || 0}</p>
                            <p className="text-xs opacity-80">در انتظار</p>
                        </div>
                        <div className="text-center px-3 py-2 bg-white/10 backdrop-blur-sm rounded-xl">
                            <p className="text-xl font-bold text-green-300">{stats?.approved || 0}</p>
                            <p className="text-xs opacity-80">تایید</p>
                        </div>
                        <div className="text-center px-3 py-2 bg-white/10 backdrop-blur-sm rounded-xl">
                            <p className="text-xl font-bold text-red-300">{stats?.rejected || 0}</p>
                            <p className="text-xs opacity-80">رد</p>
                        </div>
                        <div className="text-center px-3 py-2 bg-white/10 backdrop-blur-sm rounded-xl">
                            <p className="text-xl font-bold text-purple-300">{stats?.approvalRate || 0}%</p>
                            <p className="text-xs opacity-80">نرخ تایید</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Filters Bar - Compact */}
            <Card className="border-0 shadow flex-shrink-0 w-full max-w-full">
                <CardContent className="p-2">
                    <ApplicationsFilters
                        statusFilter={statusFilter}
                        searchQuery={searchQuery}
                        onStatusChange={setStatusFilter}
                        onSearchChange={setSearchQuery}
                        totalCount={pagination.total}
                        onReset={handleResetFilters}
                    />
                </CardContent>
            </Card>

            {/* Applications Grid - Takes remaining space */}
            <Card className="border-0 shadow flex-1 flex flex-col overflow-hidden w-full max-w-full">
                <CardContent className="flex-1 overflow-hidden p-3">
                    <div className="h-full overflow-y-auto">
                        <ApplicationsList
                            applications={applications}
                            onSelectApplication={setSelectedApplication}
                        />

                        {/* Pagination */}
                        {pagination.pages > 1 && (
                            <div className="flex justify-center gap-2 mt-4 pb-4">
                                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((pageNum) => (
                                    <button
                                        key={pageNum}
                                        type="button"
                                        onClick={() => setPage(pageNum)}
                                        className={`px-4 py-2 rounded-lg transition-all ${page === pageNum
                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                            : 'bg-white text-gray-700 hover:bg-blue-50 border-2 border-gray-200'
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Details Modal */}
            {selectedApplication && (
                <ApplicationDetailsModal
                    application={selectedApplication}
                    onClose={() => setSelectedApplication(null)}
                />
            )}
        </div>
    )
}
