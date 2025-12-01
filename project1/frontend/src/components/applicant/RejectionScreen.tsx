import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  XCircle, 
  Info, 
  RefreshCw, 
  MessageSquare,
  Lightbulb,
  TrendingUp
} from 'lucide-react'

interface RejectionScreenProps {
  feedback?: string
  rejectionReason?: string
  improvementSuggestions?: string[]
  canReapply?: boolean
  reapplyDate?: string
  onReapply?: () => void
  onContactSupport?: () => void
  onClose?: () => void
}

export default function RejectionScreen({
  feedback,
  rejectionReason,
  improvementSuggestions = [],
  canReapply = true,
  reapplyDate,
  onReapply,
  onContactSupport,
  onClose
}: RejectionScreenProps) {
  return (
    <div className="space-y-6">
      {/* Main Card */}
      <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-red-50">
        <CardContent className="pt-8 pb-8">
          {/* Icon & Title */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center p-4 bg-orange-100 rounded-full mb-4">
              <XCircle className="h-16 w-16 text-orange-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              متاسفانه درخواست شما تایید نشد
            </h2>
            <p className="text-lg text-gray-700">
              اما این پایان کار نیست! شما می‌توانید بهبود یابید و دوباره تلاش کنید.
            </p>
          </div>

          {/* Rejection Reason */}
          {rejectionReason && (
            <Alert className="mb-6 border-orange-300 bg-white">
              <Info className="h-4 w-4" />
              <AlertDescription>
                <p className="font-semibold mb-2">دلیل عدم تایید:</p>
                <p className="text-gray-700">{rejectionReason}</p>
              </AlertDescription>
            </Alert>
          )}

          {/* Feedback */}
          {feedback && (
            <Card className="mb-6 bg-white">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  بازخورد کارشناسان:
                </h3>
                <p className="text-gray-700 whitespace-pre-wrap border-r-4 border-blue-200 pr-4">
                  {feedback}
                </p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Improvement Suggestions */}
      {improvementSuggestions.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Lightbulb className="h-6 w-6 text-yellow-600" />
              پیشنهادات برای بهبود
            </h3>
            <div className="space-y-3">
              {improvementSuggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="shrink-0 mt-1">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-gray-700">{suggestion}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reapply Information */}
      {canReapply && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="pt-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <RefreshCw className="h-6 w-6 text-blue-600" />
              درخواست مجدد
            </h3>
            <p className="text-gray-700 mb-4">
              شما می‌توانید پس از اعمال بهبودها، مجدداً درخواست دهید.
              {reapplyDate && ` از تاریخ ${new Date(reapplyDate).toLocaleDateString('fa-IR')} می‌توانید اقدام کنید.`}
            </p>
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">مراحل درخواست مجدد:</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">1.</span>
                  <span>بازخوردها را به دقت مطالعه کنید</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">2.</span>
                  <span>نقاط ضعف خود را بهبود دهید</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">3.</span>
                  <span>مدارک و اطلاعات خود را کامل‌تر کنید</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">4.</span>
                  <span>فرم درخواست جدید را ارسال کنید</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {canReapply && onReapply && (
              <Button
                size="lg"
                onClick={onReapply}
                className="w-full"
              >
                <RefreshCw className="ml-2 h-5 w-5" />
                درخواست مجدد
              </Button>
            )}
            {onContactSupport && (
              <Button
                size="lg"
                variant="outline"
                onClick={onContactSupport}
                className="w-full"
              >
                <MessageSquare className="ml-2 h-5 w-5" />
                تماس با پشتیبانی
              </Button>
            )}
          </div>
          {onClose && (
            <Button
              variant="ghost"
              onClick={onClose}
              className="w-full mt-3"
            >
              بستن
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Encouragement */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
        <CardContent className="pt-6 text-center">
          <p className="text-lg text-gray-700 italic mb-3">
            "موفقیت نتیجه عدم تسلیم شدن است. هر شکست، فرصتی برای یادگیری و بهبود است."
          </p>
          <p className="text-sm text-gray-600">
            ما منتظر بازگشت شما هستیم! 💪
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
