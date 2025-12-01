import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Mail, 
  Phone, 
  GraduationCap, 
  Calendar,
  Eye,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react'
import { Application } from '@/pages/director/Applications'
import { format } from 'date-fns'
import { faIR } from 'date-fns/locale'

interface ApplicationCardProps {
  application: Application
  onSelect: (application: Application) => void
  index: number
}

export default function ApplicationCard({ application, onSelect, index }: ApplicationCardProps) {
  const navigate = useNavigate()
  
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'approved':
        return {
          label: 'تایید شده',
          icon: CheckCircle,
          color: 'bg-green-100 text-green-700 border-green-200',
          dotColor: 'bg-green-500',
        }
      case 'rejected':
        return {
          label: 'رد شده',
          icon: XCircle,
          color: 'bg-red-100 text-red-700 border-red-200',
          dotColor: 'bg-red-500',
        }
      default:
        return {
          label: 'در انتظار',
          icon: Clock,
          color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
          dotColor: 'bg-yellow-500',
        }
    }
  }

  const statusConfig = getStatusConfig(application.status)
  const StatusIcon = statusConfig.icon

  // Handle both direct properties and nested userId properties
  const firstName = application.firstName || application.userId?.firstName || 'N/A'
  const lastName = application.lastName || application.userId?.lastName || 'N/A'
  const email = application.email || application.userId?.email || 'N/A'

  // Format date safely
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'تاریخ نامشخص'
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'تاریخ نامعتبر'
      return format(date, 'dd MMMM yyyy', { locale: faIR })
    } catch {
      return 'تاریخ نامعتبر'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.03 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="border-2 border-gray-200 hover:shadow-xl transition-all duration-200 hover:border-blue-400 cursor-pointer bg-white" onClick={() => navigate(`/director/applications/${application._id}`)}>
        <CardContent className="p-4">
          {/* Header with Avatar and Status */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow">
                {firstName[0]}{lastName[0]}
              </div>
              <div>
                <h3 className="font-bold text-base text-gray-900">
                  {firstName} {lastName}
                </h3>
                <p className="text-xs text-gray-500">{application.studentId}</p>
              </div>
            </div>
            
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full border ${statusConfig.color}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotColor} animate-pulse`} />
              <StatusIcon className="h-3 w-3" />
              <span className="text-xs font-bold">{statusConfig.label}</span>
            </div>
          </div>

          {/* Info Grid */}
          <div className="space-y-2 mb-3">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Mail className="h-3 w-3 text-blue-500 flex-shrink-0" />
              <span className="truncate">{email}</span>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Phone className="h-3 w-3 text-green-500 flex-shrink-0" />
              <span>{application.phoneNumber}</span>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <GraduationCap className="h-3 w-3 text-purple-500 flex-shrink-0" />
              <span className="truncate">{application.university} - {application.major}</span>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Calendar className="h-3 w-3 text-orange-500 flex-shrink-0" />
              <span>{formatDate(application.submittedAt)}</span>
            </div>
          </div>

          {/* Degree Badge */}
          <div className="flex items-center justify-between">
            <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-200">
              {application.degree}
            </span>
            <Eye className="h-4 w-4 text-gray-400" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
