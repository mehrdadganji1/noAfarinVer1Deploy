import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface PageHeaderProps {
  title: string
  description?: string
  icon: LucideIcon
  gradient: string
  actions?: ReactNode
  stats?: Array<{
    label: string
    value: string | number
  }>
}

export function PageHeader({
  title,
  description,
  icon: Icon,
  gradient,
  actions,
  stats,
}: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl p-8 shadow-2xl mb-6"
      style={{ backgroundImage: `linear-gradient(to right, ${gradient})` }}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="p-3 bg-white/20 backdrop-blur-sm rounded-xl"
            >
              <Icon className="h-8 w-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-white">{title}</h1>
              {description && (
                <p className="text-white/90 mt-1">{description}</p>
              )}
            </div>
          </div>
          {actions && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {actions}
            </motion.div>
          )}
        </div>

        {stats && stats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
              >
                <p className="text-white/70 text-sm">{stat.label}</p>
                <p className="text-white text-2xl font-bold mt-1">{stat.value}</p>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
