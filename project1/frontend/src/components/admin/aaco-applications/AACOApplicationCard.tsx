import { motion } from 'framer-motion'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap,
  Lightbulb,
  Calendar,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Building,
  ChevronLeft,
  Sparkles
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  AACOApplication, 
  AACOApplicationStatus,
  getStatusLabel,
  getStatusColor 
} from '@/hooks/useAACOAdminApplications'
import { cn } from '@/lib/utils'

interface AACOApplicationCardProps {
  application: AACOApplication
  onView: (application: AACOApplication) => void
  onApprove: (application: AACOApplication) => void
  onReject: (application: AACOApplication) => void
  onReview: (application: AACOApplication) => void
  onResubmit?: (application: AACOApplication) => void
  index?: number
}

export function AACOApplicationCard({
  application,
  onView,
  onApprove,
  onReject,
  onReview,
  onResubmit,
  index = 0,
}: AACOApplicationCardProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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

  // همه وضعیت‌ها قابل ویرایش هستند
  const isApproved = application.status === AACOApplicationStatus.APPROVED
  const isRejected = application.status === AACOApplicationStatus.REJECTED
  const canApprove = !isApproved // می‌توان تایید کرد اگر تایید نشده باشد
  const canReject = !isRejected // می‌توان رد کرد اگر رد نشده باشد
  const canReview = application.status === AACOApplicationStatus.SUBMITTED

  const getStatusIcon = () => {
    switch (application.status) {
      case AACOApplicationStatus.APPROVED:
        return <CheckCircle className="h-3.5 w-3.5" />
      case AACOApplicationStatus.REJECTED:
        return <XCircle className="h-3.5 w-3.5" />
      case AACOApplicationStatus.UNDER_REVIEW:
        return <Clock className="h-3.5 w-3.5" />
      default:
        return <Sparkles className="h-3.5 w-3.5" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Card className="group hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
        {/* Status Bar */}
        <div className={cn(
          "h-1 w-full",
          application.status === AACOApplicationStatus.APPROVED && "bg-gradient-to-r from-green-500 to-emerald-500",
          application.status === AACOApplicationStatus.REJECTED && "bg-gradient-to-r from-red-500 to-rose-500",
          application.status === AACOApplicationStatus.UNDER_REVIEW && "bg-gradient-to-r from-yellow-500 to-orange-500",
          application.status === AACOApplicationStatus.SUBMITTED && "bg-gradient-to-r from-blue-500 to-purple-500",
          application.status === AACOApplicationStatus.DRAFT && "bg-gradient-to-r from-gray-400 to-gray-500",
        )} />

        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-purple-500/20">
                  {application.firstName?.[0]}{application.lastName?.[0]}
                </div>
                <div className={cn(
                  "absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center",
                  application.status === AACOApplicationStatus.APPROVED && "bg-green-500",
                  application.status === AACOApplicationStatus.REJECTED && "bg-red-500",
                  application.status === AACOApplicationStatus.UNDER_REVIEW && "bg-yellow-500",
                  application.status === AACOApplicationStatus.SUBMITTED && "bg-blue-500",
                  application.status === AACOApplicationStatus.DRAFT && "bg-gray-400",
                )}>
                  {getStatusIcon()}
                </div>
              </div>
              
              <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                  {application.firstName} {application.lastName}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Building className="h-3.5 w-3.5" />
                  <span>{application.university}</span>
                </div>
              </div>
            </div>

            <Badge className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 font-medium",
              getStatusColor(application.status)
            )}>
              {getStatusIcon()}
              {getStatusLabel(application.status)}
            </Badge>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Mail className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400 truncate">{application.email}</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <div className="p-1.5 rounded-lg bg-green-100 dark:bg-green-900/30">
                <Phone className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400" dir="ltr">{application.phone}</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <MapPin className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">{application.city}</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <div className="p-1.5 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                <GraduationCap className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" />
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {getDegreeLabel(application.degree)}
              </span>
            </div>
          </div>

          {/* Startup Idea Preview */}
          <div className="relative p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border border-amber-100 dark:border-amber-800/30 mb-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/40">
                <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
              <span className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                ایده استارتاپ
              </span>
            </div>
            <p className="text-sm text-amber-700 dark:text-amber-400/80 line-clamp-2 leading-relaxed">
              {application.startupIdea}
            </p>
          </div>

          {/* Skills */}
          {application.skills && application.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {application.skills.slice(0, 5).map((skill, i) => (
                <Badge 
                  key={i} 
                  variant="secondary" 
                  className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-700 dark:text-blue-300 border-0 px-3 py-1"
                >
                  {skill}
                </Badge>
              ))}
              {application.skills.length > 5 && (
                <Badge 
                  variant="outline" 
                  className="text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700"
                >
                  +{application.skills.length - 5} مهارت دیگر
                </Badge>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-5 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <Calendar className="h-3.5 w-3.5" />
              <span>ارسال: {formatDate(application.submittedAt || application.createdAt)}</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onView(application)}
                className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700"
              >
                <Eye className="h-4 w-4 ml-1.5" />
                مشاهده
                <ChevronLeft className="h-3.5 w-3.5 mr-1 opacity-50" />
              </Button>

              {canReview && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onReview(application)}
                  className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800/50 hover:bg-yellow-100 dark:hover:bg-yellow-900/30"
                >
                  <Clock className="h-4 w-4 ml-1.5" />
                  بررسی
                </Button>
              )}

              {canApprove && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onApprove(application)}
                  className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/50 hover:bg-green-100 dark:hover:bg-green-900/30"
                >
                  <CheckCircle className="h-4 w-4 ml-1.5" />
                  تایید
                </Button>
              )}

              {canReject && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onReject(application)}
                  className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50 hover:bg-red-100 dark:hover:bg-red-900/30"
                >
                  <XCircle className="h-4 w-4 ml-1.5" />
                  رد
                </Button>
              )}

              {/* دکمه بازگشت به ارسال شده برای درخواست‌های تایید/رد شده */}
              {(isApproved || isRejected) && onResubmit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onResubmit(application)}
                  className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/50 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                >
                  <Sparkles className="h-4 w-4 ml-1.5" />
                  بازگشت
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
