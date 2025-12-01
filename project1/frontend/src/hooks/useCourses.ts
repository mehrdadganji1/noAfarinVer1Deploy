import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from '@/lib/toast';
import { Course, CoursesListResponse, CourseStatsResponse } from '@/types/course';

// 1. Get all courses
export const useCourses = (params: any = {}) => {
  return useQuery({
    queryKey: ['courses', params],
    queryFn: async () => {
      const { data } = await api.get<CoursesListResponse>('/api/courses', { params });
      return data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

// 2. Get course by ID
export const useCourse = (id: string) => {
  return useQuery({
    queryKey: ['course', id],
    queryFn: async () => {
      const { data } = await api.get(`/api/courses/${id}`);
      return data.data as Course;
    },
    enabled: !!id,
  });
};

// 3. Get course stats
export const useCourseStats = () => {
  return useQuery({
    queryKey: ['course-stats'],
    queryFn: async () => {
      const { data } = await api.get<CourseStatsResponse>('/api/courses/stats');
      return data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

// 4. Enroll in course
export const useEnrollCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (courseId: string) => {
      const { data } = await api.post(`/api/courses/${courseId}/enroll`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['course'] });
      queryClient.invalidateQueries({ queryKey: ['course-stats'] });
      toast.success('با موفقیت در دوره ثبت‌نام شدید');
    },
    onError: () => {
      toast.error('خطا در ثبت‌نام دوره');
    },
  });
};

// 5. Drop course
export const useDropCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (courseId: string) => {
      const { data } = await api.delete(`/api/courses/${courseId}/drop`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['course'] });
      toast.success('از دوره خارج شدید');
    },
    onError: () => {
      toast.error('خطا در خروج از دوره');
    },
  });
};
