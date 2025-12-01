import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

interface ApplicationStats {
  hasApplication: boolean
  applicationStatus: string
  documentsUploaded: number
  documentsRequired: number
  documentsVerified: number
  interviewsScheduled: number
  interviewsCompleted: number
  unreadMessages: number
  profileCompletion: number
}

export const useApplicationStats = (userId?: string) => {
  return useQuery({
    queryKey: ['application-stats', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID required')
      
      try {
        // Fetch application data
        const { data: appData } = await api.get(`/applications/user/${userId}`)
        const application = appData.data
        
        // Initialize default stats
        let documents: any[] = []
        let interviews: any[] = []
        let unreadCount = 0
        
        // Fetch documents only if application exists
        if (application?._id) {
          try {
            const { data: docsData } = await api.get(`/applications/${application._id}/documents`)
            documents = docsData.data || []
          } catch (error: any) {
            // Silently handle - documents may not exist yet
            if (error.response?.status !== 404) {
              console.warn('Failed to fetch documents:', error.message)
            }
          }
        }
        
        // Fetch interviews - silently handle errors
        try {
          const { data: interviewsData } = await api.get(`/interviews?userId=${userId}`)
          interviews = interviewsData.data || []
        } catch (error: any) {
          // Silently handle - interviews may not exist yet
          if (error.response?.status !== 404) {
            console.warn('Failed to fetch interviews:', error.message)
          }
        }
        
        // Fetch messages - silently handle errors
        try {
          const { data: messagesData } = await api.get(`/messages/inbox?userId=${userId}`)
          const messages = messagesData.data || []
          unreadCount = messages.filter((m: any) => !m.isRead).length
        } catch (error: any) {
          // Silently handle - messages may not exist yet
          if (error.response?.status !== 404) {
            console.warn('Failed to fetch messages:', error.message)
          }
        }
        
        // Calculate stats
        const stats: ApplicationStats = {
          hasApplication: !!application,
          applicationStatus: application?.status || 'not_submitted',
          documentsUploaded: documents.length,
          documentsRequired: 8, // Based on DOCUMENT_REQUIREMENTS
          documentsVerified: documents.filter((d: any) => d.status === 'verified').length,
          interviewsScheduled: interviews.filter((i: any) => 
            i.status === 'scheduled' && new Date(i.interviewDate) > new Date()
          ).length,
          interviewsCompleted: interviews.filter((i: any) => i.status === 'completed').length,
          unreadMessages: unreadCount,
          profileCompletion: calculateProfileCompletion(application),
        }
        
        return stats
      } catch (error: any) {
        // If 404, it means no application exists yet - this is normal, not an error
        if (error.response?.status === 404) {
          console.log('ℹ️ No application found yet - user hasn\'t submitted')
          return {
            hasApplication: false,
            applicationStatus: 'not_submitted',
            documentsUploaded: 0,
            documentsRequired: 8,
            documentsVerified: 0,
            interviewsScheduled: 0,
            interviewsCompleted: 0,
            unreadMessages: 0,
            profileCompletion: 0,
          }
        }
        
        // For other errors, log and return defaults
        console.warn('Error fetching application stats:', error.message)
        return {
          hasApplication: false,
          applicationStatus: 'not_submitted',
          documentsUploaded: 0,
          documentsRequired: 8,
          documentsVerified: 0,
          interviewsScheduled: 0,
          interviewsCompleted: 0,
          unreadMessages: 0,
          profileCompletion: 0,
        }
      }
    },
    enabled: !!userId,
    staleTime: 30000, // 30 seconds
    retry: false, // Don't retry on error
  })
}

function calculateProfileCompletion(application: any): number {
  if (!application) return 0
  
  const fields = [
    'firstName', 'lastName', 'email', 'phoneNumber', 'nationalId', 'dateOfBirth',
    'university', 'major', 'degree', 'graduationYear',
    'whyJoin', 'goals', 'technicalSkills', 'interests'
  ]
  
  let completedFields = 0
  fields.forEach(field => {
    const value = application[field]
    if (value && (Array.isArray(value) ? value.length > 0 : true)) {
      completedFields++
    }
  })
  
  return Math.round((completedFields / fields.length) * 100)
}
