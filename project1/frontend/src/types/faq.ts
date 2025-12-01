import { 
  HelpCircle, 
  FileEdit, 
  FileText, 
  Briefcase, 
  CheckCircle, 
  Wrench 
} from 'lucide-react'

export enum FAQCategory {
  GENERAL = 'general',
  APPLICATION = 'application',
  DOCUMENTS = 'documents',
  INTERVIEW = 'interview',
  APPROVAL = 'approval',
  TECHNICAL = 'technical'
}

export interface FAQ {
  _id: string
  question: string
  answer: string
  category: FAQCategory
  tags?: string[]
  order: number
  views: number
  helpful: number
  notHelpful: number
  createdAt: string
  updatedAt: string
}

export interface SupportTicket {
  _id: string
  userId: string
  subject: string
  message: string
  category: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  priority: 'low' | 'normal' | 'high'
  attachments?: string[]
  responses?: Array<{
    message: string
    createdBy: string
    createdAt: string
  }>
  createdAt: string
  updatedAt: string
}

export const FAQ_CATEGORY_CONFIG = {
  [FAQCategory.GENERAL]: {
    label: 'عمومی',
    icon: HelpCircle,
    description: 'سوالات عمومی'
  },
  [FAQCategory.APPLICATION]: {
    label: 'درخواست',
    icon: FileEdit,
    description: 'درباره فرآیند درخواست'
  },
  [FAQCategory.DOCUMENTS]: {
    label: 'مدارک',
    icon: FileText,
    description: 'مدارک مورد نیاز'
  },
  [FAQCategory.INTERVIEW]: {
    label: 'مصاحبه',
    icon: Briefcase,
    description: 'فرآیند مصاحبه'
  },
  [FAQCategory.APPROVAL]: {
    label: 'تایید',
    icon: CheckCircle,
    description: 'بعد از تایید'
  },
  [FAQCategory.TECHNICAL]: {
    label: 'فنی',
    icon: Wrench,
    description: 'مشکلات فنی'
  }
}
