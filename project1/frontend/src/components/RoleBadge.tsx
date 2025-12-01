import { Badge } from '@/components/ui/badge'
import { UserRole, RoleLabels } from '@/types/roles'

interface RoleBadgeProps {
  role: UserRole
  className?: string
}

export default function RoleBadge({ role, className = '' }: RoleBadgeProps) {
  const colors: Record<UserRole, string> = {
    [UserRole.ADMIN]: 'bg-red-500 text-white',
    [UserRole.MANAGER]: 'bg-purple-500 text-white',
    [UserRole.COORDINATOR]: 'bg-blue-500 text-white',
    [UserRole.JUDGE]: 'bg-yellow-500 text-white',
    [UserRole.MENTOR]: 'bg-green-500 text-white',
    [UserRole.TEAM_LEADER]: 'bg-indigo-500 text-white',
    [UserRole.CLUB_MEMBER]: 'bg-purple-600 text-white',
    [UserRole.APPLICANT]: 'bg-teal-500 text-white',
  }

  return (
    <Badge className={`${colors[role]} ${className}`}>
      {RoleLabels[role]}
    </Badge>
  )
}
