import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2,
  User,
  Users,
  Lightbulb,
  Rocket,
  BookOpen,
  Video
} from 'lucide-react'

interface WelcomeStep {
  id: number
  title: string
  description: string
  icon: React.ReactNode
  tips: string[]
}

const WELCOME_STEPS: WelcomeStep[] = [
  {
    id: 1,
    title: 'خوش آمدید! 👋',
    description: 'به پلتفرم نوآفرین خوش آمدید. ما اینجا هستیم تا شما را در مسیر ساخت استارتاپ موفق یاری کنیم.',
    icon: <Rocket className="h-12 w-12 text-blue-600" />,
    tips: [
      'نوآفرین یک اکوسیستم کامل برای استارتاپ‌هاست',
      'شما در اینجا به منابع، آموزش و منتورینگ دسترسی دارید',
      'می‌توانید با افراد هم‌فکر ارتباط برقرار کنید'
    ]
  },
  {
    id: 2,
    title: 'تکمیل پروفایل',
    description: 'اولین قدم، تکمیل پروفایل شماست. اطلاعات کامل به شما کمک می‌کند تا بهترین فرصت‌ها را دریافت کنید.',
    icon: <User className="h-12 w-12 text-green-600" />,
    tips: [
      'پروفایل خود را با جزئیات کامل کنید',
      'مهارت‌ها و علایق خود را مشخص کنید',
      'رزومه و نمونه کارهای خود را اضافه کنید'
    ]
  },
  {
    id: 3,
    title: 'تشکیل تیم',
    description: 'یک تیم قوی، کلید موفقیت استارتاپ شماست. همکاران مناسب را پیدا کنید.',
    icon: <Users className="h-12 w-12 text-purple-600" />,
    tips: [
      'با اعضای دیگر آشنا شوید',
      'تیم متنوع با مهارت‌های مکمل بسازید',
      'نقش‌های تیم را مشخص کنید'
    ]
  },
  {
    id: 4,
    title: 'توسعه ایده',
    description: 'ایده خود را تبدیل به یک طرح عملیاتی کنید.',
    icon: <Lightbulb className="h-12 w-12 text-yellow-600" />,
    tips: [
      'ایده خود را به طور کامل توضیح دهید',
      'بازار هدف را شناسایی کنید',
      'مدل کسب‌وکار را طراحی کنید'
    ]
  },
  {
    id: 5,
    title: 'منابع آموزشی',
    description: 'از منابع آموزشی و کارگاه‌های ما استفاده کنید.',
    icon: <BookOpen className="h-12 w-12 text-orange-600" />,
    tips: [
      'دوره‌های آموزشی را ببینید',
      'در کارگاه‌ها شرکت کنید',
      'از منتورها کمک بگیرید'
    ]
  },
  {
    id: 6,
    title: 'شروع سفر! 🚀',
    description: 'حالا آماده‌اید! زمان آن رسیده که سفر خود را آغاز کنید.',
    icon: <Video className="h-12 w-12 text-red-600" />,
    tips: [
      'با اعتماد به نفس شروع کنید',
      'از شکست نترسید، از آن یاد بگیرید',
      'همیشه در حال یادگیری باشید'
    ]
  }
]

interface WelcomeScreenProps {
  onComplete: () => void
  onSkip?: () => void
}

export default function WelcomeScreen({ onComplete, onSkip }: WelcomeScreenProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const step = WELCOME_STEPS[currentStep]
  const progress = ((currentStep + 1) / WELCOME_STEPS.length) * 100

  const handleNext = () => {
    if (currentStep < WELCOME_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="max-w-3xl w-full shadow-2xl">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-2xl">راهنمای شروع</CardTitle>
            {onSkip && currentStep < WELCOME_STEPS.length - 1 && (
              <Button variant="ghost" size="sm" onClick={onSkip}>
                رد کردن
              </Button>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>مرحله {currentStep + 1} از {WELCOME_STEPS.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="p-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full">
              {step.icon}
            </div>
          </div>

          {/* Title & Description */}
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold text-gray-900">{step.title}</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {step.description}
            </p>
          </div>

          {/* Tips */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                نکات مهم:
              </h3>
              <ul className="space-y-2">
                {step.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between gap-4 pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex-1"
            >
              <ArrowRight className="ml-2 h-4 w-4" />
              قبلی
            </Button>

            <Button
              onClick={handleNext}
              className="flex-1"
            >
              {currentStep === WELCOME_STEPS.length - 1 ? 'شروع کنیم!' : 'بعدی'}
              <ArrowLeft className="mr-2 h-4 w-4" />
            </Button>
          </div>

          {/* Step Indicators */}
          <div className="flex justify-center gap-2">
            {WELCOME_STEPS.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'w-8 bg-blue-600'
                    : index < currentStep
                    ? 'w-2 bg-green-600'
                    : 'w-2 bg-gray-300'
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
