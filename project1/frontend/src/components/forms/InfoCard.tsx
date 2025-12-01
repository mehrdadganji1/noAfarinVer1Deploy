import { motion } from 'framer-motion'
import { LucideIcon, AlertCircle, Info, CheckCircle, AlertTriangle, Sparkles } from 'lucide-react'

interface InfoCardProps {
    title?: string
    items: string[]
    variant?: 'info' | 'warning' | 'success' | 'error'
    className?: string
}

const variantConfig = {
    info: {
        bg: 'from-blue-50 to-cyan-50',
        border: 'border-blue-200',
        icon: Info,
        iconBg: 'bg-blue-500',
        textColor: 'text-blue-900',
        emoji: '💡',
    },
    warning: {
        bg: 'from-yellow-50 to-orange-50',
        border: 'border-yellow-200',
        icon: AlertTriangle,
        iconBg: 'bg-yellow-500',
        textColor: 'text-yellow-900',
        emoji: '⚠️',
    },
    success: {
        bg: 'from-green-50 to-emerald-50',
        border: 'border-green-200',
        icon: CheckCircle,
        iconBg: 'bg-green-500',
        textColor: 'text-green-900',
        emoji: '✅',
    },
    error: {
        bg: 'from-red-50 to-pink-50',
        border: 'border-red-200',
        icon: AlertCircle,
        iconBg: 'bg-red-500',
        textColor: 'text-red-900',
        emoji: '❌',
    },
}

export function InfoCard({
    title = 'نکات مهم',
    items,
    variant = 'info',
    className = ''
}: InfoCardProps) {
    const config = variantConfig[variant]
    const Icon = config.icon

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className={`p-4 bg-gradient-to-br ${config.bg} rounded-xl border-2 ${config.border} shadow-sm ${className}`}
        >
            <div className="flex items-start gap-3">
                <div className={`p-2 ${config.iconBg} rounded-lg shadow-md flex-shrink-0`}>
                    <Icon className="h-4 w-4 text-white" />
                </div>
                <div className={`flex-1 text-sm ${config.textColor}`}>
                    {title && (
                        <p className="font-bold mb-2 flex items-center gap-2">
                            <span>{config.emoji}</span>
                            {title}
                        </p>
                    )}
                    <ul className="space-y-1.5">
                        {items.map((item, index) => (
                            <motion.li
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex items-start gap-2"
                            >
                                <span className="text-xs mt-0.5">•</span>
                                <span className="flex-1">{item}</span>
                            </motion.li>
                        ))}
                    </ul>
                </div>
            </div>
        </motion.div>
    )
}
