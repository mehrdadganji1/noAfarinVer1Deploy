import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Send, Loader2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { faIR } from 'date-fns/locale'
import { cn } from '@/lib/utils'

interface Message {
  _id: string
  senderId: string
  recipientId: string
  subject: string
  content: string
  isRead: boolean
  createdAt: string
  senderName?: string
}

interface ChatWindowProps {
  messages: Message[]
  currentUserId: string
  onSendMessage: (content: string) => Promise<void>
  isLoading?: boolean
  recipientName?: string
  isTyping?: boolean
  isOnline?: boolean
  onTypingStart?: () => void
  onTypingStop?: () => void
}

export default function ChatWindow({
  messages,
  currentUserId,
  onSendMessage,
  isLoading = false,
  recipientName = 'گیرنده',
  isTyping = false,
  isOnline = false,
  onTypingStart,
  onTypingStop
}: ChatWindowProps) {
  const [messageText, setMessageText] = useState('')
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Handle typing indicators
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageText(e.target.value)
    
    // Notify typing start
    if (e.target.value && onTypingStart) {
      onTypingStart()
    }
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    
    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      if (onTypingStop) {
        onTypingStop()
      }
    }, 1000)
  }

  const handleSend = async () => {
    if (!messageText.trim() || isSending) return

    // Stop typing indicator
    if (onTypingStop) {
      onTypingStop()
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    setIsSending(true)
    try {
      await onSendMessage(messageText)
      setMessageText('')
      textareaRef.current?.focus()
    } catch (error) {
      console.error('Send error:', error)
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-[600px] bg-gray-50 rounded-lg overflow-hidden">
      {/* Chat Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">{recipientName}</h3>
            <div className="flex items-center gap-2 mt-1">
              {isOnline && (
                <span className="flex items-center gap-1 text-sm text-green-600">
                  <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
                  آنلاین
                </span>
              )}
              {!isOnline && (
                <span className="text-sm text-gray-500">آفلاین</span>
              )}
              {isTyping && isOnline && (
                <span className="text-sm text-gray-600 italic">
                  در حال نوشتن...
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">هنوز پیامی وجود ندارد</p>
          </div>
        ) : (
          <>
            {messages.map((message) => {
              const isSent = message.senderId === currentUserId
              const time = formatDistanceToNow(new Date(message.createdAt), {
                addSuffix: true,
                locale: faIR
              })

              return (
                <div
                  key={message._id}
                  className={cn(
                    'flex',
                    isSent ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      'max-w-[70%] rounded-lg px-4 py-2',
                      isSent
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-900 border'
                    )}
                  >
                    {!isSent && message.senderName && (
                      <p className="text-xs font-medium text-gray-600 mb-1">
                        {message.senderName}
                      </p>
                    )}
                    {message.subject && (
                      <p className={cn(
                        'text-sm font-semibold mb-1',
                        isSent ? 'text-blue-100' : 'text-gray-700'
                      )}>
                        {message.subject}
                      </p>
                    )}
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {message.content}
                    </p>
                    <div className={cn(
                      'flex items-center gap-2 mt-1',
                      isSent ? 'justify-end' : 'justify-start'
                    )}>
                      <span className={cn(
                        'text-xs',
                        isSent ? 'text-blue-100' : 'text-gray-500'
                      )}>
                        {time}
                      </span>
                      {isSent && (
                        <span className="text-xs text-blue-100">
                          {message.isRead ? '✓✓' : '✓'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white border-t p-4">
        <div className="flex gap-2">
          <Textarea
            ref={textareaRef}
            value={messageText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="پیام خود را بنویسید... (Enter برای ارسال)"
            className="flex-1 min-h-[60px] max-h-[120px] resize-none"
            disabled={isSending}
          />
          <Button
            onClick={handleSend}
            disabled={!messageText.trim() || isSending}
            className="self-end"
            size="lg"
          >
            {isSending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Shift + Enter برای خط جدید
        </p>
      </div>
    </div>
  )
}
