import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from '@/lib/toast';
import { Event } from '@/types/event';

interface EventsParams {
  type?: string;
  status?: string;
  page?: number;
  limit?: number;
}

interface EventsResponse {
  success: boolean;
  data: {
    events: Event[];
    total: number;
    page: number;
    totalPages: number;
  };
}

interface EventStatsResponse {
  success: boolean;
  data: {
    total: number;
    upcoming: number;
    ongoing: number;
    completed: number;
    userRegistered: number;
    userAttended: number;
  };
}

// 1. Get all events
export const useEvents = (params: EventsParams = {}) => {
  return useQuery({
    queryKey: ['events', params],
    queryFn: async () => {
      const { data } = await api.get<EventsResponse>('/events', { params });
      return data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// 2. Get event by ID
export const useEvent = (id: string) => {
  return useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      const { data } = await api.get(`/events/${id}`);
      return data.data as Event;
    },
    enabled: !!id,
  });
};

// 3. Get event stats
export const useEventStats = () => {
  return useQuery({
    queryKey: ['event-stats'],
    queryFn: async () => {
      const { data } = await api.get<EventStatsResponse>('/events/stats');
      return data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

// 4. Create event
export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventData: Partial<Event>) => {
      const { data } = await api.post('/events', eventData);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event-stats'] });
      toast.success('رویداد با موفقیت ایجاد شد');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'خطا در ایجاد رویداد');
    },
  });
};

// 5. Update event
export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data: eventData }: { id: string; data: Partial<Event> }) => {
      const { data } = await api.put(`/events/${id}`, eventData);
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['event-stats'] });
      toast.success('رویداد با موفقیت بروزرسانی شد');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'خطا در بروزرسانی رویداد');
    },
  });
};

// 6. Register for event
export const useRegisterEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventId: string) => {
      const { data } = await api.post(`/events/${eventId}/register`);
      return data;
    },
    onSuccess: (_, eventId) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      queryClient.invalidateQueries({ queryKey: ['event-stats'] });
      toast.success('ثبت‌نام با موفقیت انجام شد');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'خطا در ثبت‌نام');
    },
  });
};

// 7. Cancel registration
export const useCancelRegistration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventId: string) => {
      const { data } = await api.delete(`/events/${eventId}/register`);
      return data;
    },
    onSuccess: (_, eventId) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      queryClient.invalidateQueries({ queryKey: ['event-stats'] });
      toast.success('ثبت‌نام لغو شد');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'خطا در لغو ثبت‌نام');
    },
  });
};

// 8. Mark attendance (Admin/Organizer only)
export const useMarkAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eventId, userId }: { eventId: string; userId: string }) => {
      const { data } = await api.post(`/events/${eventId}/attendance`, { userId });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event', variables.eventId] });
      toast.success('حضور ثبت شد');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'خطا در ثبت حضور');
    },
  });
};
