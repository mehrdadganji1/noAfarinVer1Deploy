import { ReactNode } from 'react'
import { Info, HelpCircle, AlertCircle } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

export interface InfoTooltipProps {
  content: ReactNode
  variant?: 'info' | 'help' | 'warning'
  side?: 'top' | 'right' | 'bottom' | 'left'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const variantConfig = {
  info: {
    icon: Info,
    color: 'text-blue-500 hover:text-blue-600',
  },
  help: {
    icon: HelpCircle,
    color: 'text-gray-400 hover:text-gray-600',
  },
  warning: {
    icon: AlertCircle,
    color: 'text-amber-500 hover:text-amber-600',
  },
}

const sizeClasses = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
}

export function InfoTooltip({
  content,
  variant = 'info',
  side = 'top',
  size = 'md',
  className,
}: InfoTooltipProps) {
  const config = variantConfig[variant]
  const Icon = config.icon

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={cn(
              'inline-flex items-center justify-center transition-colors',
              config.color,
              className
            )}
          >
            <Icon className={sizeClasses[size]} />
          </button>
        </TooltipTrigger>
        <TooltipContent side={side} className="max-w-xs">
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default InfoTooltip
