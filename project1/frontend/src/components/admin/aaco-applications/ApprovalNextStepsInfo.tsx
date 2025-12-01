import { Phone, Users, CheckCircle, ArrowLeft } from 'lucide-react'

interface ApprovalNextStepsInfoProps {
  applicantName: string
}

export function ApprovalNextStepsInfo({ applicantName }: ApprovalNextStepsInfoProps) {
  const steps = [
    {
      icon: Phone,
      title: 'تماس دبیرخانه',
      description: 'هماهنگی زمان مصاحبه',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      icon: Users,
      title: 'مصاحبه',
      description: 'بررسی نهایی و آشنایی',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    },
    {
      icon: CheckCircle,
      title: 'تایید نهایی',
      description: 'عضویت در باشگاه',
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
    },
  ]

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
          <Phone className="h-4 w-4 text-blue-600" />
        </div>
        <h4 className="font-medium text-blue-900 dark:text-blue-200">
          مراحل بعدی پس از تایید
        </h4>
      </div>

      {/* Description */}
      <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
        پس از تایید این درخواست، <strong>دبیرخانه باشگاه نوآفرینان</strong> برای 
        هماهنگی مصاحبه و تایید نهایی عضویت با <strong>{applicantName}</strong> تماس 
        خواهد گرفت.
      </p>

      {/* Steps */}
      <div className="flex items-center justify-between pt-2">
        {steps.map((step, index) => {
          const Icon = step.icon
          return (
            <div key={step.title} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`p-2 ${step.bgColor} rounded-full`}>
                  <Icon className={`h-3.5 w-3.5 ${step.color}`} />
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400 mt-1 text-center max-w-[70px]">
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <ArrowLeft className="h-3 w-3 text-gray-400 mx-2 mt-[-16px]" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
