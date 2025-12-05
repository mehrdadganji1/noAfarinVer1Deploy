import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, 
  RefreshCw, 
  ChevronRight, 
  ChevronLeft,
  Inbox
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  useAACOAdminApplications, 
  AACOApplication,
  AACOApplicationStatus 
} from '@/hooks/useAACOAdminApplications'
import {
  AACOApplicationStats,
  AACOApplicationFilters,
  AACOApplicationCard,
  AACOApplicationDetailModal,
  AACOStatusChangeModal,
} from '@/components/admin/aaco-applications'

type ActionType = 'approve' | 'reject' | 'review' | 'resubmit'

export default function AACOApplications() {
  const {
    applications,
    pagination,
    stats,
    loading,
    error,
    filters,
    updateFilters,
    changePage,
    updateStatus,
    refetch,
  } = useAACOAdminApplications()

  // Modal states
  const [selectedApplication, setSelectedApplication] = useState<AACOApplication | null>(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [statusModalOpen, setStatusModalOpen] = useState(false)
  const [currentAction, setCurrentAction] = useState<ActionType | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  // Handlers
  const handleView = (application: AACOApplication) => {
    setSelectedApplication(application)
    setDetailModalOpen(true)
  }

  const handleApprove = (application: AACOApplication) => {
    setSelectedApplication(application)
    setCurrentAction('approve')
    setStatusModalOpen(true)
  }

  const handleReject = (application: AACOApplication) => {
    setSelectedApplication(application)
    setCurrentAction('reject')
    setStatusModalOpen(true)
  }

  const handleReview = (application: AACOApplication) => {
    setSelectedApplication(application)
    setCurrentAction('review')
    setStatusModalOpen(true)
  }

  const handleResubmit = (application: AACOApplication) => {
    setSelectedApplication(application)
    setCurrentAction('resubmit')
    setStatusModalOpen(true)
  }

  const handleStatusChange = async (status: AACOApplicationStatus, notes?: string) => {
    if (!selectedApplication) return
    
    setActionLoading(true)
    try {
      await updateStatus(selectedApplication._id, status, notes)
      setStatusModalOpen(false)
      setSelectedApplication(null)
      setCurrentAction(null)
    } finally {
      setActionLoading(false)
    }
  }

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false)
    setSelectedApplication(null)
  }

  const handleCloseStatusModal = () => {
    setStatusModalOpen(false)
    setSelectedApplication(null)
    setCurrentAction(null)
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 p-8 text-white shadow-2xl"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <FileText className="h-10 w-10" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">درخواست‌های پیش ثبت‌نام AACO</h1>
                <p className="text-white/80 mt-2">
                  مدیریت و بررسی درخواست‌های عضویت در باشگاه نوآفرینان
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => refetch()}
              disabled={loading}
              className="bg-white/20 hover:bg-white/30 text-white border-0"
            >
              <RefreshCw className={`h-4 w-4 ml-2 ${loading ? 'animate-spin' : ''}`} />
              به‌روزرسانی
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <AACOApplicationStats stats={stats} loading={loading} />

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-0 shadow-lg bg-white dark:bg-gray-900 rounded-2xl overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500" />
          <CardContent className="p-6">
            <AACOApplicationFilters
              filters={filters}
              onFilterChange={updateFilters}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Applications List */}
      <div className="space-y-4">
        {error && (
          <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
            <CardContent className="p-4">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
                    <div className="flex-1">
                      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                    </div>
                  </div>
                  <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : applications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="border-0 shadow-lg bg-white dark:bg-gray-900 rounded-2xl">
              <CardContent className="p-16 text-center">
                <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
                  <Inbox className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  درخواستی یافت نشد
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                  {filters.status || filters.search
                    ? 'با فیلترهای انتخاب شده درخواستی وجود ندارد. فیلترها را تغییر دهید.'
                    : 'هنوز درخواستی ثبت نشده است. منتظر درخواست‌های جدید باشید.'}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <>
            {applications.map((application, index) => (
              <AACOApplicationCard
                key={application._id}
                application={application}
                onView={handleView}
                onApprove={handleApprove}
                onReject={handleReject}
                onReview={handleReview}
                onResubmit={handleResubmit}
                index={index}
              />
            ))}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-4 pt-6"
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => changePage(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="rounded-xl bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <ChevronRight className="h-4 w-4 ml-1" />
                  قبلی
                </Button>
                
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    صفحه {pagination.page} از {pagination.pages}
                  </span>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => changePage(pagination.page + 1)}
                  disabled={pagination.page >= pagination.pages}
                  className="rounded-xl bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  بعدی
                  <ChevronLeft className="h-4 w-4 mr-1" />
                </Button>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <AACOApplicationDetailModal
        application={selectedApplication}
        open={detailModalOpen}
        onClose={handleCloseDetailModal}
        onApprove={handleApprove}
        onReject={handleReject}
        onReview={handleReview}
        onResubmit={handleResubmit}
      />

      <AACOStatusChangeModal
        application={selectedApplication}
        action={currentAction}
        open={statusModalOpen}
        onClose={handleCloseStatusModal}
        onConfirm={handleStatusChange}
        loading={actionLoading}
      />
    </div>
  )
}
