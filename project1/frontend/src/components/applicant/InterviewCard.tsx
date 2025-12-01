import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Video, 
  User,
  ExternalLink,
  FileText,
  CalendarPlus,
  Download
} from 'lucide-react'
import {
  Interview,
  InterviewStatus,
  INTERVIEW_STATUS_CONFIG,
  INTERVIEW_TYPE_CONFIG,
  formatInterviewDate,
  formatInterviewTime,
  getTimeUntilInterview,
  isUpcoming
} from '@/types/interview'
import { exportInterviewToCalendar } from '@/lib/calendarUtils'
import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface InterviewCardProps {
  interview: Interview
  onViewDetails?: (interview: Interview) => void
  showActions?: boolean
  className?: string
}

export default function InterviewCard({
  interview,
  onViewDetails,
  showActions = true,
  className = ''
}: InterviewCardProps) {
  const statusConfig = INTERVIEW_STATUS_CONFIG[interview.status]
  const typeConfig = INTERVIEW_TYPE_CONFIG[interview.type]
  const upcoming = isUpcoming(interview.interviewDate, interview.interviewTime)

  const handleJoinMeeting = () => {
    if (interview.meetingLink) {
      window.open(interview.meetingLink, '_blank')
    }
  }

  return (
    <Card className={`
      hover:shadow-lg transition-all border-r-4
      ${upcoming ? 'border-r-blue-500' : 'border-r-gray-300'}
      ${className}
    `}>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="text-3xl">{typeConfig.icon}</div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">
                  {typeConfig.label}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  مصاحبه‌کننده: {interview.interviewer?.name || 'تعیین نشده'}
                </p>
              </div>
            </div>
            
            <Badge className={`${statusConfig.bgColor} ${statusConfig.color} border-0`}>
              {statusConfig.icon} {statusConfig.label}
            </Badge>
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {/* Date */}
            <div className="flex items-center gap-2 text-gray-700">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span>{formatInterviewDate(interview.interviewDate)}</span>
            </div>

            {/* Time */}
            <div className="flex items-center gap-2 text-gray-700">
              <Clock className="h-4 w-4 text-blue-600" />
              <span>
                {formatInterviewTime(interview.interviewTime)} ({interview.duration} دقیقه)
              </span>
            </div>

            {/* Location or Meeting Link */}
            {interview.meetingLink ? (
              <div className="flex items-center gap-2 text-gray-700">
                <Video className="h-4 w-4 text-green-600" />
                <span>مصاحبه آنلاین</span>
              </div>
            ) : interview.location ? (
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin className="h-4 w-4 text-red-600" />
                <span>{interview.location}</span>
              </div>
            ) : null}

            {/* Interviewer Title */}
            {interview.interviewer?.title && (
              <div className="flex items-center gap-2 text-gray-700">
                <User className="h-4 w-4 text-purple-600" />
                <span>{interview.interviewer.title}</span>
              </div>
            )}
          </div>

          {/* Countdown Timer (for upcoming interviews) */}
          {upcoming && interview.status === InterviewStatus.SCHEDULED && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-900">
                  زمان باقی‌مانده:
                </span>
                <span className="text-sm font-bold text-blue-700">
                  {getTimeUntilInterview(interview.interviewDate, interview.interviewTime)}
                </span>
              </div>
            </div>
          )}

          {/* Notes */}
          {interview.notes && (
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-medium">یادداشت:</span> {interview.notes}
              </p>
            </div>
          )}

          {/* Feedback (for completed interviews) */}
          {interview.status === InterviewStatus.COMPLETED && interview.feedback && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-900 mb-1">بازخورد:</p>
                  <p className="text-sm text-green-700">{interview.feedback}</p>
                  {interview.score !== undefined && (
                    <div className="mt-2">
                      <span className="text-sm font-semibold text-green-900">
                        امتیاز: {interview.score}/10
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          {showActions && (
            <div className="flex items-center gap-3 pt-2">
              {/* Join Meeting Button (for online interviews) */}
              {interview.meetingLink && 
               upcoming && 
               interview.status === InterviewStatus.SCHEDULED && (
                <Button 
                  onClick={handleJoinMeeting}
                  className="flex-1"
                >
                  <Video className="ml-2 h-4 w-4" />
                  ورود به جلسه
                  <ExternalLink className="mr-2 h-3 w-3" />
                </Button>
              )}

              {/* Export to Calendar Dropdown */}
              {upcoming && interview.status === InterviewStatus.SCHEDULED && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline"
                      size="sm"
                      className="text-purple-600 hover:text-purple-700 hover:border-purple-300"
                    >
                      <CalendarPlus className="ml-2 h-4 w-4" />
                      افزودن به تقویم
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem 
                      onClick={() => exportInterviewToCalendar(interview, 'google')}
                      className="cursor-pointer"
                    >
                      <Calendar className="ml-2 h-4 w-4 text-blue-600" />
                      <span>Google Calendar</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => exportInterviewToCalendar(interview, 'ics')}
                      className="cursor-pointer"
                    >
                      <Download className="ml-2 h-4 w-4 text-green-600" />
                      <span>دانلود فایل ICS</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* View Details Button */}
              {onViewDetails && (
                <Button 
                  variant="outline"
                  onClick={() => onViewDetails(interview)}
                  className={interview.meetingLink && upcoming ? '' : 'flex-1'}
                >
                  <FileText className="ml-2 h-4 w-4" />
                  جزئیات بیشتر
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
