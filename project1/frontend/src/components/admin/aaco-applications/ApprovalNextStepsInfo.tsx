import { motion } from 'framer-motion'
import { Phone, Users, CheckCircle, ArrowLeft, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ApprovalNextStepsInfoProps {
  applicantName: string
}

export function ApprovalNextStepsInfo({ applicantName }: ApprovalNextStepsInfoProps) {
  const steps = [
    {
      icon: Phone,
      title: 'تماس دبیرخانه',
      description: 'هماهنگی زمان مصاحبه',
      color: 'blue',
    },
    {
      icon: Users,
      title: 'مصاحبه',
      description: 'بررسی نهایی و آشنایی',
      color: 'purple',
    },
    {
      icon: CheckCircle,
      title: 'تایید نهایی',
      description: 'عضویت در باشگاه',
      color: 'green',
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 border border-blue-100 dark:border-blue-800/50 p-5"
    >
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-purple-200/30 dark:from-blue-500/10 dark:to-purple-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
      
      {/* Header */}
      <div className="relative flex items-center gap-2 mb-4">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <h4 className="font-semibold text-blue-900 dark:text-blue-200">
          مراحل بعدی پس از تایید
        </h4>
      </div>

      {/* Description */}
      <p className="relative text-sm text-blue-800 dark:text-blue-300 leading-relaxed mb-5">
        پس از تایید این درخواست، <strong className="text-blue-900 dark:text-blue-200">دبیرخانه باشگاه نوآفرینان</strong> برای 
        هماهنگی مصاحبه و تایید نهایی عضویت با <strong className="text-blue-900 dark:text-blue-200">{applicantName}</strong> تماس 
        خواهد گرفت.
      </p>

      {/* Steps */}
      <div className="relative flex items-center justify-between bg-white/50 dark:bg-gray-800/30 rounded-xl p-4">
        {steps.map((step, index) => {
          const Icon = step.icon
          return (
            <div key={step.title} className="flex items-center">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                className="flex flex-col items-center"
              >
                <div className={cn(
                  "p-3 rounded-xl shadow-sm",
                  step.color === 'blue' && "bg-blue-100 dark:bg-blue-900/40",
                  step.color === 'purple' && "bg-purple-100 dark:bg-purple-900/40",
                  step.color === 'green' && "bg-green-100 dark:bg-green-900/40",
                )}>
                  <Icon className={cn(
                    "h-5 w-5",
                    step.color === 'blue' && "text-blue-600 dark:text-blue-400",
                    step.color === 'purple' && "text-purple-600 dark:text-purple-400",
                    step.color === 'green' && "text-green-600 dark:text-green-400",
                  )} />
                </div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 mt-2 text-center">
                  {step.title}
                </span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400 text-center max-w-[80px]">
                  {step.description}
                </span>
              </motion.div>
              {index < steps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  <ArrowLeft className="h-4 w-4 text-gray-300 dark:text-gray-600 mx-4" />
                </motion.div>
              )}
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
