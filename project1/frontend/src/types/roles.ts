/**
 * User Roles in Noafarin Platform
 */
export enum UserRole {
  APPLICANT = 'applicant',
  CLUB_MEMBER = 'club_member',
  TEAM_LEADER = 'team-leader',
  MENTOR = 'mentor',
  JUDGE = 'judge',
  COORDINATOR = 'coordinator',
  MANAGER = 'manager',
  DIRECTOR = 'DIRECTOR',
  ADMIN = 'ADMIN',
}

/**
 * Role Display Names (Persian)
 */
export const RoleLabels: Record<UserRole, string> = {
  [UserRole.APPLICANT]: 'متقاضی',
  [UserRole.CLUB_MEMBER]: 'عضو باشگاه',
  [UserRole.TEAM_LEADER]: 'سرپرست تیم',
  [UserRole.MENTOR]: 'منتور',
  [UserRole.JUDGE]: 'داور',
  [UserRole.COORDINATOR]: 'هماهنگ‌کننده',
  [UserRole.MANAGER]: 'مدیر',
  [UserRole.DIRECTOR]: 'مدیرکل',
  [UserRole.ADMIN]: 'مدیر سیستم',
}

/**
 * Role Descriptions (Persian)
 */
export const RoleDescriptions: Record<UserRole, string> = {
  [UserRole.APPLICANT]: 'متقاضی - در انتظار تایید عضویت',
  [UserRole.CLUB_MEMBER]: 'عضو باشگاه - دسترسی به رویدادها و دوره‌های آموزشی',
  [UserRole.TEAM_LEADER]: 'سرپرست تیم - ایجاد و مدیریت تیم',
  [UserRole.MENTOR]: 'منتور - ارائه مشاوره و راهنمایی به تیم‌ها',
  [UserRole.JUDGE]: 'داور - داوری و امتیازدهی به تیم‌ها',
  [UserRole.COORDINATOR]: 'هماهنگ‌کننده - مدیریت رویدادها و برنامه‌ها',
  [UserRole.MANAGER]: 'مدیر - تایید تسهیلات و مدیریت کاربران',
  [UserRole.DIRECTOR]: 'مدیرکل - نظارت استراتژیک و تصمیم‌گیری کلان',
  [UserRole.ADMIN]: 'مدیر سیستم - دسترسی کامل به سیستم',
}

/**
 * Role Hierarchy (higher number = more permissions)
 */
export const RoleHierarchy: Record<UserRole, number> = {
  [UserRole.APPLICANT]: 0,
  [UserRole.CLUB_MEMBER]: 1,
  [UserRole.TEAM_LEADER]: 2,
  [UserRole.MENTOR]: 3,
  [UserRole.JUDGE]: 3,
  [UserRole.COORDINATOR]: 4,
  [UserRole.MANAGER]: 5,
  [UserRole.DIRECTOR]: 6,
  [UserRole.ADMIN]: 7,
}

/**
 * Available Permissions
 */
export enum Permission {
  // Events
  VIEW_EVENTS = 'view_events',
  REGISTER_EVENTS = 'register_events',
  MANAGE_EVENTS = 'manage_events',

  // Teams
  JOIN_TEAM = 'join_team',
  CREATE_TEAM = 'create_team',
  MANAGE_TEAM = 'manage_team',
  VIEW_ALL_TEAMS = 'view_all_teams',

  // Trainings
  VIEW_TRAININGS = 'view_trainings',
  MANAGE_TRAININGS = 'manage_trainings',
  TEACH_COURSES = 'teach_courses',

  // Evaluations
  VIEW_OWN_EVALUATIONS = 'view_own_evaluations',
  ACCESS_JUDGING_PANEL = 'access_judging_panel',
  SUBMIT_SCORES = 'submit_scores',

  // Funding
  REQUEST_FUNDING = 'request_funding',
  APPROVE_FUNDING = 'approve_funding',

  // Users
  MANAGE_USERS = 'manage_users',
  ASSIGN_ROLES = 'assign_roles',

  // Applications
  SUBMIT_APPLICATION = 'submit_application',
  VIEW_APPLICATION_STATUS = 'view_application_status',
  REVIEW_APPLICATIONS = 'review_applications',
  APPROVE_APPLICATIONS = 'approve_applications',

  // System
  VIEW_ANALYTICS = 'view_analytics',
  ADVANCED_REPORTS = 'advanced_reports',
  SYSTEM_SETTINGS = 'system_settings',
  SEND_NOTIFICATIONS = 'send_notifications',
}

/**
 * Role to Permissions Mapping
 */
export const RolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.APPLICANT]: [
    Permission.SUBMIT_APPLICATION,
    Permission.VIEW_APPLICATION_STATUS,
  ],

  [UserRole.CLUB_MEMBER]: [
    Permission.VIEW_EVENTS,
    Permission.REGISTER_EVENTS,
    Permission.VIEW_TRAININGS,
    Permission.JOIN_TEAM,
    Permission.VIEW_OWN_EVALUATIONS,
    Permission.REQUEST_FUNDING,
    Permission.VIEW_ALL_TEAMS,
  ],

  [UserRole.TEAM_LEADER]: [
    Permission.VIEW_EVENTS,
    Permission.REGISTER_EVENTS,
    Permission.VIEW_TRAININGS,
    Permission.JOIN_TEAM,
    Permission.CREATE_TEAM,
    Permission.MANAGE_TEAM,
    Permission.VIEW_OWN_EVALUATIONS,
    Permission.REQUEST_FUNDING,
  ],

  [UserRole.MENTOR]: [
    Permission.VIEW_EVENTS,
    Permission.VIEW_TRAININGS,
    Permission.TEACH_COURSES,
    Permission.VIEW_ALL_TEAMS,
  ],

  [UserRole.JUDGE]: [
    Permission.VIEW_EVENTS,
    Permission.VIEW_ALL_TEAMS,
    Permission.ACCESS_JUDGING_PANEL,
    Permission.SUBMIT_SCORES,
  ],

  [UserRole.COORDINATOR]: [
    Permission.VIEW_EVENTS,
    Permission.MANAGE_EVENTS,
    Permission.VIEW_TRAININGS,
    Permission.MANAGE_TRAININGS,
    Permission.VIEW_ALL_TEAMS,
    Permission.VIEW_ANALYTICS,
    Permission.SEND_NOTIFICATIONS,
  ],

  [UserRole.MANAGER]: [
    Permission.VIEW_EVENTS,
    Permission.MANAGE_EVENTS,
    Permission.VIEW_TRAININGS,
    Permission.MANAGE_TRAININGS,
    Permission.VIEW_ALL_TEAMS,
    Permission.MANAGE_USERS,
    Permission.ASSIGN_ROLES,
    Permission.APPROVE_FUNDING,
    Permission.REVIEW_APPLICATIONS,
    Permission.APPROVE_APPLICATIONS,
    Permission.VIEW_ANALYTICS,
    Permission.ADVANCED_REPORTS,
    Permission.SEND_NOTIFICATIONS,
  ],

  [UserRole.DIRECTOR]: [
    // All Admin permissions
    Permission.VIEW_EVENTS,
    Permission.MANAGE_EVENTS,
    Permission.VIEW_TRAININGS,
    Permission.MANAGE_TRAININGS,
    Permission.VIEW_ALL_TEAMS,
    Permission.MANAGE_USERS,
    Permission.ASSIGN_ROLES,
    Permission.APPROVE_FUNDING,
    Permission.REVIEW_APPLICATIONS,
    Permission.APPROVE_APPLICATIONS,
    Permission.VIEW_ANALYTICS,
    Permission.ADVANCED_REPORTS,
    Permission.SEND_NOTIFICATIONS,
    Permission.SYSTEM_SETTINGS,
    // Plus strategic permissions
  ],

  [UserRole.ADMIN]: Object.values(Permission), // All permissions
}

/**
 * Roles available for registration (others are assigned by admin)
 * NOTE: Users start as APPLICANT, then get promoted to CLUB_MEMBER after approval
 */
export const RegisterableRoles: UserRole[] = [
  UserRole.APPLICANT,
  // Admin-assigned roles only:
  // UserRole.CLUB_MEMBER, // Promoted after application approval
  // UserRole.TEAM_LEADER,
  // UserRole.MENTOR,
  // UserRole.JUDGE,
  // UserRole.COORDINATOR,
  // UserRole.MANAGER,
  // UserRole.ADMIN,
]

/**
 * Check if role has permission
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return RolePermissions[role]?.includes(permission) || false
}

/**
 * Check if role has higher or equal hierarchy
 */
export function hasRoleLevel(role: UserRole, requiredRole: UserRole): boolean {
  return RoleHierarchy[role] >= RoleHierarchy[requiredRole]
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: UserRole): Permission[] {
  return RolePermissions[role] || []
}
