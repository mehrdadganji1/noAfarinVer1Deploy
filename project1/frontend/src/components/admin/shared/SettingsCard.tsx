import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { LucideIcon, Info } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

export interface SettingsCardProps {
  title: string
  description?: string
  icon?: LucideIcon
  iconColor?: string
  children: ReactNode
  delay?: number
  className?: string
}

export function SettingsCard({
  title,
  description,
  icon: Icon,
  iconColor = 'text-blue-600 dark:text-blue-400',
  children,
  delay = 0,
  className,
}: SettingsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={cn(
        'rounded-xl bg-white dark:bg-gray-800',
        'border border-gray-200 dark:border-gray-700',
        'overflow-hidden',
        className
      )}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
              <Icon className={cn('h-5 w-5', iconColor)} />
            </div>
          )}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
            {description && (
              <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {children}
      </div>
    </motion.div>
  )
}

export interface SettingsToggleProps {
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  tooltip?: string
}

export function SettingsToggle({
  label,
  description,
  checked,
  onChange,
  disabled = false,
  tooltip,
}: SettingsToggleProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex-1 ml-4">
        <div className="flex items-center gap-2">
          <Label className="text-gray-900 dark:text-white font-medium">{label}</Label>
          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
        )}
      </div>
      <Switch checked={checked} onCheckedChange={onChange} disabled={disabled} />
    </div>
  )
}

export interface SettingsInputProps {
  label: string
  description?: string
  value: string | number
  onChange: (value: string) => void
  type?: 'text' | 'email' | 'number' | 'password'
  placeholder?: string
  disabled?: boolean
  tooltip?: string
}

export function SettingsInput({
  label,
  description,
  value,
  onChange,
  type = 'text',
  placeholder,
  disabled = false,
  tooltip,
}: SettingsInputProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label className="text-gray-900 dark:text-white font-medium">{label}</Label>
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      )}
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="max-w-md"
      />
    </div>
  )
}

export interface SettingsSelectProps {
  label: string
  description?: string
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; label: string }>
  disabled?: boolean
}

export function SettingsSelect({
  label,
  description,
  value,
  onChange,
  options,
  disabled = false,
}: SettingsSelectProps) {
  return (
    <div className="space-y-2">
      <Label className="text-gray-900 dark:text-white font-medium">{label}</Label>
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={cn(
          'w-full max-w-md px-3 py-2 rounded-lg',
          'border border-gray-300 dark:border-gray-600',
          'bg-white dark:bg-gray-800',
          'text-gray-900 dark:text-white',
          'focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default SettingsCard
