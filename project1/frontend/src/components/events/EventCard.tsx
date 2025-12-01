import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Users, Clock, ArrowLeft, Sparkles, TrendingUp, CheckCircle2, XCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

interface Event {
  _id: string
  title: string
  description: string
  date: string
  location: string
  capacity?: number
  registeredCount?: number
  status: string
  type: string
}

interface EventCardProps {
  event: Event
  delay?: number
}

export default function EventCard({ event, delay = 0 }: EventCardProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'upcoming':
        return {
          className: 'bg-blue-100 text-blue-800 border-blue-200',
          label: 'آینده',
          icon: Clock,
          gradient: 'from-blue-500 to-cyan-500'
        }
      case 'ongoing':
        return {
          className: 'bg-green-100 text-green-800 border-green-200',
          label: 'در حال برگزاری',
          icon: TrendingUp,
          gradient: 'from-green-500 to-emerald-500'
        }
      case 'completed':
        return {
          className: 'bg-gray-100 text-gray-800 border-gray-200',
          label: 'برگزار شده',
          icon: CheckCircle2,
          gradient: 'from-gray-500 to-slate-500'
        }
      case 'cancelled':
        return {
          className: 'bg-red-100 text-red-800 border-red-200',
          label: 'لغو شده',
          icon: XCircle,
          gradient: 'from-red-500 to-rose-500'
        }
      default:
        return {
          className: 'bg-gray-100 text-gray-800 border-gray-200',
          label: status,
          icon: Clock,
          gradient: 'from-gray-500 to-slate-500'
        }
    }
  }

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      workshop: 'کارگاه',
      seminar: 'سمینار',
      conference: 'کنفرانس',
      meetup: 'گردهمایی',
      aaco: 'رویداد AACO',
      industrial_visit: 'بازدید صنعتی',
      training: 'دوره آموزشی',
      pitch_session: 'جلسه پیچینگ',
      closing_ceremony: 'مراسم اختتامیه',
    }
    return types[type] || type
  }

  const statusConfig = getStatusConfig(event.status)
  const StatusIcon = statusConfig.icon
  const registrationPercentage = event.capacity 
    ? Math.round(((event.registeredCount || 0) / event.capacity) * 100)
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, type: 'spring' }}
      whileHover={{ y: -8, scale: 1.02 }}
    >
      <Link to={`/admin/events/${event._id}`}>
        <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-500 h-full group overflow-hidden relative">
          {/* Animated Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Top Gradient Bar */}
          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${statusConfig.gradient}`} />
          
          <CardHeader className="relative z-10 pb-3">
            <div className="flex items-start gap-4">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className={`p-3 bg-gradient-to-br ${statusConfig.gradient} rounded-2xl shadow-lg`}
              >
                <Calendar className="h-6 w-6 text-white" />
              </motion.div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all line-clamp-2">
                    {event.title}
                  </h3>
                  <ArrowLeft className="h-5 w-5 text-gray-400 group-hover:text-purple-600 group-hover:-translate-x-2 transition-all flex-shrink-0" />
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {event.description}
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="relative z-10 space-y-4">
            {/* Event Details Grid */}
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg group-hover:bg-white transition-colors">
                <Clock className="h-4 w-4 text-purple-600 flex-shrink-0" />
                <span className="text-sm text-gray-700 font-medium">
                  {new Date(event.date).toLocaleDateString('fa-IR', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg group-hover:bg-white transition-colors">
                <MapPin className="h-4 w-4 text-purple-600 flex-shrink-0" />
                <span className="text-sm text-gray-700 font-medium line-clamp-1">{event.location}</span>
              </div>
              {event.capacity && (
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg group-hover:bg-white transition-colors">
                  <Users className="h-4 w-4 text-purple-600 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-700 font-medium">
                        {event.registeredCount || 0} / {event.capacity} نفر
                      </span>
                      <span className="text-xs text-purple-600 font-semibold">
                        {registrationPercentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${registrationPercentage}%` }}
                        transition={{ duration: 1, delay: delay + 0.3 }}
                        className={`h-full bg-gradient-to-r ${statusConfig.gradient} rounded-full`}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Status & Type Badges */}
            <div className="flex items-center gap-2 flex-wrap pt-2">
              <Badge className={statusConfig.className}>
                <StatusIcon className="h-3 w-3 ml-1" />
                {statusConfig.label}
              </Badge>
              <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                <Sparkles className="h-3 w-3 ml-1" />
                {getTypeLabel(event.type)}
              </Badge>
            </div>
          </CardContent>

          {/* Shine Effect on Hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </div>
        </Card>
      </Link>
    </motion.div>
  )
}
