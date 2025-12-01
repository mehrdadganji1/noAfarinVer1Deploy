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

export function useAdminStats(timeRange: 'today' | 'week' | 'month' | 'year' = 'month') {
  return useQuery({
    queryKey: ['admin-stats', timeRange],
    queryFn: async () => {
      // Fetch comprehensive stats from backend
      const [statsResponse, teams, events, projects] = await Promise.allSettled([
        api.get(`/users/admin-stats?timeRange=${timeRange}`),
        api.get('/teams'),
        api.get('/events'),
        api.get('/projects'),
      ])

      const statsData = statsResponse.status === 'fulfilled' ? statsResponse.value.data.data : null
      const teamsData = teams.status === 'fulfilled' ? teams.value.data.data : []
      const eventsData = events.status === 'fulfilled' ? events.value.data.data : []
      const projectsData = projects.status === 'fulfilled' ? projects.value.data.data : []

      // Combine backend stats with additional data
      const stats: AdminStats = {
        users: {
          total: statsData?.users?.total || 0,
          active: statsData?.users?.active || 0,
          applicants: statsData?.users?.applicants || 0,
          clubMembers: statsData?.users?.clubMembers || 0,
          admins: statsData?.users?.admins || 0,
          growth: statsData?.users?.growth || 0,
        },
        applications: {
          total: statsData?.applications?.total || 0,
          pending: statsData?.applications?.pending || 0,
          approved: statsData?.applications?.approved || 0,
          rejected: statsData?.applications?.rejected || 0,
          approvalRate: statsData?.applications?.approvalRate || 0,
        },
        teams: {
          total: teamsData.length || 0,
          active: teamsData.filter((t: any) => t.status === 'active').length || 0,
          byPhase: teamsData.reduce((acc: any, team: any) => {
            acc[team.phase || 'unknown'] = (acc[team.phase || 'unknown'] || 0) + 1
            return acc
          }, {}),
        },
        events: {
          total: eventsData.length || 0,
          upcoming: eventsData.filter((e: any) => new Date(e.date) > new Date()).length || 0,
          completed: eventsData.filter((e: any) => new Date(e.date) < new Date()).length || 0,
          avgAttendance: eventsData.length > 0
            ? Math.round(eventsData.reduce((sum: number, e: any) => sum + (e.registeredTeams?.length || 0), 0) / eventsData.length)
            : 0,
        },
        projects: {
          total: projectsData.length || 0,
          active: projectsData.filter((p: any) => p.status === 'active').length || 0,
          completed: projectsData.filter((p: any) => p.status === 'completed').length || 0,
        },
        activity: {
          dailyActiveUsers: statsData?.activity?.dailyActiveUsers || 0,
          weeklyActiveUsers: statsData?.activity?.weeklyActiveUsers || 0,
          monthlyActiveUsers: statsData?.activity?.monthlyActiveUsers || 0,
        },
      }

      return stats
    },
    refetchInterval: 60000, // Refetch every minute
  })
}
