import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

export interface AdminStats {
  users: {
    total: number
    active: number
    applicants: number
    clubMembers: number
    admins: number
    growth: number
  }
  applications: {
    total: number
    pending: number
    approved: number
    rejected: number
    approvalRate: number
  }
  teams: {
    total: number
    active: number
    byPhase: Record<string, number>
  }
  events: {
    total: number
    upcoming: number
    completed: number
    avgAttendance: number
  }
  projects: {
    total: number
    active: number
    completed: number
  }
  activity: {
    dailyActiveUsers: number
    weeklyActiveUsers: number
    monthlyActiveUsers: number
  }
}

// Default stats for when data is not available
const defaultStats: AdminStats = {
  users: { total: 0, active: 0, applicants: 0, clubMembers: 0, admins: 0, growth: 0 },
  applications: { total: 0, pending: 0, approved: 0, rejected: 0, approvalRate: 0 },
  teams: { total: 0, active: 0, byPhase: {} },
  events: { total: 0, upcoming: 0, completed: 0, avgAttendance: 0 },
  projects: { total: 0, active: 0, completed: 0 },
  activity: { dailyActiveUsers: 0, weeklyActiveUsers: 0, monthlyActiveUsers: 0 },
}

export function useAdminStats(timeRange: 'today' | 'week' | 'month' | 'year' = 'month') {
  return useQuery({
    queryKey: ['admin-stats', timeRange],
    queryFn: async () => {
      try {
        // Fetch comprehensive stats from backend
        const [statsResponse, teams, events, projects] = await Promise.allSettled([
          api.get(`/users/admin-stats?timeRange=${timeRange}`),
          api.get('/teams'),
          api.get('/events'),
          api.get('/projects'),
        ])

        // Extract data safely
        const statsData = statsResponse.status === 'fulfilled' ? statsResponse.value.data?.data : null
        const teamsData = teams.status === 'fulfilled' ? (teams.value.data?.data || []) : []
        const eventsData = events.status === 'fulfilled' ? (events.value.data?.data || []) : []
        const projectsData = projects.status === 'fulfilled' ? (projects.value.data?.data || []) : []

        // Ensure arrays
        const teamsArray = Array.isArray(teamsData) ? teamsData : []
        const eventsArray = Array.isArray(eventsData) ? eventsData : []
        const projectsArray = Array.isArray(projectsData) ? projectsData : []

        // Combine backend stats with additional data
        const stats: AdminStats = {
          users: {
            total: statsData?.users?.total ?? 0,
            active: statsData?.users?.active ?? 0,
            applicants: statsData?.users?.applicants ?? 0,
            clubMembers: statsData?.users?.clubMembers ?? 0,
            admins: statsData?.users?.admins ?? 0,
            growth: statsData?.users?.growth ?? 0,
          },
          applications: {
            total: statsData?.applications?.total ?? 0,
            pending: statsData?.applications?.pending ?? 0,
            approved: statsData?.applications?.approved ?? 0,
            rejected: statsData?.applications?.rejected ?? 0,
            approvalRate: statsData?.applications?.approvalRate ?? 0,
          },
          teams: {
            total: teamsArray.length,
            active: teamsArray.filter((t: any) => t?.status === 'active').length,
            byPhase: teamsArray.reduce((acc: Record<string, number>, team: any) => {
              const phase = team?.phase || 'unknown'
              acc[phase] = (acc[phase] || 0) + 1
              return acc
            }, {}),
          },
          events: {
            total: eventsArray.length,
            upcoming: eventsArray.filter((e: any) => e?.date && new Date(e.date) > new Date()).length,
            completed: eventsArray.filter((e: any) => e?.date && new Date(e.date) < new Date()).length,
            avgAttendance: eventsArray.length > 0
              ? Math.round(eventsArray.reduce((sum: number, e: any) => sum + (e?.registeredTeams?.length || 0), 0) / eventsArray.length)
              : 0,
          },
          projects: {
            total: projectsArray.length,
            active: projectsArray.filter((p: any) => p?.status === 'active').length,
            completed: projectsArray.filter((p: any) => p?.status === 'completed').length,
          },
          activity: {
            dailyActiveUsers: statsData?.activity?.dailyActiveUsers ?? 0,
            weeklyActiveUsers: statsData?.activity?.weeklyActiveUsers ?? 0,
            monthlyActiveUsers: statsData?.activity?.monthlyActiveUsers ?? 0,
          },
        }

        return stats
      } catch (error) {
        console.error('Error fetching admin stats:', error)
        return defaultStats
      }
    },
    refetchInterval: 60000, // Refetch every minute
    retry: 2,
    staleTime: 30000, // Consider data stale after 30 seconds
  })
}
