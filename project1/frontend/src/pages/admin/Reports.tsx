import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Download, 
  FileText,
  Users,
  Calendar,
  Award,
  DollarSign,
  Clock,
  BarChart3,
  TrendingUp
} from 'lucide-react'
import {
  ReportCard,
  ScheduledReportCard,
  ReportStatsCard,
  ReportTemplateSelector
} from '@/components/director/reports'
import { PageSkeleton } from '@/components/ui/page-skeleton'

export default function Reports() {
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])
  const handleViewReport = (reportId: string) => {
    console.log('Viewing report:', reportId)
  }

  const handleDownloadReport = (reportId: string) => {
    console.log('Downloading report:', reportId)
  }

  const handleCreateCustomReport = () => {
    console.log('Creating custom report')
  }

  const handleReportSettings = (reportId: string) => {
    console.log('Opening settings for:', reportId)
  }

  const handleToggleReport = (reportId: string) => {
    console.log('Toggling report:', reportId)
  }

  const reports = [
    {
      title: 'گزارش کاربران',
      description: 'آمار کامل کاربران، نقش‌ها و فعالیت‌ها',
      icon: Users,
      color: 'blue',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      items: ['کل کاربران', 'کاربران فعال', 'توزیع نقش‌ها', 'نرخ رشد'],
    },
    {
      title: 'گزارش درخواست‌ها',
      description: 'تحلیل درخواست‌های عضویت و وضعیت آنها',
      icon: FileText,
      color: 'green',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      items: ['کل درخواست‌ها', 'در انتظار', 'تایید شده', 'نرخ تایید'],
    },
    {
      title: 'گزارش رویدادها',
      description: 'آمار رویدادها، حضور و میزان مشارکت',
      icon: Calendar,
      color: 'purple',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
      items: ['کل رویدادها', 'برگزار شده', 'میانگین حضور', 'رضایت شرکت‌کنندگان'],
    },
    {
      title: 'گزارش تیم‌ها',
      description: 'تحلیل تیم‌ها، پروژه‌ها و پیشرفت',
      icon: Award,
      color: 'orange',
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600',
      items: ['کل تیم‌ها', 'تیم‌های فعال', 'توزیع فازها', 'نرخ موفقیت'],
    },
    {
      title: 'گزارش مالی',
      description: 'آمار تسهیلات، بودجه و هزینه‌ها',
      icon: DollarSign,
      color: 'yellow',
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      items: ['کل تسهیلات', 'تایید شده', 'در انتظار', 'مجموع بودجه'],
    },
    {
      title: 'گزارش عملکرد',
      description: 'تحلیل کلی عملکرد سیستم و KPI ها',
      icon: TrendingUp,
      color: 'indigo',
      bgColor: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      items: ['نرخ رشد', 'نرخ فعالیت', 'رضایت کاربران', 'بهره‌وری'],
    },
  ]

  const scheduledReports = [
    { 
      id: '1', 
      name: 'گزارش هفتگی کاربران', 
      schedule: 'هر دوشنبه ساعت 9 صبح', 
      status: 'active' as const,
      nextRun: 'دوشنبه 9:00'
    },
    { 
      id: '2', 
      name: 'گزارش ماهانه عملکرد', 
      schedule: 'اول هر ماه', 
      status: 'active' as const,
      nextRun: '1 آذر'
    },
    { 
      id: '3', 
      name: 'گزارش روزانه فعالیت‌ها', 
      schedule: 'هر روز ساعت 8 صبح', 
      status: 'inactive' as const
    },
    { 
      id: '4', 
      name: 'گزارش سه‌ماهه تحلیلی', 
      schedule: 'هر سه ماه یکبار', 
      status: 'active' as const,
      nextRun: '1 دی'
    },
  ]

  // Show skeleton while loading
  if (isLoading) {
    return <PageSkeleton showHeader showStats statsCount={4} showFilters={false} itemsCount={6} />
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-8 text-white shadow-2xl"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
              <BarChart3 className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">گزارشات تحلیلی</h1>
              <p className="text-white/90 text-lg mt-1">دریافت و مدیریت گزارش‌های جامع سیستم</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <ReportStatsCard
          label="گزارش‌های ایجاد شده"
          value="24"
          icon={FileText}
          bgGradient="from-blue-50 to-cyan-50"
          iconColor="text-blue-600"
          delay={0}
        />
        <ReportStatsCard
          label="دانلود این ماه"
          value="156"
          icon={Download}
          bgGradient="from-green-50 to-emerald-50"
          iconColor="text-green-600"
          delay={0.1}
        />
        <ReportStatsCard
          label="گزارش‌های خودکار"
          value="8"
          icon={Clock}
          bgGradient="from-purple-50 to-pink-50"
          iconColor="text-purple-600"
          delay={0.2}
        />
        <ReportStatsCard
          label="آخرین بروزرسانی"
          value="امروز"
          icon={Calendar}
          bgGradient="from-orange-50 to-amber-50"
          iconColor="text-orange-600"
          delay={0.3}
        />
      </div>

      {/* Report Template Selector */}
      <ReportTemplateSelector onCreateCustom={handleCreateCustomReport} />

      {/* Reports Grid */}
      <div>
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-gray-900 mb-4"
        >
          گزارش‌های آماده
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <ReportCard
              key={report.title}
              title={report.title}
              description={report.description}
              icon={report.icon}
              items={report.items}
              bgGradient={`from-${report.color}-500 to-${report.color}-600`}
              iconColor={report.iconColor}
              onView={() => handleViewReport(report.title)}
              onDownload={() => handleDownloadReport(report.title)}
              lastUpdated="امروز"
            />
          ))}
        </div>
      </div>

      {/* Scheduled Reports */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-xl">
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-indigo-600 rounded-lg">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <span>گزارش‌های زمان‌بندی شده</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {scheduledReports.map((report) => (
                <ScheduledReportCard
                  key={report.id}
                  report={report}
                  onSettings={handleReportSettings}
                  onToggle={handleToggleReport}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
