import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useReviews(propertyId: string) {
  const queryClient = useQueryClient();

  const { data: reviews = [], ...query } = useQuery({
    queryKey: ['reviews', propertyId],
    queryFn: () => api.fetchReviews(propertyId),
  });

  const mutation = useMutation({
    mutationFn: (content: string) => api.addReview(propertyId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', propertyId] });
    },
  });

  return { reviews, addReview: mutation.mutateAsync, ...query };
}
