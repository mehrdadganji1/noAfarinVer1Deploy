import { cn } from '@/lib/utils'

export interface AvatarProps {
  src?: string
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  status?: 'online' | 'offline' | 'away' | 'busy'
  className?: string
}

const sizeClasses = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-base',
  lg: 'h-12 w-12 text-lg',
  xl: 'h-16 w-16 text-xl',
}

const statusSizeClasses = {
  xs: 'h-1.5 w-1.5',
  sm: 'h-2 w-2',
  md: 'h-2.5 w-2.5',
  lg: 'h-3 w-3',
  xl: 'h-4 w-4',
}

const statusColors = {
  online: 'bg-emerald-500',
  offline: 'bg-gray-400',
  away: 'bg-amber-500',
  busy: 'bg-rose-500',
}

const gradients = [
  'from-blue-500 to-cyan-500',
  'from-purple-500 to-pink-500',
  'from-emerald-500 to-teal-500',
  'from-orange-500 to-amber-500',
  'from-rose-500 to-red-500',
  'from-indigo-500 to-purple-500',
]

function getInitials(name?: string): string {
  if (!name) return '?'
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0][0]?.toUpperCase() || '?'
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function getGradient(name?: string): string {
  if (!name) return gradients[0]
  const index = name.charCodeAt(0) % gradients.length
  return gradients[index]
}

export function Avatar({ src, name, size = 'md', status, className }: AvatarProps) {
  const initials = getInitials(name)
  const gradient = getGradient(name)

  return (
    <div className={cn('relative inline-flex', className)}>
      {src ? (
        <img
          src={src}
          alt={name || 'Avatar'}
          className={cn(
            'rounded-full object-cover',
            sizeClasses[size]
          )}
        />
      ) : (
        <div
          className={cn(
            'rounded-full flex items-center justify-center font-semibold text-white',
            `bg-gradient-to-br ${gradient}`,
            sizeClasses[size]
          )}
        >
          {initials}
        </div>
      )}

      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-2 border-white dark:border-gray-800',
            statusSizeClasses[size],
            statusColors[status]
          )}
        />
      )}
    </div>
  )
}

export interface AvatarGroupProps {
  avatars: Array<{ src?: string; name?: string }>
  max?: number
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
}

export function AvatarGroup({ avatars, max = 4, size = 'md', className }: AvatarGroupProps) {
  const visibleAvatars = avatars.slice(0, max)
  const remainingCount = avatars.length - max

  const overlapClasses = {
    xs: '-mr-1.5',
    sm: '-mr-2',
    md: '-mr-2.5',
    lg: '-mr-3',
  }

  return (
    <div className={cn('flex items-center', className)}>
      {visibleAvatars.map((avatar, index) => (
        <div
          key={index}
          className={cn(
            'relative ring-2 ring-white dark:ring-gray-800 rounded-full',
            index > 0 && overlapClasses[size]
          )}
          style={{ zIndex: visibleAvatars.length - index }}
        >
          <Avatar src={avatar.src} name={avatar.name} size={size} />
        </div>
      ))}

      {remainingCount > 0 && (
        <div
          className={cn(
            'relative ring-2 ring-white dark:ring-gray-800 rounded-full',
            overlapClasses[size]
          )}
        >
          <div
            className={cn(
              'rounded-full flex items-center justify-center font-semibold',
              'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
              sizeClasses[size]
            )}
          >
            +{remainingCount}
          </div>
        </div>
      )}
    </div>
  )
}

export default Avatar
