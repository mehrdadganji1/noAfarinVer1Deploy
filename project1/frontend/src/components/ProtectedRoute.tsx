import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { UserRole, Permission } from '@/types/roles';
import { usePermission } from '@/hooks/usePermission';
import { normalizeRoles } from '@/utils/roleUtils';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  requiredPermissions?: Permission[];
  requireAll?: boolean; // If true, user must have ALL permissions. If false, ANY permission is enough
}

export function ProtectedRoute({ 
  children, 
  requiredRoles, 
  requiredPermissions,
  requireAll = false 
}: ProtectedRouteProps) {
  const location = useLocation();
  const { isAuthenticated, user, token } = useAuthStore();
  const { canAny, canAll, roles } = usePermission();

  // Normalize user roles for consistent checking
  const normalizedUserRoles = user?.role ? normalizeRoles(user.role) : []
  
  console.log('🛡️ ProtectedRoute check:', {
    path: location.pathname,
    isAuthenticated,
    hasUser: !!user,
    hasToken: !!token,
    tokenPreview: token?.substring(0, 20),
    rawUserRoles: user?.role,
    rawUserRolesType: typeof user?.role,
    rawUserRolesIsArray: Array.isArray(user?.role),
    normalizedUserRoles,
    normalizedUserRolesType: typeof normalizedUserRoles,
    normalizedUserRolesLength: normalizedUserRoles.length,
    requiredRoles,
    requiredRolesType: typeof requiredRoles,
    localStorage_token: localStorage.getItem('token')?.substring(0, 20),
    localStorage_authStorage: !!localStorage.getItem('auth-storage')
  })

  // Check if user is authenticated
  if (!isAuthenticated) {
    console.log('❌ Not authenticated, redirecting to login')
    console.log('   isAuthenticated:', isAuthenticated)
    console.log('   user:', user)
    console.log('   token:', token?.substring(0, 20))
    // Redirect to login with the current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required roles (check all user roles)
  if (requiredRoles && requiredRoles.length > 0) {
    // ADMIN always has access to everything
    const isAdmin = normalizedUserRoles.includes(UserRole.ADMIN);
    
    const hasRequiredRole = isAdmin || requiredRoles.some(requiredRole => 
      normalizedUserRoles.includes(requiredRole)
    );

    console.log('🔍 Role Check Details:', {
      normalizedUserRoles,
      normalizedUserRolesRaw: normalizedUserRoles.map(r => ({ value: r, type: typeof r })),
      requiredRoles,
      requiredRolesRaw: requiredRoles.map(r => ({ value: r, type: typeof r })),
      isAdmin,
      UserRoleADMIN: UserRole.ADMIN,
      UserRoleADMINType: typeof UserRole.ADMIN,
      directCheck: normalizedUserRoles.includes(UserRole.ADMIN),
      stringCheck: normalizedUserRoles.includes('ADMIN' as any),
      hasRequiredRole
    });

    if (!hasRequiredRole) {
      console.log('❌ Access denied - missing required role');
      console.log('   Normalized roles:', JSON.stringify(normalizedUserRoles));
      console.log('   Required roles:', JSON.stringify(requiredRoles));
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Check if user has required permissions
  if (requiredPermissions && requiredPermissions.length > 0) {
    const hasPermission = requireAll 
      ? canAll(requiredPermissions)
      : canAny(requiredPermissions);

    if (!hasPermission) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
}
