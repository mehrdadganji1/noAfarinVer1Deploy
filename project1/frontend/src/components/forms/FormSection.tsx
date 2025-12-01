import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface FormSectionProps {
  title: string
  icon: LucideIcon
  iconColor?: string
  children: ReactNode
  className?: string
  delay?: number
}

export function FormSection({ 
  title, 
  icon: Icon, 
  iconColor = 'from-blue-500 to-purple-500',
  children,
  className = '',
  delay = 0
}: FormSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1 }}
    >
      <Card className={`border-0 shadow-xl bg-white overflow-hidden ${className}`}>
        <CardHeader className="pb-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
          <CardTitle className="flex items-center gap-3">
            <div className={`p-2 rounded-xl bg-gradient-to-br ${iconColor} shadow-lg`}>
              <Icon className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
              {title}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {children}
        </CardContent>
      </Card>
    </motion.div>
  )
}
