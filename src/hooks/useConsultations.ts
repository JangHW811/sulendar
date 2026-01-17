/**
 * 상담 기록 관련 TanStack Query 훅
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { consultationsService, CreateConsultationParams } from '../services';

const QUERY_KEY = 'consultations';

/**
 * 사용자의 상담 기록 조회
 */
export function useConsultations(limit = 50) {
  return useQuery({
    queryKey: [QUERY_KEY, 'list', limit],
    queryFn: () => consultationsService.getByUser(limit),
  });
}

/**
 * 날짜 범위로 상담 기록 조회
 */
export function useConsultationsByDateRange(startDate: string, endDate: string) {
  return useQuery({
    queryKey: [QUERY_KEY, 'range', startDate, endDate],
    queryFn: () => consultationsService.getByDateRange(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
}

/**
 * 상담 기록 생성 mutation
 */
export function useCreateConsultation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateConsultationParams) => consultationsService.create(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

/**
 * 상담 기록 삭제 mutation
 */
export function useDeleteConsultation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => consultationsService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}
