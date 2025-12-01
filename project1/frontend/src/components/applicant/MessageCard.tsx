import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Mail, 
  MailOpen, 
  Paperclip, 
  Clock,
  User,
  Reply
} from 'lucide-react'
import {
  Message,
  MESSAGE_PRIORITY_CONFIG,
  formatMessageDate,
  truncateText
} from '@/types/message'

interface MessageCardProps {
  message: Message
  onClick?: (message: Message) => void
  onReply?: (message: Message) => void
  compact?: boolean
  showActions?: boolean
  className?: string
}

export default function MessageCard({
  message,
  onClick,
  onReply,
  compact = false,
  showActions = true,
  className = ''
}: MessageCardProps) {
  const priorityConfig = MESSAGE_PRIORITY_CONFIG[message.priority]
  const hasAttachments = message.attachments && message.attachments.length > 0

  return (
    <Card 
      className={`
        hover:shadow-md transition-all cursor-pointer
        ${!message.isRead ? 'border-r-4 border-r-blue-500 bg-blue-50/30' : ''}
        ${className}
      `}
      onClick={() => onClick?.(message)}
    >
      <CardContent className="pt-6">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              {/* Read/Unread Icon */}
              <div className={`mt-1 ${!message.isRead ? 'text-blue-600' : 'text-gray-400'}`}>
                {!message.isRead ? (
                  <Mail className="h-5 w-5" />
                ) : (
                  <MailOpen className="h-5 w-5" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                {/* Sender Info */}
                <div className="flex items-center gap-2 mb-1">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className={`text-sm font-medium ${!message.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                    {message.senderName}
                  </span>
                  {message.senderRole && (
                    <span className="text-xs text-gray-500">({message.senderRole})</span>
                  )}
                </div>

                {/* Subject */}
                <h4 className={`font-semibold text-base mb-1 ${!message.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                  {message.subject}
                </h4>

                {/* Preview */}
                {compact && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {truncateText(message.content, 100)}
                  </p>
                )}
              </div>
            </div>

            {/* Priority Badge & Time */}
            <div className="flex flex-col items-end gap-2">
              {message.priority !== 'normal' && (
                <Badge className={`${priorityConfig.bgColor} ${priorityConfig.color} border-0 text-xs`}>
                  {priorityConfig.icon} {priorityConfig.label}
                </Badge>
              )}
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                {formatMessageDate(message.createdAt)}
              </div>
            </div>
          </div>

          {/* Full Content (non-compact) */}
          {!compact && (
            <div className="pr-8">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {message.content}
              </p>
            </div>
          )}

          {/* Attachments */}
          {hasAttachments && (
            <div className="flex items-center gap-2 text-sm text-gray-600 pr-8">
              <Paperclip className="h-4 w-4" />
              <span>{message.attachments!.length} پیوست</span>
            </div>
          )}

          {/* Actions */}
          {showActions && onReply && (
            <div className="flex items-center gap-2 pr-8 pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation()
                  onReply(message)
                }}
              >
                <Reply className="ml-2 h-4 w-4" />
                پاسخ
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
