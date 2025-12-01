import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'

export interface Application {
  _id: string
  userId: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  nationalId: string
  dateOfBirth: string
  university: string
  major: string
  degree: string
  studentId?: string
  graduationYear: number
  hasStartupIdea: boolean
  startupIdea?: string
  hasTeam: boolean
  teamMembers?: string
  technicalSkills: string[]
  interests: string[]
  whyJoin: string
  goals: string
  previousExperience?: string
  requestedRole: string
  status: string
  reviewedBy?: string
  reviewedAt?: string
  reviewNotes?: string
  documents: Array<{
    _id?: string
    type: string
    fileId: string
    fileName: string
    fileSize?: number
    mimeType?: string
    status: string
    uploadedAt: string
    verifiedAt?: string
    verifiedBy?: string
    rejectionReason?: string
    notes?: string
  }>
  interviewDate?: string
  interviewLocation?: string
  feedback?: string
  createdAt: string
  updatedAt: string
}

export interface ApplicationStats {
  hasApplication: boolean
  status: string
  profileCompletion: number
  documentsSubmitted: number
  documentsRequired: number
  application: Application | null
}

/**
 * Hook to fetch and manage application status
 */
export function useApplicationStatus() {
  return useQuery<ApplicationStats, Error>({
    queryKey: ['application-status'],
    queryFn: async () => {
      try {
        // Use validateStatus to treat 404 as success (not an error)
        // This prevents axios from throwing and logging the error
        const response = await api.get('/applications/my-application', {
          validateStatus: (status) => status === 200 || status === 404,
          // Suppress 404 errors in console
          suppressErrors: true
        })
        
        // If 404, user hasn't submitted application yet
        if (response.status === 404 || !response.data?.data) {
          return {
            hasApplication: false,
            status: 'not_submitted',
            profileCompletion: 0,
            documentsSubmitted: 0,
            documentsRequired: 6,
            application: null
          }
        }

        const application = response.data.data

        return {
          hasApplication: true,
          status: application.status,
          profileCompletion: calculateProfileCompletion(application),
          documentsSubmitted: application.documents?.length || 0,
          documentsRequired: 6,
          application
        }
      } catch (error) {
        // Silently handle errors - return default state
        return {
          hasApplication: false,
          status: 'not_submitted',
          profileCompletion: 0,
          documentsSubmitted: 0,
          documentsRequired: 6,
          application: null
        }
      }
    },
    enabled: true,
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: true,
    retry: false // Don't retry
  })
}

/**
 * Hook to submit new application
 */
export function useSubmitApplication() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Partial<Application>) => {
      const response = await api.post('/applications', data)
      return response.data
    },
    onSuccess: () => {
      // Invalidate and refetch application status
      queryClient.invalidateQueries({ queryKey: ['application-status'] })
    }
  })
}

/**
 * Hook to update application
 */
export function useUpdateApplication() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Application> }) => {
      const response = await api.put(`/applications/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['application-status'] })
    }
  })
}

// Helper functions
function calculateProfileCompletion(application: Application | null): number {
  if (!application) return 0

  const fields = [
    application.firstName,
    application.lastName,
    application.email,
    application.phoneNumber,
    application.nationalId,
    application.dateOfBirth,
    application.university,
    application.major,
    application.degree,
    application.graduationYear
  ]

  const filledFields = fields.filter(field => field && field !== '').length
  return Math.round((filledFields / fields.length) * 100)
}
