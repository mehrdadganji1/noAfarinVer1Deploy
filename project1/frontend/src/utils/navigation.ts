/**
 * Navigation utilities for role-based routing
 */

export const getUserRole = (): string[] => {
  try {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      const currentUser = JSON.parse(userStr)
      const roles = Array.isArray(currentUser.role) ? currentUser.role : [currentUser.role]
      return roles.map((r: string) => r.toUpperCase())
    }
  } catch (error) {
    console.error('Error parsing user from localStorage:', error)
  }
  return []
}

export const isDirector = (): boolean => {
  const roles = getUserRole()
  return roles.includes('DIRECTOR')
}

export const isAdmin = (): boolean => {
  const roles = getUserRole()
  return roles.includes('ADMIN')
}

export const isManager = (): boolean => {
  const roles = getUserRole()
  return roles.includes('MANAGER')
}

/**
 * Get the appropriate base path for the current user's role
 */
export const getRoleBasePath = (): string => {
  const roles = getUserRole()
  
  if (roles.includes('DIRECTOR')) return '/director'
  if (roles.includes('ADMIN')) return '/admin'
  if (roles.includes('MANAGER')) return '/admin'
  if (roles.includes('CLUB_MEMBER')) return '/club-member'
  if (roles.includes('APPLICANT')) return '/applicant'
  
  return '/dashboard'
}

/**
 * Navigate to users list based on current user role
 */
export const getUsersListPath = (): string => {
  const basePath = getRoleBasePath()
  return `${basePath}/users`
}

/**
 * Navigate to user profile based on current user role
 */
export const getUserProfilePath = (userId: string): string => {
  const basePath = getRoleBasePath()
  return `${basePath}/users/${userId}`
}
