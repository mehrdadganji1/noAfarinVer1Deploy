import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { Interview, InterviewSchedule } from '@/types/interview'

/**
 * Hook to fetch interviews for current user
 */
export function useInterviews(userId?: string) {
  return useQuery<Interview[], Error>({
    queryKey: ['interviews', userId],
    queryFn: async () => {
      if (!userId) return []
      
      try {
        const response = await api.get(`/interviews/applicant/${userId}`)
        return response.data.data || []
      } catch (error: any) {
        console.warn('Failed to fetch interviews:', error)
        if (error.response?.status === 404) {
          return []
        }
        return []
      }
    },
    enabled: !!userId,
    staleTime: 60000, // 1 minute
    refetchInterval: 60000, // Refetch every minute for upcoming interviews
    retry: false,
  })
}

/**
 * Hook to fetch a single interview
 */
export function useInterview(interviewId?: string) {
  return useQuery<Interview, Error>({
    queryKey: ['interview', interviewId],
    queryFn: async () => {
      if (!interviewId) throw new Error('Interview ID is required')
      
      const response = await api.get(`/interviews/${interviewId}`)
      return response.data.data
    },
    enabled: !!interviewId,
    staleTime: 30000, // 30 seconds
  })
}

/**
 * Hook to get upcoming interviews
 */
export function useUpcomingInterviews(userId?: string) {
  const { data: interviews, ...rest } = useInterviews(userId)

  const upcoming = interviews?.filter(interview => {
    const interviewDateTime = new Date(`${interview.interviewDate}T${interview.interviewTime}`)
    return interviewDateTime > new Date() && interview.status === 'scheduled'
  }).sort((a, b) => {
    const dateA = new Date(`${a.interviewDate}T${a.interviewTime}`)
    const dateB = new Date(`${b.interviewDate}T${b.interviewTime}`)
    return dateA.getTime() - dateB.getTime()
  })

  return {
    interviews: upcoming,
    ...rest,
  }
}

/**
 * Hook to get past interviews
 */
export function usePastInterviews(userId?: string) {
  const { data: interviews, ...rest } = useInterviews(userId)

  const past = interviews?.filter(interview => {
    const interviewDateTime = new Date(`${interview.interviewDate}T${interview.interviewTime}`)
    return interviewDateTime <= new Date() || interview.status !== 'scheduled'
  }).sort((a, b) => {
    const dateA = new Date(`${a.interviewDate}T${a.interviewTime}`)
    const dateB = new Date(`${b.interviewDate}T${b.interviewTime}`)
    return dateB.getTime() - dateA.getTime() // Most recent first
  })

  return {
    interviews: past,
    ...rest,
  }
}

/**
 * Hook to get interviews grouped by date
 */
export function useInterviewSchedule(userId?: string) {
  const { data: interviews, ...rest } = useInterviews(userId)

  const schedule: InterviewSchedule[] = []
  
  if (interviews) {
    const grouped = interviews.reduce((acc, interview) => {
      const date = interview.interviewDate
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(interview)
      return acc
    }, {} as Record<string, Interview[]>)

    // Sort dates
    const sortedDates = Object.keys(grouped).sort((a, b) => 
      new Date(a).getTime() - new Date(b).getTime()
    )

    // Create schedule array
    sortedDates.forEach(date => {
      // Sort interviews by time
      const sortedInterviews = grouped[date].sort((a, b) => 
        a.interviewTime.localeCompare(b.interviewTime)
      )
      
      schedule.push({
        date,
        interviews: sortedInterviews
      })
    })
  }

  return {
    schedule,
    interviews,
    ...rest,
  }
}

/**
 * Get next interview (closest upcoming)
 */
export function useNextInterview(userId?: string) {
  const { interviews } = useUpcomingInterviews(userId)
  return interviews?.[0] || null
}
