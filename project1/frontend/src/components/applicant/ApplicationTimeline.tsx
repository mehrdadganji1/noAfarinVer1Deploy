import { CheckCircle2, Circle, Clock } from 'lucide-react'
import { APPLICATION_STATUSES, ApplicationStatus } from './StatusBadge'

export interface TimelineStage {
  id: string
  status: ApplicationStatus
  isCompleted: boolean
  isCurrent: boolean
  completedAt?: string
}

interface ApplicationTimelineProps {
  currentStatus: string
  className?: string
}

const TIMELINE_STAGES = [
  'submitted',
  'pending', 
  'under_review',
  'interview_scheduled',
  'approved'
]

export default function ApplicationTimeline({ currentStatus, className = '' }: ApplicationTimelineProps) {
  const currentIndex = TIMELINE_STAGES.indexOf(currentStatus)
  
  const stages: TimelineStage[] = TIMELINE_STAGES.map((stageKey, index) => {
    const status = APPLICATION_STATUSES[stageKey]
    const isCompleted = index < currentIndex || currentStatus === 'approved'
    const isCurrent = index === currentIndex

    return {
      id: stageKey,
      status,
      isCompleted,
      isCurrent
    }
  })

  // Handle rejected status
  if (currentStatus === 'rejected') {
    return (
      <div className={`p-6 bg-red-50 border border-red-200 rounded-lg ${className}`}>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-100 rounded-full">
            <APPLICATION_STATUSES.rejected.icon className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 className="font-semibold text-red-900">درخواست رد شد</h3>
            <p className="text-sm text-red-700 mt-1">
              {APPLICATION_STATUSES.rejected.description}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute right-[19px] top-5 bottom-5 w-0.5 bg-gray-200" />
        
        {/* Stages */}
        <div className="space-y-6">
          {stages.map((stage, _index) => {
            const Icon = stage.isCompleted ? CheckCircle2 : stage.isCurrent ? Clock : Circle
            
            return (
              <div key={stage.id} className="relative flex items-start gap-4">
                {/* Icon */}
                <div className={`
                  relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2
                  ${stage.isCompleted 
                    ? 'bg-green-100 border-green-600' 
                    : stage.isCurrent 
                    ? `${stage.status.bgColor} border-${stage.status.color.replace('text-', '')}` 
                    : 'bg-white border-gray-300'}
                `}>
                  <Icon className={`
                    h-5 w-5
                    ${stage.isCompleted 
                      ? 'text-green-600' 
                      : stage.isCurrent 
                      ? stage.status.color 
                      : 'text-gray-400'}
                  `} />
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={`font-medium ${
                      stage.isCompleted || stage.isCurrent ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {stage.status.label}
                    </h4>
                    {stage.isCurrent && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${stage.status.bgColor} ${stage.status.color}`}>
                        در حال انجام
                      </span>
                    )}
                    {stage.isCompleted && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                        تکمیل شده
                      </span>
                    )}
                  </div>
                  <p className={`text-sm ${
                    stage.isCompleted || stage.isCurrent ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {stage.status.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
