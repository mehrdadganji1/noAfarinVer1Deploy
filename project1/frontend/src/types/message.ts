export enum MessageStatus {
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read'
}

export enum MessagePriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent'
}

export interface MessageAttachment {
  id: string
  fileName: string
  fileSize: number
  mimeType: string
  url: string
}

export interface Message {
  _id: string
  conversationId: string
  senderId: string
  senderName: string
  senderRole?: string
  recipientId: string
  recipientName: string
  subject: string
  content: string
  status: MessageStatus
  priority: MessagePriority
  attachments?: MessageAttachment[]
  parentMessageId?: string
  isRead: boolean
  createdAt: string
  updatedAt: string
}

export interface Conversation {
  _id: string
  participantIds: string[]
  participants: Array<{
    id: string
    name: string
    role: string
  }>
  subject: string
  lastMessage?: {
    content: string
    senderId: string
    createdAt: string
  }
  unreadCount: number
  createdAt: string
  updatedAt: string
}

export const MESSAGE_PRIORITY_CONFIG = {
  [MessagePriority.LOW]: {
    label: 'کم',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    icon: '📋'
  },
  [MessagePriority.NORMAL]: {
    label: 'عادی',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    icon: '📝'
  },
  [MessagePriority.HIGH]: {
    label: 'مهم',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    icon: '⚠️'
  },
  [MessagePriority.URGENT]: {
    label: 'فوری',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    icon: '🚨'
  }
}

export function formatMessageDate(date: string): string {
  const messageDate = new Date(date)
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'الان'
  if (diffInMinutes < 60) return `${diffInMinutes} دقیقه پیش`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours} ساعت پیش`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays} روز پیش`
  
  return messageDate.toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}
