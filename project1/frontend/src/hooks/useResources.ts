import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { Resource, ResourceType, ResourceCategory } from '@/types/resource'

/**
 * Hook to fetch all resources
 */
export function useResources() {
  return useQuery<Resource[], Error>({
    queryKey: ['resources'],
    queryFn: async () => {
      try {
        const response = await api.get('/api/resources')
        return response.data.data || []
      } catch (error: any) {
        if (error.response?.status === 404) {
          // Return empty array if endpoint doesn't exist yet
          console.warn('Resources endpoint not found, returning empty array')
          return []
        }
        throw error
      }
    },
    staleTime: 300000, // 5 minutes
    retry: false, // Don't retry on 404
  })
}

/**
 * Hook to fetch a single resource
 */
export function useResource(resourceId?: string) {
  return useQuery<Resource, Error>({
    queryKey: ['resource', resourceId],
    queryFn: async () => {
      if (!resourceId) throw new Error('Resource ID is required')
      
      const response = await api.get(`/api/resources/${resourceId}`)
      return response.data.data
    },
    enabled: !!resourceId,
    staleTime: 300000,
  })
}

/**
 * Hook to track resource view
 */
export function useTrackView() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (resourceId: string) => {
      const response = await api.get(`/api/resources/${resourceId}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] })
    }
  })
}

/**
 * Hook to track resource download
 */
export function useTrackDownload() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (resourceId: string) => {
      const response = await api.get(`/api/resources/${resourceId}/download`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] })
    }
  })
}

/**
 * Hook to get resources by type
 */
export function useResourcesByType(type?: ResourceType) {
  const { data: resources, ...rest } = useResources()

  const filtered = type 
    ? resources?.filter(resource => resource.type === type)
    : resources

  return {
    resources: filtered,
    ...rest
  }
}

/**
 * Hook to get resources by category
 */
export function useResourcesByCategory(category?: ResourceCategory) {
  const { data: resources, ...rest } = useResources()

  const filtered = category
    ? resources?.filter(resource => resource.category === category)
    : resources

  return {
    resources: filtered,
    ...rest
  }
}

/**
 * Hook to get featured resources
 */
export function useFeaturedResources() {
  const { data: resources, ...rest } = useResources()

  const featured = resources?.filter(resource => resource.featured)
    .sort((a, b) => b.views - a.views)
    .slice(0, 6)

  return {
    resources: featured,
    ...rest
  }
}

/**
 * Hook to get popular resources
 */
export function usePopularResources(limit: number = 10) {
  const { data: resources, ...rest } = useResources()

  const popular = resources?.sort((a, b) => b.views - a.views)
    .slice(0, limit)

  return {
    resources: popular,
    ...rest
  }
}

/**
 * Hook to search resources
 */
export function useSearchResources(query: string) {
  const { data: resources, ...rest } = useResources()

  const searchResults = query
    ? resources?.filter(resource => 
        resource.title.toLowerCase().includes(query.toLowerCase()) ||
        resource.description.toLowerCase().includes(query.toLowerCase()) ||
        resource.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      )
    : resources

  return {
    resources: searchResults,
    ...rest
  }
}
