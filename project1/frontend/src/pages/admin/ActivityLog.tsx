import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Activity, 
  UserPlus, 
  FileCheck, 
  Calendar,
  Users,
  Settings,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Zap
} from 'lucide-react'
import {
  ActivityFilters,
  ActivityStatsCard,
  ActivityTimeline
} from '@/components/director/activity'
import { PageSkeleton } from '@/components/ui/page-skeleton'

interface ActivityItem {
  id: string
  type: 'user' | 'application' | 'event' | 'team' | 'system' | 'error' | 'success'
  title: string
  description: string
  user: string
  timestamp: string
  status: 'success' | 'warning' | 'error' | 'info'
}

export default function ActivityLog() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  // Mock data - در واقعیت از API می‌آید
  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'user',
      title: 'کاربر جدید ثبت‌نام کرد',
      description: 'محمد رضایی با ایمیل m.rezaei@example.com ثبت‌نام کرد',
      user: 'سیستم',
      timestamp: '5 دقیقه پیش',
      status: 'success',
    },
    {
      id: '2',
      type: 'application',
      title: 'درخواست عضویت تایید شد',
      description: 'درخواست سارا احمدی توسط مدیر سیستم تایید شد',
      user: 'علی محمدی',
      timestamp: '15 دقیقه پیش',
      status: 'success',
    },
    {
      id: '3',
      type: 'event',
      title: 'رویداد جدید ایجاد شد',
      description: 'کارگاه آموزشی React Advanced برنامه‌ریزی شد',
      user: 'رضا کریمی',
      timestamp: '1 ساعت پیش',
      status: 'info',
    },
    {
      id: '4',
      type: 'team',
      title: 'تیم جدید ثبت شد',
      description: 'تیم "نوآوران فناوری" با 5 عضو ایجاد شد',
      user: 'حسین احمدی',
      timestamp: '2 ساعت پیش',
      status: 'success',
    },
    {
      id: '5',
      type: 'error',
      title: 'خطا در ارسال ایمیل',
      description: 'ارسال ایمیل تایید به user@example.com با خطا مواجه شد',
      user: 'سیستم',
      timestamp: '3 ساعت پیش',
      status: 'error',
    },
    {
      id: '6',
      type: 'application',
      title: 'درخواست رد شد',
      description: 'درخواست عضویت احمد نوری رد شد',
      user: 'علی محمدی',
      timestamp: '4 ساعت پیش',
      status: 'warning',
    },
    {
      id: '7',
      type: 'system',
      title: 'بروزرسانی سیستم',
      description: 'نسخه 2.1.0 با موفقیت نصب شد',
      user: 'سیستم',
      timestamp: '5 ساعت پیش',
      status: 'success',
    },
    {
      id: '8',
      type: 'user',
      title: 'تغییر نقش کاربر',
      description: 'نقش کاربر "مریم حسینی" از متقاضی به عضو باشگاه تغییر کرد',
      user: 'علی محمدی',
      timestamp: '6 ساعت پیش',
      status: 'info',
    },
  ]

  const getIcon = (type: string) => {
    switch (type) {
      case 'user': return UserPlus
      case 'application': return FileCheck
      case 'event': return Calendar
      case 'team': return Users
      case 'system': return Settings
      case 'error': return AlertCircle
      default: return Activity
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return CheckCircle2
      case 'error': return XCircle
      case 'warning': return AlertCircle
      default: return Clock
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100'
      case 'error': return 'text-red-600 bg-red-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-blue-600 bg-blue-100'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'user': return 'text-blue-600 bg-blue-100'
      case 'application': return 'text-green-600 bg-green-100'
      case 'event': return 'text-purple-600 bg-purple-100'
      case 'team': return 'text-orange-600 bg-orange-100'
      case 'system': return 'text-gray-600 bg-gray-100'
      case 'error': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterType === 'all' || activity.type === filterType
    return matchesSearch && matchesFilter
  })

  const filterOptions = [
    { value: 'all', label: 'همه' },
    { value: 'user', label: 'کاربران' },
    { value: 'application', label: 'درخواست‌ها' },
    { value: 'event', label: 'رویدادها' },
    { value: 'team', label: 'تیم‌ها' },
    { value: 'system', label: 'سیستم' },
    { value: 'error', label: 'خطاها' },
  ]

  // Show skeleton while loading
  if (isLoading) {
    return <PageSkeleton showHeader showStats statsCount={4} showFilters itemsCount={10} />
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-600 via-teal-600 to-cyan-600 p-8 text-white shadow-2xl"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
              <Zap className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">فعالیت‌های سیستم</h1>
              <p className="text-white/90 text-lg mt-1">مشاهده و پیگیری تمام فعالیت‌های انجام شده</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <ActivityStatsCard
          label="کل فعالیت‌ها"
          value={activities.length}
          icon={Activity}
          bgGradient="from-blue-50 to-cyan-50"
          iconColor="text-blue-600"
          delay={0}
        />
        <ActivityStatsCard
          label="موفق"
          value={activities.filter(a => a.status === 'success').length}
          icon={CheckCircle2}
          bgGradient="from-green-50 to-emerald-50"
          iconColor="text-green-600"
          delay={0.1}
        />
        <ActivityStatsCard
          label="هشدار"
          value={activities.filter(a => a.status === 'warning').length}
          icon={AlertCircle}
          bgGradient="from-yellow-50 to-amber-50"
          iconColor="text-yellow-600"
          delay={0.2}
        />
        <ActivityStatsCard
          label="خطا"
          value={activities.filter(a => a.status === 'error').length}
          icon={XCircle}
          bgGradient="from-red-50 to-rose-50"
          iconColor="text-red-600"
          delay={0.3}
        />
      </div>

      {/* Filters */}
      <ActivityFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterType={filterType}
        onFilterChange={setFilterType}
        filterOptions={filterOptions}
      />

      {/* Activity Timeline */}
      <ActivityTimeline
        activities={filteredActivities}
        getIcon={getIcon}
        getStatusIcon={getStatusIcon}
        getTypeColor={getTypeColor}
        getStatusColor={getStatusColor}
      />
    </div>
  )
}
