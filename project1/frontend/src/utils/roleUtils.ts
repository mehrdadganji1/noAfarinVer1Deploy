/**
 * Role Utilities - Centralized role handling
 * This ensures consistent role checking across the entire application
 */

import { UserRole } from '@/types/roles'

/**
 * Normalize a role string to match our UserRole enum
 * Handles both backend (uppercase) and frontend (mixed case) formats
 */
export function normalizeRole(role: string): UserRole {
  const roleUpper = String(role).toUpperCase()
  
  switch (roleUpper) {
    case 'ADMIN':
      return UserRole.ADMIN
    case 'DIRECTOR':
      return UserRole.DIRECTOR
    case 'MANAGER':
      return UserRole.MANAGER
    case 'COORDINATOR':
      return UserRole.COORDINATOR
    case 'MENTOR':
      return UserRole.MENTOR
    case 'JUDGE':
      return UserRole.JUDGE
    case 'TEAM_LEADER':
    case 'TEAM-LEADER':
      return UserRole.TEAM_LEADER
    case 'CLUB_MEMBER':
      return UserRole.CLUB_MEMBER
    case 'APPLICANT':
    default:
      return UserRole.APPLICANT
  }
}

/**
 * Normalize an array of roles
 */
export function normalizeRoles(roles: string | string[]): UserRole[] {
  if (!roles) return [UserRole.APPLICANT]
  
  const rolesArray = Array.isArray(roles) ? roles : [roles]
  return rolesArray.map(normalizeRole)
}

/**
 * Check if user has a specific role
 */
export function hasRole(userRoles: string | string[], targetRole: UserRole): boolean {
  const normalized = normalizeRoles(userRoles)
  return normalized.includes(targetRole)
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(userRoles: string | string[], targetRoles: UserRole[]): boolean {
  const normalized = normalizeRoles(userRoles)
  return targetRoles.some(role => normalized.includes(role))
}

/**
 * Get the primary (highest priority) role
 */
export function getPrimaryRole(userRoles: string | string[]): UserRole {
  const normalized = normalizeRoles(userRoles)
  
  // Priority order
  const priority = [
    UserRole.ADMIN,
    UserRole.DIRECTOR,
    UserRole.MANAGER,
    UserRole.COORDINATOR,
    UserRole.MENTOR,
    UserRole.JUDGE,
    UserRole.TEAM_LEADER,
    UserRole.CLUB_MEMBER,
    UserRole.APPLICANT,
  ]
  
  for (const role of priority) {
    if (normalized.includes(role)) {
      return role
    }
  }
  
  return UserRole.APPLICANT
}

/**
 * Get the dashboard path for a user based on their roles
 */
export function getDashboardPath(userRoles: string | string[]): string {
  const normalized = normalizeRoles(userRoles)
  
  if (normalized.includes(UserRole.ADMIN)) {
    return '/admin/dashboard'
  }
  if (normalized.includes(UserRole.DIRECTOR)) {
    return '/director/dashboard'
  }
  if (normalized.includes(UserRole.MANAGER) || normalized.includes(UserRole.COORDINATOR)) {
    return '/dashboard'
  }
  if (normalized.includes(UserRole.MENTOR) || normalized.includes(UserRole.JUDGE)) {
    return '/dashboard'
  }
  if (normalized.includes(UserRole.CLUB_MEMBER)) {
    return '/club-member/dashboard'
  }
  if (normalized.includes(UserRole.APPLICANT)) {
    return '/applicant/dashboard'
  }
  
  return '/dashboard'
}

/**
 * Get the dashboard path for a user based on their roles and application status
 * This is an enhanced version that considers application status for applicants
 * 
 * @param userRoles - User's role(s) as string or array of strings
 * @param applicationStatus - Current application status (optional, only relevant for applicants)
 * @returns Dashboard path appropriate for the user's role and status
 * 
 * @example
 * // Applicant with pending application
 * getDashboardPathWithStatus(['applicant'], 'submitted') // '/applicant/pending/dashboard'
 * 
 * @example
 * // Applicant with accepted application
 * getDashboardPathWithStatus(['applicant'], 'accepted') // '/applicant/dashboard'
 * 
 * @example
 * // Club member (status is ignored)
 * getDashboardPathWithStatus(['club_member'], 'accepted') // '/club-member/dashboard'
 */
export function getDashboardPathWithStatus(
  userRoles: string | string[],
  applicationStatus?: string | null
): string {
  const normalized = normalizeRoles(userRoles)
  
  // Priority 1: Check for non-applicant roles first
  // These roles take precedence regardless of application status
  if (normalized.includes(UserRole.ADMIN)) {
    return '/admin/dashboard'
  }
  if (normalized.includes(UserRole.DIRECTOR)) {
    return '/director/dashboard'
  }
  if (normalized.includes(UserRole.MANAGER) || normalized.includes(UserRole.COORDINATOR)) {
    return '/dashboard'
  }
  if (normalized.includes(UserRole.MENTOR) || normalized.includes(UserRole.JUDGE)) {
    return '/dashboard'
  }
  if (normalized.includes(UserRole.CLUB_MEMBER)) {
    return '/club-member/dashboard'
  }
  
  // Priority 2: Handle applicant with application status
  if (normalized.includes(UserRole.APPLICANT)) {
    // No application or not submitted yet - show pending dashboard
    if (!applicationStatus || applicationStatus === 'not_submitted') {
      return '/pending'
    }

    // Pending statuses - show pending dashboard
    // Note: 'approved' means AACO pre-registration approved, NOT final approval
    // User enters interview stage but stays in pending dashboard
    const pendingStatuses = [
      'submitted',
      'under_review',
      'under-review',
      'approved', // AACO تایید پیش ثبت‌نام - کاربر وارد مرحله مصاحبه می‌شود
      'interview_scheduled',
    ]
    if (pendingStatuses.includes(applicationStatus)) {
      return '/pending'
    }

    // Accepted - show full applicant dashboard (final approval)
    // This is when user becomes club_member
    if (applicationStatus === 'accepted') {
      return '/applicant/dashboard'
    }

    // Rejected or withdrawn - show pending dashboard with appropriate messaging
    if (applicationStatus === 'rejected' || applicationStatus === 'withdrawn') {
      return '/pending'
    }

    // Draft status - redirect to form to complete
    if (applicationStatus === 'draft') {
      return '/application-form'
    }

    // Unknown status - fallback to pending dashboard for safety
    return '/pending'
  }
  
  // Default fallback
  return '/dashboard'
}
