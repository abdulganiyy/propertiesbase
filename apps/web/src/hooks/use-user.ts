import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import { api, type PropertyFilters, type InquiryData } from "@/lib/api"



export function useUser() {
  return useQuery({
    queryKey:['user-profile'],
    queryFn: api.getUserProfile,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useAllUsers() {
  return useQuery({
    queryKey:['users-all'],
    queryFn: api.getUsers,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useUserStats() {
  return useQuery({
    queryKey:['user-stats'],
    queryFn: api.getUserStats,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useRecentActivities() {
  return useQuery({
    queryKey:['recent-activities'],
    queryFn: api.getRecentActivities,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}