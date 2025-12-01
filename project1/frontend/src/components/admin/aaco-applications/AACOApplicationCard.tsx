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
  Clock
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

interface AACOApplicationCardProps {
  application: AACOApplication
  onView: (application: AACOApplication) => void
  onApprove: (application: AACOApplication) => void
  onReject: (application: AACOApplication) => void
  onReview: (application: AACOApplication) => void
  index?: number
}

export function AACOApplicationCard({
  application,
  onView,
  onApprove,
  onReject,
  onReview,
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

  const canApprove = application.status === AACOApplicationStatus.SUBMITTED || 
                     application.status === AACOApplicationStatus.UNDER_REVIEW
  const canReject = application.status === AACOApplicationStatus.SUBMITTED || 
                    application.status === AACOApplicationStatus.UNDER_REVIEW
  const canReview = application.status === AACOApplicationStatus.SUBMITTED

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                {application.firstName?.[0]}{application.lastName?.[0]}
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                  {application.firstName} {application.lastName}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {application.university}
                </p>
              </div>
            </div>
            <Badge className={getStatusColor(application.status)}>
              {getStatusLabel(application.status)}
            </Badge>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Mail className="h-4 w-4" />
              <span className="truncate">{application.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Phone className="h-4 w-4" />
              <span>{application.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <MapPin className="h-4 w-4" />
              <span>{application.city}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <GraduationCap className="h-4 w-4" />
              <span>{getDegreeLabel(application.degree)} - {application.major}</span>
            </div>
          </div>

          {/* Startup Idea Preview */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                ایده استارتاپ
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {application.startupIdea}
            </p>
          </div>

          {/* Skills */}
          {application.skills && application.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {application.skills.slice(0, 5).map((skill, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {application.skills.length > 5 && (
                <Badge variant="outline" className="text-xs">
                  +{application.skills.length - 5} مهارت دیگر
                </Badge>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Calendar className="h-3 w-3" />
              <span>ارسال: {formatDate(application.submittedAt || application.createdAt)}</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onView(application)}
              >
                <Eye className="h-4 w-4 ml-1" />
                مشاهده
              </Button>

              {canReview && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onReview(application)}
                  className="text-yellow-600 border-yellow-300 hover:bg-yellow-50"
                >
                  <Clock className="h-4 w-4 ml-1" />
                  بررسی
                </Button>
              )}

              {canApprove && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onApprove(application)}
                  className="text-green-600 border-green-300 hover:bg-green-50"
                >
                  <CheckCircle className="h-4 w-4 ml-1" />
                  تایید
                </Button>
              )}

              {canReject && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onReject(application)}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  <XCircle className="h-4 w-4 ml-1" />
                  رد
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
