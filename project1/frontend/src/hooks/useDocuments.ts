import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api, { fileApi } from '@/lib/api'
import { Document, DocumentType } from '@/types/document'

/**
 * Hook to fetch documents for current user's application
 */
export function useDocuments(applicationId?: string) {
  return useQuery<Document[], Error>({
    queryKey: ['documents', applicationId],
    queryFn: async () => {
      if (!applicationId) return []
      
      const response = await api.get(`/applications/${applicationId}/documents`)
      return response.data.data || []
    },
    enabled: !!applicationId,
    staleTime: 30000, // 30 seconds
  })
}

/**
 * Hook to upload a document
 */
export function useUploadDocument(applicationId?: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ file, type }: { file: File; type: DocumentType }) => {
      if (!applicationId) {
        throw new Error('Application ID is required')
      }

      // Create form data
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)

      // Upload to file service first
      const uploadResponse = await fileApi.post('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      // Extract file ID from response (backend returns file object with _id)
      const uploadedFile = uploadResponse.data.data
      const fileId = uploadedFile._id || uploadedFile.id

      // Then add to application documents
      const response = await api.post(`/applications/${applicationId}/documents`, {
        type,
        fileId,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
      })

      return response.data.data
    },
    onSuccess: () => {
      // Invalidate documents query
      queryClient.invalidateQueries({ queryKey: ['documents', applicationId] })
      queryClient.invalidateQueries({ queryKey: ['application-status'] })
    },
  })
}

/**
 * Hook to delete a document
 */
export function useDeleteDocument(applicationId?: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (documentId: string) => {
      if (!applicationId) {
        throw new Error('Application ID is required')
      }

      const response = await api.delete(`/applications/${applicationId}/documents/${documentId}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', applicationId] })
      queryClient.invalidateQueries({ queryKey: ['application-status'] })
    },
  })
}

/**
 * Hook to download a document
 */
export function useDownloadDocument() {
  return useMutation({
    mutationFn: async (doc: Document) => {
      // Download from file service using view endpoint
      const response = await fileApi.get(`/files/view/${doc.fileId}`, {
        responseType: 'blob',
      })

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = window.document.createElement('a')
      link.href = url
      link.setAttribute('download', doc.fileName)
      window.document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    },
  })
}

/**
 * Get documents grouped by type
 */
export function useDocumentsGrouped(applicationId?: string) {
  const { data: documents, ...rest } = useDocuments(applicationId)

  const grouped = documents?.reduce((acc, doc) => {
    if (!acc[doc.type]) {
      acc[doc.type] = []
    }
    acc[doc.type].push(doc)
    return acc
  }, {} as Record<string, Document[]>)

  return {
    documents,
    grouped,
    ...rest,
  }
}
