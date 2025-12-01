import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { UserRole, RoleLabels } from '@/types/roles'
import { usePermission } from '@/hooks/usePermission'
import { ChevronDown, RefreshCw, Code } from 'lucide-react'

interface RoleSwitcherProps {
  onRoleChange: (role: UserRole) => void
}

export default function RoleSwitcher({ onRoleChange }: RoleSwitcherProps) {
  const { roles, actualRoles, isActualAdmin } = usePermission()
  const [showDropdown, setShowDropdown] = useState(false)
  const [activeRole, setActiveRole] = useState<UserRole>(roles[0] || UserRole.APPLICANT)

  // Sync activeRole با نقش فعلی
  useEffect(() => {
    setActiveRole(roles[0] || UserRole.APPLICANT)
  }, [roles])

  // فقط برای Admin واقعی نمایش داده میشه (حتی اگه نقش override شده باشه)
  if (!isActualAdmin) {
    return null
  }

  const allRoles = Object.values(UserRole)

  const handleRoleChange = (role: UserRole) => {
    setActiveRole(role)
    onRoleChange(role)
    setShowDropdown(false)
  }

  const getRoleBadgeColor = (role: UserRole) => {
    const colors: Record<UserRole, string> = {
      [UserRole.ADMIN]: 'border-red-500 bg-red-50',
      [UserRole.MANAGER]: 'border-purple-500 bg-purple-50',
      [UserRole.COORDINATOR]: 'border-blue-500 bg-blue-50',
      [UserRole.JUDGE]: 'border-yellow-500 bg-yellow-50',
      [UserRole.MENTOR]: 'border-green-500 bg-green-50',
      [UserRole.TEAM_LEADER]: 'border-indigo-500 bg-indigo-50',
      [UserRole.CLUB_MEMBER]: 'border-purple-600 bg-purple-100',
      [UserRole.APPLICANT]: 'border-teal-500 bg-teal-50',
    }
    return colors[role] || 'bg-gray-500 text-white'
  }

  return (
    <div className="relative">
      {/* Dev Mode Badge */}
      <Badge className="bg-orange-500 text-white text-xs mb-2 flex items-center gap-1">
        <Code className="h-3 w-3" />
        حالت توسعه
      </Badge>

      {/* Role Switcher Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 border-2 border-orange-400"
      >
        <RefreshCw className="h-4 w-4" />
        <span className="text-xs">نمایش به عنوان:</span>
        <Badge className={`${getRoleBadgeColor(activeRole)} text-xs`}>
          {RoleLabels[activeRole]}
        </Badge>
        <ChevronDown className="h-4 w-4" />
      </Button>

      {/* Dropdown Menu */}
      {showDropdown && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowDropdown(false)}
          />

          {/* Dropdown */}
          <div className="absolute left-0 mt-2 w-64 bg-white border-2 border-orange-400 rounded-lg shadow-xl z-50" dir="rtl">
            <div className="p-3 border-b bg-orange-50">
              <p className="text-xs font-semibold text-orange-900">انتخاب نقش برای نمایش</p>
              <p className="text-xs text-orange-700 mt-1">
                نقش فعلی شما تغییر نمی‌کند، فقط نمایش تغییر می‌کند
              </p>
            </div>

            <div className="p-2 max-h-96 overflow-y-auto">
              {allRoles.map((role) => {
                const isActive = activeRole === role
                const hasRole = actualRoles.includes(role)

                return (
                  <button
                    key={role}
                    onClick={() => handleRoleChange(role)}
                    className={`w-full p-3 rounded-lg mb-1 text-right transition-all ${
                      isActive
                        ? 'bg-orange-100 border-2 border-orange-400'
                        : 'hover:bg-gray-50 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={`${getRoleBadgeColor(role)} text-xs`}>
                          {RoleLabels[role]}
                        </Badge>
                        {hasRole && (
                          <span className="text-xs text-green-600">(نقش واقعی شما)</span>
                        )}
                      </div>
                      {isActive && (
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="p-3 border-t bg-gray-50">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  handleRoleChange(actualRoles[0] || UserRole.ADMIN)
                }}
                className="w-full text-xs"
              >
                <RefreshCw className="h-3 w-3 ml-1" />
                بازگشت به نقش اصلی
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
