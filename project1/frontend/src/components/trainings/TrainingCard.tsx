import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { GraduationCap, Clock, Users, Calendar, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

interface Training {
  _id: string
  title: string
  description: string
  instructor: string
  duration: string
  startDate: string
  capacity?: number
  enrolledCount?: number
  status: string
  level: string
}

interface TrainingCardProps {
  training: Training
  delay?: number
}

export default function TrainingCard({ training, delay = 0 }: TrainingCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'ongoing': return 'bg-green-100 text-green-700 border-green-200'
      case 'completed': return 'bg-gray-100 text-gray-700 border-gray-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-700'
      case 'intermediate': return 'bg-yellow-100 text-yellow-700'
      case 'advanced': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'upcoming': return 'آینده'
      case 'ongoing': return 'در حال برگزاری'
      case 'completed': return 'تکمیل شده'
      default: return status
    }
  }

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'beginner': return 'مقدماتی'
      case 'intermediate': return 'متوسط'
      case 'advanced': return 'پیشرفته'
      default: return level
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <Link to={`/admin/trainings/${training._id}`}>
        <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 h-full group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <CardHeader className="relative z-10">
            <div className="flex items-start gap-3">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-gray-900 group-hover:text-green-700 transition-colors line-clamp-1">
                  {training.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">مدرس: {training.instructor}</p>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
            </div>
          </CardHeader>

          <CardContent className="relative z-10">
            <p className="text-sm text-gray-700 line-clamp-2 mb-4">{training.description}</p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{training.duration}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>{new Date(training.startDate).toLocaleDateString('fa-IR')}</span>
              </div>
              {training.capacity && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{training.enrolledCount || 0} / {training.capacity} نفر</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(training.status)}`}>
                {getStatusLabel(training.status)}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getLevelColor(training.level)}`}>
                {getLevelLabel(training.level)}
              </span>
            </div>
          </CardContent>

          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
        </Card>
      </Link>
    </motion.div>
  )
}
