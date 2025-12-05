import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap,
  Lightbulb,
  Target,
  Users,
  Calendar,
  FileText,
  Star,
  Briefcase,
  X,
  CheckCircle,
  XCircle,
  Clock,
  Building,
  BookOpen,
  Sparkles
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  AACOApplication, 
  AACOApplicationStatus,
  getStatusLabel,
  getStatusColor 
} from '@/hooks/useAACOAdminApplications'
import { cn } from '@/lib/utils'

interface AACOApplicationDetailModalProps {
  application: AACOApplication | null
  open: boolean
  onClose: () => void
  onApprove?: (application: AACOApplication) => void
  onReject?: (application: AACOApplication) => void
  onReview?: (application: AACOApplication) => void
  onResubmit?: (application: AACOApplication) => void
}

type TabType = 'personal' | 'education' | 'idea' | 'motivation' | 'system'

const tabs = [
  { id: 'personal' as TabType, label: 'اطلاعات شخصی', icon: User },
  { id: 'education' as TabType, label: 'تحصیلات', icon: GraduationCap },
  { id: 'idea' as TabType, label: 'ایده و تیم', icon: Lightbulb },
  { id: 'motivation' as TabType, label: 'انگیزه و اهداف', icon: Target },
  { id: 'system' as TabType, label: 'اطلاعات سیستم', icon: FileText },
]

export function AACOApplicationDetailModal({
  application,
  open,
  onClose,
  onApprove,
  onReject,
  onReview,
  onResubmit,
}: AACOApplicationDetailModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('personal')

  if (!application) return null

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getDegreeLabel = (degree: string) => {
    const labels: Record<string, string> = {
      diploma: 'دیپلم',
      associate: 'کاردانی',
      bachelor: 'کارشناسی',
      master: 'کارشناسی ارشد',
      phd: 'دکتری',
    }
    return labels[degree] || degree
  }

  const getTeamSizeLabel = (size?: string) => {
    const labels: Record<string, string> = {
      '1': 'انفرادی',
      '2-3': '۲ تا ۳ نفر',
      '4-5': '۴ تا ۵ نفر',
      '6+': 'بیش از ۶ نفر',
    }
    return size ? labels[size] || size : '-'
  }

  // همه وضعیت‌ها قابل ویرایش هستند
  const isApproved = application.status === AACOApplicationStatus.APPROVED
  const isRejected = application.status === AACOApplicationStatus.REJECTED
  const canApprove = !isApproved // می‌توان تایید کرد اگر تایید نشده باشد
  const canReject = !isRejected // می‌توان رد کرد اگر رد نشده باشد
  const canReview = application.status === AACOApplicationStatus.SUBMITTED

  const getStatusIcon = () => {
    switch (application.status) {
      case AACOApplicationStatus.APPROVED:
        return <CheckCircle className="h-4 w-4" />
      case AACOApplicationStatus.REJECTED:
        return <XCircle className="h-4 w-4" />
      case AACOApplicationStatus.UNDER_REVIEW:
        return <Clock className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const InfoCard = ({ 
    icon: Icon, 
    label, 
    value, 
    className 
  }: { 
    icon: React.ComponentType<{ className?: string }>
    label: string
    value: string | React.ReactNode
    className?: string
  }) => (
    <div className={cn(
      "flex items-start gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50",
      className
    )}>
      <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20">
        <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{value || '-'}</p>
      </div>
    </div>
  )

  const TextBlock = ({ 
    title, 
    content, 
    icon: Icon 
  }: { 
    title: string
    content?: string
    icon: React.ComponentType<{ className?: string }>
  }) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-blue-500" />
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</h4>
      </div>
      <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-800/30 border border-gray-100 dark:border-gray-700/50">
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
          {content || 'اطلاعاتی ثبت نشده است'}
        </p>
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoCard icon={User} label="نام" value={application.firstName} />
              <InfoCard icon={User} label="نام خانوادگی" value={application.lastName} />
              <InfoCard 
                icon={Mail} 
                label="ایمیل" 
                value={
                  <a href={`mailto:${application.email}`} className="text-blue-500 hover:underline">
                    {application.email}
                  </a>
                } 
              />
              <InfoCard 
                icon={Phone} 
                label="تلفن" 
                value={
                  <a href={`tel:${application.phone}`} className="text-blue-500 hover:underline" dir="ltr">
                    {application.phone}
                  </a>
                } 
              />
              <InfoCard icon={MapPin} label="شهر" value={application.city} className="md:col-span-2" />
            </div>
          </motion.div>
        )

      case 'education':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoCard icon={Building} label="دانشگاه" value={application.university} />
              <InfoCard icon={BookOpen} label="رشته تحصیلی" value={application.major} />
              <InfoCard icon={GraduationCap} label="مقطع تحصیلی" value={getDegreeLabel(application.degree)} />
              <InfoCard icon={Calendar} label="سال فارغ‌التحصیلی" value={application.graduationYear || '-'} />
            </div>

            {/* Skills Section */}
            <div className="space-y-3 pt-4">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">مهارت‌ها</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {application.skills && application.skills.length > 0 ? (
                  application.skills.map((skill, i) => (
                    <Badge 
                      key={i} 
                      variant="secondary"
                      className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 text-blue-700 dark:text-blue-300 border-0"
                    >
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-gray-500">مهارتی ثبت نشده</span>
                )}
              </div>
            </div>
          </motion.div>
        )

      case 'idea':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <TextBlock icon={Lightbulb} title="شرح ایده استارتاپ" content={application.startupIdea} />
            <TextBlock icon={Briefcase} title="مدل کسب‌وکار" content={application.businessModel} />
            <TextBlock icon={Target} title="بازار هدف" content={application.targetMarket} />
            
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-4 w-4 text-purple-500" />
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">اطلاعات تیم</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard icon={Users} label="اندازه تیم" value={getTeamSizeLabel(application.teamSize)} />
              </div>
              {application.teamMembers && (
                <div className="mt-4">
                  <TextBlock icon={Users} title="اعضای تیم" content={application.teamMembers} />
                </div>
              )}
            </div>
          </motion.div>
        )

      case 'motivation':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <TextBlock icon={Sparkles} title="انگیزه" content={application.motivation} />
            <TextBlock icon={Target} title="اهداف" content={application.goals} />
            {application.experience && (
              <TextBlock icon={Briefcase} title="تجربیات" content={application.experience} />
            )}
            {application.expectations && (
              <TextBlock icon={Star} title="انتظارات" content={application.expectations} />
            )}
          </motion.div>
        )

      case 'system':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoCard icon={Calendar} label="تاریخ ارسال" value={formatDate(application.submittedAt)} />
              <InfoCard icon={Calendar} label="تاریخ ایجاد" value={formatDate(application.createdAt)} />
              <InfoCard icon={Calendar} label="آخرین به‌روزرسانی" value={formatDate(application.updatedAt)} />
              {application.reviewedAt && (
                <InfoCard icon={Calendar} label="تاریخ بررسی" value={formatDate(application.reviewedAt)} />
              )}
            </div>

            {application.reviewNotes && (
              <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border border-yellow-200 dark:border-yellow-800/50">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">یادداشت بررسی</h4>
                </div>
                <p className="text-sm text-yellow-700 dark:text-yellow-400 leading-relaxed">
                  {application.reviewNotes}
                </p>
              </div>
            )}
          </motion.div>
        )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-white dark:bg-gray-900 border-0 shadow-2xl">
        {/* Header */}
        <div className="relative overflow-hidden">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700" />
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          </div>

          {/* Content */}
          <div className="relative p-6 text-white">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-bold shadow-lg">
                  {application.firstName?.[0]}{application.lastName?.[0]}
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold mb-1">
                    {application.firstName} {application.lastName}
                  </h2>
                  <p className="text-white/80 text-sm mb-2">{application.email}</p>
                  <Badge className={cn(
                    "flex items-center gap-1.5 px-3 py-1",
                    getStatusColor(application.status)
                  )}>
                    {getStatusIcon()}
                    {getStatusLabel(application.status)}
                  </Badge>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Quick Info */}
            <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-white/20">
              <div className="flex items-center gap-2 text-sm text-white/80">
                <Building className="h-4 w-4" />
                <span>{application.university}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/80">
                <GraduationCap className="h-4 w-4" />
                <span>{getDegreeLabel(application.degree)} - {application.major}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/80">
                <MapPin className="h-4 w-4" />
                <span>{application.city}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-100 dark:border-gray-800 px-6">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-all border-b-2 -mb-px",
                    activeTab === tab.id
                      ? "text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400"
                      : "text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab Content */}
        <ScrollArea className="h-[400px]">
          <div className="p-6">
            <AnimatePresence mode="wait">
              {renderTabContent()}
            </AnimatePresence>
          </div>
        </ScrollArea>

        {/* Footer Actions */}
        {(canApprove || canReject || canReview || isApproved || isRejected) && (
          <div className="border-t border-gray-100 dark:border-gray-800 p-4 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex items-center justify-end gap-3">
              {/* دکمه بازگشت به ارسال شده برای درخواست‌های تایید/رد شده */}
              {(isApproved || isRejected) && onResubmit && (
                <Button
                  variant="outline"
                  onClick={() => onResubmit(application)}
                  className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                >
                  <Sparkles className="h-4 w-4 ml-2" />
                  بازگشت به ارسال شده
                </Button>
              )}

              {canReview && onReview && (
                <Button
                  variant="outline"
                  onClick={() => onReview(application)}
                  className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800 hover:bg-yellow-100 dark:hover:bg-yellow-900/30"
                >
                  <Clock className="h-4 w-4 ml-2" />
                  شروع بررسی
                </Button>
              )}
              
              {canReject && onReject && (
                <Button
                  variant="outline"
                  onClick={() => onReject(application)}
                  className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30"
                >
                  <XCircle className="h-4 w-4 ml-2" />
                  رد درخواست
                </Button>
              )}
              
              {canApprove && onApprove && (
                <Button
                  onClick={() => onApprove(application)}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/25"
                >
                  <CheckCircle className="h-4 w-4 ml-2" />
                  تایید درخواست
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
