import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Send, X, Loader2, AlertCircle } from 'lucide-react'
import { MessagePriority, MESSAGE_PRIORITY_CONFIG } from '@/types/message'

interface MessageFormData {
  recipientId?: string
  subject: string
  content: string
  priority: MessagePriority
}

interface MessageComposerProps {
  onSubmit: (data: MessageFormData) => Promise<void>
  onCancel?: () => void
  recipientId?: string
  recipientName?: string
  replyToSubject?: string
  defaultPriority?: MessagePriority
  className?: string
}

export default function MessageComposer({
  onSubmit,
  onCancel,
  recipientId,
  recipientName,
  replyToSubject,
  defaultPriority = MessagePriority.NORMAL,
  className = ''
}: MessageComposerProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedPriority, setSelectedPriority] = useState<MessagePriority>(defaultPriority)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset
  } = useForm<MessageFormData>({
    defaultValues: {
      recipientId: recipientId || '',
      subject: replyToSubject ? `Re: ${replyToSubject}` : '',
      content: '',
      priority: defaultPriority
    }
  })

  const onFormSubmit = async (data: MessageFormData) => {
    try {
      setIsSubmitting(true)
      await onSubmit({
        ...data,
        priority: selectedPriority,
        recipientId
      })
      reset()
      setSelectedPriority(MessagePriority.NORMAL)
    } catch (error) {
      console.error('Send message error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>پیام جدید</span>
          {onCancel && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onCancel}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          {/* Recipient (if not fixed) */}
          {recipientName && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <span className="font-medium">گیرنده:</span> {recipientName}
              </p>
            </div>
          )}

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject">موضوع *</Label>
            <Input
              id="subject"
              {...register('subject', {
                required: 'موضوع الزامی است',
                minLength: { value: 3, message: 'موضوع باید حداقل 3 کاراکتر باشد' }
              })}
              placeholder="موضوع پیام را وارد کنید"
              className={errors.subject ? 'border-red-500' : ''}
              disabled={isSubmitting}
            />
            {errors.subject && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.subject.message}
              </p>
            )}
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="priority">اولویت</Label>
            <Select
              value={selectedPriority}
              onValueChange={(value) => {
                setSelectedPriority(value as MessagePriority)
                setValue('priority', value as MessagePriority)
              }}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(MESSAGE_PRIORITY_CONFIG).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.icon} {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">متن پیام *</Label>
            <Textarea
              id="content"
              {...register('content', {
                required: 'متن پیام الزامی است',
                minLength: { value: 10, message: 'متن پیام باید حداقل 10 کاراکتر باشد' }
              })}
              placeholder="متن پیام خود را بنویسید..."
              rows={6}
              className={errors.content ? 'border-red-500' : ''}
              disabled={isSubmitting}
            />
            {errors.content && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.content.message}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  در حال ارسال...
                </>
              ) : (
                <>
                  <Send className="ml-2 h-4 w-4" />
                  ارسال پیام
                </>
              )}
            </Button>

            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                انصراف
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
