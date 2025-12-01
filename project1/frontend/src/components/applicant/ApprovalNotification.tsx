import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Sparkles, ArrowLeft } from 'lucide-react'

interface ApprovalNotificationProps {
  onContinue: () => void
  applicantName?: string
  approvedAt?: string
}

export default function ApprovalNotification({ 
  onContinue, 
  applicantName = 'متقاضی عزیز',
  approvedAt 
}: ApprovalNotificationProps) {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-2xl w-full shadow-2xl border-2 border-green-200">
        <CardContent className="pt-12 pb-12 text-center">
          {/* Success Icon */}
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 animate-ping">
              <CheckCircle2 className="h-24 w-24 text-green-400 mx-auto" />
            </div>
            <CheckCircle2 className="h-24 w-24 text-green-600 mx-auto relative" />
          </div>

          {/* Title */}
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-3 flex items-center justify-center gap-3">
              <Sparkles className="h-8 w-8 text-yellow-500" />
              تبریک می‌گوییم!
              <Sparkles className="h-8 w-8 text-yellow-500" />
            </h1>
            <p className="text-xl text-gray-700">
              {applicantName}، درخواست شما تایید شد!
            </p>
          </div>

          {/* Message */}
          <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-6 mb-8">
            <p className="text-lg text-gray-800 leading-relaxed">
              با خوشحالی به شما اطلاع می‌دهیم که درخواست شما مورد تایید کارشناسان ما قرار گرفته است.
              شما اکنون عضو رسمی پلتفرم نوآفرین هستید!
            </p>
          </div>

          {/* Stats/Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-white rounded-lg shadow">
              <div className="text-3xl mb-2">🎯</div>
              <p className="text-sm text-gray-600">مرحله بعد</p>
              <p className="font-semibold text-gray-900">تکمیل پروفایل</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow">
              <div className="text-3xl mb-2">👥</div>
              <p className="text-sm text-gray-600">گام بعدی</p>
              <p className="font-semibold text-gray-900">تشکیل تیم</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow">
              <div className="text-3xl mb-2">🚀</div>
              <p className="text-sm text-gray-600">هدف نهایی</p>
              <p className="font-semibold text-gray-900">ساخت استارتاپ</p>
            </div>
          </div>

          {/* Approval Date */}
          {approvedAt && (
            <p className="text-sm text-gray-500 mb-6">
              تاریخ تایید: {new Date(approvedAt).toLocaleDateString('fa-IR')}
            </p>
          )}

          {/* Action Button */}
          <Button
            size="lg"
            onClick={onContinue}
            className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all"
          >
            شروع سفر من
            <ArrowLeft className="mr-2 h-5 w-5" />
          </Button>

          {/* Confetti Effect */}
          <div className="mt-8 text-4xl animate-bounce">
            🎉 🎊 🎈
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
