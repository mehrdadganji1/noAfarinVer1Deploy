import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp, ThumbsUp, ThumbsDown } from 'lucide-react'
import { FAQ } from '@/types/faq'

interface FAQItemProps {
  faq: FAQ
  onHelpful?: (faqId: string, helpful: boolean) => void
  defaultExpanded?: boolean
}

export default function FAQItem({ faq, onHelpful, defaultExpanded = false }: FAQItemProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const [userFeedback, setUserFeedback] = useState<'helpful' | 'not_helpful' | null>(null)

  const handleFeedback = (helpful: boolean) => {
    if (userFeedback) return // Already gave feedback
    
    setUserFeedback(helpful ? 'helpful' : 'not_helpful')
    onHelpful?.(faq._id, helpful)
  }

  return (
    <Card className="hover:shadow-md transition-all">
      <CardContent className="pt-6">
        <div className="space-y-3">
          {/* Question */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-start justify-between gap-3 text-right group"
          >
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {faq.question}
            </h3>
            <div className="shrink-0 mt-1">
              {isExpanded ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </div>
          </button>

          {/* Answer */}
          {isExpanded && (
            <div className="space-y-4 pt-2">
              <div className="text-gray-700 whitespace-pre-wrap border-r-4 border-blue-200 pr-4">
                {faq.answer}
              </div>

              {/* Tags */}
              {faq.tags && faq.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {faq.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Feedback */}
              <div className="flex items-center gap-4 pt-2 border-t">
                <span className="text-sm text-gray-600">آیا این پاسخ مفید بود؟</span>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={userFeedback === 'helpful' ? 'default' : 'outline'}
                    onClick={() => handleFeedback(true)}
                    disabled={userFeedback !== null}
                    className="gap-1"
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span className="text-xs">بله ({faq.helpful})</span>
                  </Button>
                  <Button
                    size="sm"
                    variant={userFeedback === 'not_helpful' ? 'default' : 'outline'}
                    onClick={() => handleFeedback(false)}
                    disabled={userFeedback !== null}
                    className="gap-1"
                  >
                    <ThumbsDown className="h-4 w-4" />
                    <span className="text-xs">خیر ({faq.notHelpful})</span>
                  </Button>
                </div>
                {userFeedback && (
                  <span className="text-xs text-green-600">✓ از بازخورد شما متشکریم</span>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
