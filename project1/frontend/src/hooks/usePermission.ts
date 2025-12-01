import { useMemo } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useDevStore } from '@/store/devStore'
import { UserRole, Permission, hasPermission, hasRoleLevel, getRolePermissions } from '@/types/roles'
import { normalizeRoles } from '@/utils/roleUtils'

/**
 * Hook for checking user permissions
 */
export function usePermission() {
  const user = useAuthStore((state) => state.user)
  const overrideRole = useDevStore((state) => state.overrideRole)

  // Get all user roles (could be multiple) - use centralized normalization
  const actualUserRoles = useMemo(() => {
    if (!user?.role) return [UserRole.APPLICANT]
    return normalizeRoles(user.role)
  }, [user])

  // Check if admin is using override (dev mode)
  const isUsingOverride = overrideRole !== null && actualUserRoles.includes(UserRole.ADMIN)
  
  // Use override role if set (and user is admin), otherwise use actual roles
  const userRoles = useMemo(() => {
    if (isUsingOverride) {
      return [overrideRole!]
    }
    return actualUserRoles
  }, [isUsingOverride, overrideRole, actualUserRoles])

  // Primary role (first one or highest priority)
  const userRole = userRoles[0] || UserRole.APPLICANT

  /**
   * Check if user has specific permission (across all roles)
   */
  const can = useMemo(
    () => (permission: Permission): boolean => {
      if (!user) return false
      return userRoles.some(role => hasPermission(role, permission))
    },
    [user, userRoles]
  )

  /**
   * Check if user has any of the permissions
   */
  const canAny = useMemo(
    () => (permissions: Permission[]): boolean => {
      if (!user) return false
      return permissions.some((permission) => 
        userRoles.some(role => hasPermission(role, permission))
      )
    },
    [user, userRoles]
  )

  /**
   * Check if user has all permissions
   */
  const canAll = useMemo(
    () => (permissions: Permission[]): boolean => {
      if (!user) return false
      return permissions.every((permission) => 
        userRoles.some(role => hasPermission(role, permission))
      )
    },
    [user, userRoles]
  )

  /**
   * Check if user has required role level
   */
  const hasRole = useMemo(
    () => (requiredRole: UserRole): boolean => {
      if (!user) return false
      return hasRoleLevel(userRole, requiredRole)
    },
    [user, userRole]
  )

  /**
   * Check if user is specific role
   */
  const isRole = useMemo(
    () => (role: UserRole): boolean => {
      if (!user) return false
      return userRole === role
    },
    [user, userRole]
  )

  /**
   * Get all user permissions (combined from all roles)
   */
  const permissions = useMemo(() => {
    if (!user) return []
    const allPermissions = new Set<Permission>()
    userRoles.forEach(role => {
      getRolePermissions(role).forEach(perm => allPermissions.add(perm))
    })
    return Array.from(allPermissions)
  }, [user, userRoles])

  return {
    can,
    canAny,
    canAll,
    hasRole,
    isRole,
    permissions,
    role: userRole,
    roles: userRoles,
    actualRoles: actualUserRoles, // نقش‌های واقعی (بدون override)
    isAdmin: userRoles.includes(UserRole.ADMIN),
    isActualAdmin: actualUserRoles.includes(UserRole.ADMIN), // آیا کاربر واقعاً Admin هست؟
    isManager: userRoles.some(r => [UserRole.MANAGER, UserRole.ADMIN].includes(r)),
    isCoordinator: userRoles.some(r => [UserRole.COORDINATOR, UserRole.MANAGER, UserRole.ADMIN].includes(r)),
    isJudge: userRoles.includes(UserRole.JUDGE),
    isMentor: userRoles.includes(UserRole.MENTOR),
    isTeamLeader: userRoles.includes(UserRole.TEAM_LEADER),
    isClubMember: userRoles.includes(UserRole.CLUB_MEMBER),
    isApplicant: userRoles.includes(UserRole.APPLICANT),
  }
}

