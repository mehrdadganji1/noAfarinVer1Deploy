export enum InterviewStatus {
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
  RESCHEDULED = 'rescheduled'
}

export enum InterviewType {
  INITIAL = 'initial',
  TECHNICAL = 'technical',
  FINAL = 'final',
  ONLINE = 'online',
  IN_PERSON = 'in_person'
}

export interface Interview {
  _id: string
  applicationId: string
  applicantId: string
  applicantName: string
  interviewDate: string
  interviewTime: string
  duration: number // in minutes
  location?: string
  meetingLink?: string
  type: InterviewType
  status: InterviewStatus
  interviewer?: {
    id: string
    name: string
    title: string
  }
  notes?: string
  feedback?: string
  score?: number
  createdAt: string
  updatedAt: string
}

export interface InterviewSchedule {
  date: string
  interviews: Interview[]
}

export const INTERVIEW_STATUS_CONFIG = {
  [InterviewStatus.SCHEDULED]: {
    label: 'برنامه‌ریزی شده',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    icon: '📅'
  },
  [InterviewStatus.COMPLETED]: {
    label: 'انجام شده',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    icon: '✅'
  },
  [InterviewStatus.CANCELLED]: {
    label: 'لغو شده',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    icon: '❌'
  },
  [InterviewStatus.NO_SHOW]: {
    label: 'حضور نداشت',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    icon: '⚠️'
  },
  [InterviewStatus.RESCHEDULED]: {
    label: 'زمان‌بندی مجدد',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    icon: '🔄'
  }
}

export const INTERVIEW_TYPE_CONFIG = {
  [InterviewType.INITIAL]: {
    label: 'مصاحبه اولیه',
    icon: '👋'
  },
  [InterviewType.TECHNICAL]: {
    label: 'مصاحبه فنی',
    icon: '💻'
  },
  [InterviewType.FINAL]: {
    label: 'مصاحبه نهایی',
    icon: '🎯'
  },
  [InterviewType.ONLINE]: {
    label: 'آنلاین',
    icon: '🌐'
  },
  [InterviewType.IN_PERSON]: {
    label: 'حضوری',
    icon: '🏢'
  }
}

export function formatInterviewDate(date: string): string {
  const d = new Date(date)
  return d.toLocaleDateString('fa-IR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function formatInterviewTime(time: string): string {
  return new Date(`2000-01-01T${time}`).toLocaleTimeString('fa-IR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function getTimeUntilInterview(date: string, time: string): string {
  const interviewDateTime = new Date(`${date}T${time}`)
  const now = new Date()
  const diff = interviewDateTime.getTime() - now.getTime()
  
  if (diff < 0) return 'گذشته'
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  
  if (days > 0) {
    return `${days} روز و ${hours} ساعت دیگر`
  } else if (hours > 0) {
    return `${hours} ساعت دیگر`
  } else {
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${minutes} دقیقه دیگر`
  }
}

export function isUpcoming(date: string, time: string): boolean {
  const interviewDateTime = new Date(`${date}T${time}`)
  const now = new Date()
  return interviewDateTime > now
}

export function isPast(date: string, time: string): boolean {
  return !isUpcoming(date, time)
}

export function isToday(date: string): boolean {
  const interviewDate = new Date(date)
  const today = new Date()
  return (
    interviewDate.getDate() === today.getDate() &&
    interviewDate.getMonth() === today.getMonth() &&
    interviewDate.getFullYear() === today.getFullYear()
  )
}
