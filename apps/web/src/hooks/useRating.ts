import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useRating(productId: string) {
  const queryClient = useQueryClient();

  const { data: average = { average: 0, count: 0 }, ...query } = useQuery({
    queryKey: ['rating', productId],
    queryFn: () => api.fetchAverageRating(productId),
  });

  const mutation = useMutation({
    mutationFn: (value: number) => api.addRating(productId, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rating', productId] });
    },
  });

  return { average, rate: mutation.mutateAsync, ...query };
}
