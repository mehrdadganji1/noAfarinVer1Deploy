import { 
  Video, 
  FileText, 
  Newspaper, 
  ClipboardList, 
  GraduationCap, 
  Star,
  Rocket,
  FileEdit,
  Briefcase,
  Sparkles,
  Scale,
  Wrench,
  BookOpen
} from 'lucide-react'

export enum ResourceType {
  VIDEO = 'video',
  DOCUMENT = 'document',
  ARTICLE = 'article',
  GUIDELINE = 'guideline',
  TUTORIAL = 'tutorial',
  STORY = 'story'
}

export enum ResourceCategory {
  GETTING_STARTED = 'getting_started',
  APPLICATION_GUIDE = 'application_guide',
  INTERVIEW_PREP = 'interview_prep',
  SUCCESS_STORIES = 'success_stories',
  RULES_REGULATIONS = 'rules_regulations',
  TECHNICAL = 'technical',
  GENERAL = 'general'
}

export interface Resource {
  _id: string
  title: string
  description: string
  type: ResourceType
  category: ResourceCategory
  content?: string
  fileUrl?: string
  videoUrl?: string
  thumbnailUrl?: string
  duration?: number // for videos in seconds
  fileSize?: number
  downloadUrl?: string
  author?: string
  tags?: string[]
  views: number
  downloads: number
  featured: boolean
  publishedAt: string
  createdAt: string
  updatedAt: string
}

export const RESOURCE_TYPE_CONFIG = {
  [ResourceType.VIDEO]: {
    label: 'ویدیو',
    icon: Video,
    color: 'text-red-600',
    bgColor: 'bg-red-100'
  },
  [ResourceType.DOCUMENT]: {
    label: 'سند',
    icon: FileText,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  [ResourceType.ARTICLE]: {
    label: 'مقاله',
    icon: Newspaper,
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  [ResourceType.GUIDELINE]: {
    label: 'راهنما',
    icon: ClipboardList,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  },
  [ResourceType.TUTORIAL]: {
    label: 'آموزش',
    icon: GraduationCap,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100'
  },
  [ResourceType.STORY]: {
    label: 'داستان موفقیت',
    icon: Star,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100'
  }
}

export const RESOURCE_CATEGORY_CONFIG = {
  [ResourceCategory.GETTING_STARTED]: {
    label: 'شروع کار',
    icon: Rocket,
    description: 'راهنمای شروع کار در پلتفرم'
  },
  [ResourceCategory.APPLICATION_GUIDE]: {
    label: 'راهنمای درخواست',
    icon: FileEdit,
    description: 'نحوه تکمیل فرم درخواست'
  },
  [ResourceCategory.INTERVIEW_PREP]: {
    label: 'آماده‌سازی مصاحبه',
    icon: Briefcase,
    description: 'نکات مهم برای مصاحبه'
  },
  [ResourceCategory.SUCCESS_STORIES]: {
    label: 'داستان‌های موفقیت',
    icon: Sparkles,
    description: 'تجربیات افراد موفق'
  },
  [ResourceCategory.RULES_REGULATIONS]: {
    label: 'قوانین و مقررات',
    icon: Scale,
    description: 'قوانین و مقررات پلتفرم'
  },
  [ResourceCategory.TECHNICAL]: {
    label: 'فنی',
    icon: Wrench,
    description: 'اطلاعات فنی و تخصصی'
  },
  [ResourceCategory.GENERAL]: {
    label: 'عمومی',
    icon: BookOpen,
    description: 'منابع عمومی'
  }
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

export function formatViews(views: number): string {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M`
  }
  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K`
  }
  return views.toString()
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}
