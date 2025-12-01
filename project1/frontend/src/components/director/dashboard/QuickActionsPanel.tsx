import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { LucideIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Sparkles } from 'lucide-react'

interface QuickAction {
  id: string
  label: string
  description: string
  icon: LucideIcon
  path: string
  color: string
  bgGradient: string
}

interface QuickActionsPanelProps {
  actions: QuickAction[]
}

export default function QuickActionsPanel({ actions }: QuickActionsPanelProps) {
  const navigate = useNavigate()

  return (
    <Card className="border-0 shadow-xl overflow-hidden dark:bg-gray-800">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          <div className="p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="dark:text-white">دسترسی سریع</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {actions.map((action, index) => (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(action.path)}
              className="group relative overflow-hidden rounded-2xl p-6 text-right transition-all duration-300 hover:shadow-2xl"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${action.bgGradient.replace('bg-gradient-to-br', '')}`} />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />
              
              {/* Animated Glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl -mr-16 -mt-16" />
              </div>

              <div className="relative z-10 flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:translate-x-1 transition-transform">
                    {action.label}
                  </h3>
                  <p className="text-white/90 text-sm leading-relaxed">{action.description}</p>
                </div>
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl group-hover:bg-white/30 transition-colors">
                  <action.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              
              {/* Arrow Icon */}
              <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                <ArrowLeft className="h-5 w-5 text-white" />
              </div>
            </motion.button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
