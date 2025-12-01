import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { getDashboardPath } from '@/utils/roleUtils'

/**
 * Role-based redirect component
 * Redirects users to their appropriate dashboard based on role
 */
export default function RoleBasedRedirect() {
  const user = useAuthStore((state) => state.user)

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Use centralized role utility for consistent navigation
  const dashboardPath = getDashboardPath(user.role)
  
  console.log('🔀 RoleBasedRedirect:', {
    userRoles: user.role,
    redirectTo: dashboardPath
  })

  return <Navigate to={dashboardPath} replace />
}
