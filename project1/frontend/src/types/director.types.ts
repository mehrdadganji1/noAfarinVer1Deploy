export interface DirectorStats {
  overview: {
    totalUsers: number
    activeToday: number
    growthRate: number
    systemStatus: 'healthy' | 'warning' | 'error'
  }
  users: {
    total: number
    clubMembers: number
    applicants: number
    admins: number
    growth: number
    dailyActive: number
    weeklyActive: number
    monthlyActive: number
  }
  applications: {
    total: number
    pending: number
    approved: number
    rejected: number
    approvalRate: number
    avgProcessingTime: string
  }
  systemHealth: SystemHealthStatus[]
  pendingTasks: PendingTask[]
  recentActivities: Activity[]
}

export interface SystemHealthStatus {
  name: string
  status: 'healthy' | 'warning' | 'error'
  uptime: string
  responseTime: string
  lastCheck: string
}

export interface PendingTask {
  id: string
  title: string
  count: number
  priority: 'high' | 'medium' | 'low'
  path: string
  description?: string
}

export interface Activity {
  id: string
  type: 'user' | 'application' | 'document' | 'approval' | 'rejection' | 'system'
  title: string
  description: string
  user?: string
  timestamp: string
  status: 'success' | 'warning' | 'error' | 'info'
}

export interface DashboardMetric {
  id: string
  label: string
  value: string | number
  change?: number
  changeLabel?: string
  icon: any
  color: string
  bgGradient: string
}

export interface QuickAction {
  id: string
  label: string
  description: string
  icon: any
  path: string
  color: string
  bgGradient: string
}
