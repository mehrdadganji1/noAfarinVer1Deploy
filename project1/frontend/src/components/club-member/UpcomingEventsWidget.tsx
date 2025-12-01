import { Calendar, Clock, MapPin, Users, ExternalLink, CheckCircle2, Circle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import SectionHeader from './SectionHeader'

export interface UpcomingEvent {
  id: string
  title: string
  date: Date
  time: string
  duration: number // in hours
  type: 'workshop' | 'webinar' | 'competition' | 'meetup'
  location?: string
  isOnline: boolean
  registered: boolean
  capacity?: number
  registeredCount?: number
}

export interface UpcomingEventsWidgetProps {
  events: UpcomingEvent[]
  loading?: boolean
  onRegister?: (eventId: string) => void
  onViewAll?: () => void
  maxEvents?: number
}

const eventTypeConfig = {
  workshop: {
    label: 'کارگاه',
    color: 'bg-blue-100 text-blue-700',
    icon: Users,
  },
  webinar: {
    label: 'وبینار',
    color: 'bg-purple-100 text-purple-700',
    icon: Calendar,
  },
  competition: {
    label: 'مسابقه',
    color: 'bg-amber-100 text-amber-700',
    icon: Trophy,
  },
  meetup: {
    label: 'گردهمایی',
    color: 'bg-green-100 text-green-700',
    icon: Users,
  },
} as const

export default function UpcomingEventsWidget({
  events,
  loading = false,
  onRegister,
  onViewAll,
  maxEvents = 3,
}: UpcomingEventsWidgetProps) {
  const navigate = useNavigate()
  const displayEvents = events.slice(0, maxEvents)

  // Calculate time until event
  const getTimeUntil = (date: Date): string => {
    const now = new Date()
    const diff = date.getTime() - now.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 0) return `${days} روز دیگر`
    if (hours > 0) return `${hours} ساعت دیگر`
    return 'به زودی'
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <SectionHeader
            title="رویدادهای پیش رو"
            subtitle="رویدادهای نزدیک شما"
            icon={Calendar}
            iconColor="blue"
            size="sm"
          />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-24 bg-gray-200 rounded-lg" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (events.length === 0) {
    return (
      <Card>
        <CardHeader>
          <SectionHeader
            title="رویدادهای پیش رو"
            subtitle="رویدادهای نزدیک شما"
            icon={Calendar}
            iconColor="blue"
            size="sm"
          />
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">رویداد پیش رویی وجود ندارد</p>
            <Button
              variant="outline"
              onClick={() => navigate('/club-member/events')}
            >
              مشاهده همه رویدادها
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <SectionHeader
          title="رویدادهای پیش رو"
          subtitle="رویدادهای نزدیک شما"
          icon={Calendar}
          iconColor="blue"
          size="sm"
          badge={events.length}
          action={
            onViewAll
              ? {
                  label: 'مشاهده همه',
                  onClick: onViewAll,
                  icon: ExternalLink,
                }
              : undefined
          }
        />
      </CardHeader>
      <CardContent className="space-y-3">
        {displayEvents.map((event, index) => {
          const typeConfig = eventTypeConfig[event.type] || eventTypeConfig.workshop
          const TypeIcon = typeConfig.icon
          const timeUntil = getTimeUntil(event.date)

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div
                className={cn(
                  'p-4 rounded-lg border-2 transition-all duration-300',
                  event.registered
                    ? 'border-green-300 bg-green-50/50'
                    : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                )}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={typeConfig.color} variant="secondary">
                        <TypeIcon className="h-3 w-3 ml-1" />
                        {typeConfig.label}
                      </Badge>
                      {event.registered && (
                        <Badge className="bg-green-100 text-green-700" variant="secondary">
                          <CheckCircle2 className="h-3 w-3 ml-1" />
                          ثبت نام شده
                        </Badge>
                      )}
                    </div>
                    <h4 className="font-bold text-gray-900 text-sm line-clamp-2">
                      {event.title}
                    </h4>
                  </div>
                </div>

                {/* Event Details */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {/* Date */}
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Calendar className="h-3.5 w-3.5 text-blue-500" />
                    <span>{new Date(event.date).toLocaleDateString('fa-IR', { month: 'short', day: 'numeric' })}</span>
                  </div>

                  {/* Time */}
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Clock className="h-3.5 w-3.5 text-purple-500" />
                    <span>{event.time}</span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-xs text-gray-600 col-span-2">
                    <MapPin className="h-3.5 w-3.5 text-green-500" />
                    <span className="truncate">
                      {event.isOnline ? 'آنلاین' : event.location || 'نامشخص'}
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  {/* Countdown */}
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-xs font-medium text-blue-600">
                      {timeUntil}
                    </span>
                  </div>

                  {/* Action */}
                  {!event.registered && onRegister && (
                    <Button
                      size="sm"
                      onClick={() => onRegister(event.id)}
                      className="h-7 text-xs"
                    >
                      ثبت نام
                    </Button>
                  )}

                  {/* Capacity */}
                  {event.capacity && event.registeredCount !== undefined && (
                    <div className="text-xs text-gray-500">
                      <Users className="h-3 w-3 inline ml-1" />
                      {event.registeredCount}/{event.capacity}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}

        {/* View All Button */}
        {events.length > maxEvents && onViewAll && (
          <Button
            variant="outline"
            className="w-full"
            onClick={onViewAll}
          >
            مشاهده {events.length - maxEvents} رویداد دیگر
            <ExternalLink className="h-4 w-4 mr-2" />
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

// Missing Trophy import
import { Trophy } from 'lucide-react'
