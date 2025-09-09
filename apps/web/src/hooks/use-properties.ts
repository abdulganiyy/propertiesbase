import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import { api, type PropertyFilters, type InquiryData } from "@/lib/api"

// import axios from 'axios'
import axios from "@/axiosInstance"


// Query keys
export const propertyKeys = {
  all: ["properties"] as const,
  lists: () => [...propertyKeys.all, "list"] as const,
  list: (filters: PropertyFilters) => [...propertyKeys.lists(), filters] as const,
  favorites: () => [...propertyKeys.lists(), 'favorites'] as const,
  viewings: () => [...propertyKeys.lists(), 'viewings'] as const,
  ownerviewings: () => [ 'ownerviewings'] as const,
  ownerproperties: () => ['ownerproperties'] as const,
  details: () => [...propertyKeys.all, "detail"] as const,
  detail: (id: string) => [...propertyKeys.details(), id] as const,
  views: () => [...propertyKeys.lists(), 'views'] as const,
  ownerviews: () => [...propertyKeys.lists(), 'ownerviews'] as const,
  userviews: () => [...propertyKeys.lists(), 'userviews'] as const,



}

// Hook for fetching properties list
export function useProperties(filters: PropertyFilters = {}) {
  return useQuery({
    queryKey: propertyKeys.list(filters),
    queryFn: () => api.getProperties(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook for fetching properties list
export function useAllProperties(filters: PropertyFilters = {}) {
  return useQuery({
    queryKey: propertyKeys.list(filters),
    queryFn: () => api.getAllProperties(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook for fetching properties list
export function useOwnerProperties() {
  return useQuery({
    queryKey: propertyKeys.ownerproperties(),
    queryFn: () => api.getOwnerProperties(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useFavorites() {
  return useQuery({
    queryKey: propertyKeys.favorites(),
    queryFn: () => api.getFavorites(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useViewings() {
  return useQuery({
    queryKey: propertyKeys.viewings(),
    queryFn: () => api.getViewings(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useOwnerViewings() {
  return useQuery({
    queryKey: propertyKeys.ownerviewings(),
    queryFn: () => api.getOwnerViewings(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook for fetching single property
export function useProperty(id: string) {
  return useQuery({
    queryKey: propertyKeys.detail(id),
    queryFn: () => api.getProperty(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Hook for submitting inquiry
export function useSubmitInquiry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: InquiryData) => api.submitInquiry(data),
    onSuccess: () => {
      // Optionally invalidate related queries
      queryClient.invalidateQueries({ queryKey: propertyKeys.all })
    },
  })
}

export function useSchedulePropertyView(){
    const queryClient = useQueryClient()


   // ✅ React Query mutation
  return  useMutation({
      mutationFn: (data: any) =>
        api.schedulePropertyView({
          propertyId:data.propertyId,
          scheduledAt: new Date(data.scheduledAt).toISOString(),
          notes: data.notes,
        }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: propertyKeys.all }); // refresh related queries
      },
    });
}

// Hook for toggling favorites
export function useToggleFavorite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (propertyId: string) => api.toggleFavorite(propertyId),
    onSuccess: () => {
      // Invalidate properties list to update favorite status
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() })
    },
  })
}

// Hook for prefetching property details (useful for hover effects)
export function usePrefetchProperty() {
  const queryClient = useQueryClient()

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: propertyKeys.detail(id),
      queryFn: () => api.getProperty(id),
      staleTime: 10 * 60 * 1000,
    })
  }
}

// type PropertyPayload = {
//   id?: string
//   salePrice: number
//   monthlyRent: number
//   yearlyRent: number
//   rentPeriod: string
//   leaseAmount: number
//   leaseDuration: string
//   securityDeposit: number
//   images?: Array<{
//     imageUrl: string
//     isCover?: boolean
//   }>
// }

export function useSubmitProperty() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: any) => {
      if (data.id) {
        // update
        console.log(" // update")
        const { id, ...rest } = data
        const response = await axios.patch(`/property/${id}`, rest)
        return response.data
      } else {
      
         console.log("  // create")
        const response = await axios.post('/property', data)
        return response.data
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] })
    },
  })
}

export function useUserPropertiesViews(){

  return useQuery({
    queryKey: propertyKeys.views(),
    queryFn: () => api.getUserPropertiesViews(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })

}

export function useOwnerPropertiesViews(){

  return useQuery({
    queryKey: propertyKeys.ownerviews(),
    queryFn: () => api.getOwnerPropertiesViews(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })

}

export function useTrackViewMutation(propertyId:string){
    const queryClient = useQueryClient()


  return useMutation({
    mutationFn: () => api.trackPropertyView(propertyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: propertyKeys.views() })
    },
  })

}


