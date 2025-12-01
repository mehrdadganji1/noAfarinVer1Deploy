import { motion } from 'framer-motion'
import { Loader2, Sparkles } from 'lucide-react'

interface PageLoaderProps {
  message?: string
  fullScreen?: boolean
}

export function PageLoader({ message = 'در حال بارگذاری...', fullScreen = false }: PageLoaderProps) {
  const containerClass = fullScreen
    ? 'fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm'
    : 'flex items-center justify-center py-20'

  return (
    <div className={containerClass}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center gap-4"
      >
        {/* Animated Loader */}
        <div className="relative">
          {/* Outer Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-20 h-20 rounded-full border-4 border-gray-200 border-t-blue-600"
          />
          
          {/* Inner Ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-2 rounded-full border-4 border-gray-100 border-t-purple-600"
          />
          
          {/* Center Icon */}
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Sparkles className="w-8 h-8 text-blue-600" />
          </motion.div>
        </div>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-gray-600 font-medium"
        >
          {message}
        </motion.p>

        {/* Loading Dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-2 h-2 bg-blue-600 rounded-full"
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export function SpinnerLoader({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  return (
    <Loader2 className={`animate-spin text-blue-600 ${sizeClasses[size]} ${className}`} />
  )
}

export function PulseLoader() {
  return (
    <div className="flex items-center justify-center gap-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
          }}
          className="w-3 h-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
        />
      ))}
    </div>
  )
}

export function ProgressLoader({ progress = 0 }: { progress?: number }) {
  return (
    <div className="w-full max-w-md space-y-3">
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>در حال بارگذاری...</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
          className="h-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
        />
      </div>
    </div>
  )
}

export function GradientLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
          scale: { duration: 1, repeat: Infinity },
        }}
        className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-80"
        style={{
          background: 'conic-gradient(from 0deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6)',
        }}
      />
    </div>
  )
}
