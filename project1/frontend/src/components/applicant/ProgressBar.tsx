interface ProgressBarProps {
  current: number
  total: number
  label?: string
  showPercentage?: boolean
  color?: 'blue' | 'green' | 'purple' | 'yellow' | 'red'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const colorClasses = {
  blue: 'bg-blue-600',
  green: 'bg-green-600',
  purple: 'bg-purple-600',
  yellow: 'bg-yellow-600',
  red: 'bg-red-600'
}

const sizeClasses = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3'
}

export default function ProgressBar({
  current,
  total,
  label,
  showPercentage = true,
  color = 'blue',
  size = 'md',
  className = ''
}: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0
  const safePercentage = Math.min(100, Math.max(0, percentage))

  return (
    <div className={className}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-xs mb-1">
          {label && <span className="text-gray-600">{label}</span>}
          {showPercentage && (
            <span className="font-medium text-gray-700">
              {safePercentage}%
            </span>
          )}
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${sizeClasses[size]}`}>
        <div 
          className={`${colorClasses[color]} ${sizeClasses[size]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${safePercentage}%` }}
        />
      </div>
    </div>
  )
}
