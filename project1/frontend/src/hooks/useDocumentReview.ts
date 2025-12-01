import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from '@/components/ui/toast';

export interface PendingDocument {
  _id: string;
  type: string;
  fileName: string;
  fileId: string;
  fileSize?: number;
  mimeType?: string;
  status: 'pending' | 'verified' | 'rejected';
  uploadedAt: Date;
  applicationId: string;
  applicant: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export interface PendingDocumentsResponse {
  success: boolean;
  data: PendingDocument[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * Hook to fetch pending documents for review
 */
export function usePendingDocuments(page: number = 1, limit: number = 20, applicantId?: string) {
  return useQuery<PendingDocumentsResponse>({
    queryKey: ['pending-documents', page, limit, applicantId],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (applicantId) {
        params.append('applicantId', applicantId);
      }

      const response = await api.get(`/applications/documents/pending?${params}`);
      return response.data;
    },
    staleTime: 30000, // 30 seconds
  });
}

/**
 * Hook to verify a document
 */
export function useVerifyDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ applicationId, documentId, notes }: {
      applicationId: string;
      documentId: string;
      notes?: string;
    }) => {
      const response = await api.put(
        `/applications/${applicationId}/documents/${documentId}/verify`,
        { notes }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-documents'] });
      toast.success('مدرک با موفقیت تایید شد');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'خطا در تایید مدرک');
    },
  });
}

/**
 * Hook to reject a document
 */
export function useRejectDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ applicationId, documentId, rejectionReason, notes }: {
      applicationId: string;
      documentId: string;
      rejectionReason: string;
      notes?: string;
    }) => {
      const response = await api.put(
        `/applications/${applicationId}/documents/${documentId}/reject`,
        { rejectionReason, notes }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-documents'] });
      toast.success('مدرک رد شد و اعلان برای متقاضی ارسال شد');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'خطا در رد مدرک');
    },
  });
}

/**
 * Hook to request additional information
 */
export function useRequestDocumentInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ applicationId, documentId, message }: {
      applicationId: string;
      documentId: string;
      message: string;
    }) => {
      const response = await api.post(
        `/applications/${applicationId}/documents/${documentId}/request-info`,
        { message }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-documents'] });
      toast.success('درخواست اطلاعات تکمیلی ارسال شد');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'خطا در ارسال درخواست');
    },
  });
}
