import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from '@/lib/toast';
import {
  Project,
  ProjectsListResponse,
  ProjectStatsResponse,
  ProjectFilters,
  CreateProjectInput,
  UpdateProjectInput,
  JoinProjectInput,
  UpdateMilestoneInput,
} from '@/types/project';

// 1. Get all projects
export const useProjects = (params: ProjectFilters = {}) => {
  return useQuery({
    queryKey: ['projects', params],
    queryFn: async () => {
      const { data } = await api.get<ProjectsListResponse>('/projects', { params });
      return data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

// 2. Get my projects
export const useMyProjects = (params: { status?: string; page?: number; limit?: number } = {}) => {
  return useQuery({
    queryKey: ['my-projects', params],
    queryFn: async () => {
      const { data } = await api.get<ProjectsListResponse>('/my-projects', { params });
      return data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

// 3. Get project by ID
export const useProject = (id: string) => {
  return useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      const { data } = await api.get(`/projects/${id}`);
      return data.data as Project;
    },
    enabled: !!id,
  });
};

// 4. Get project stats
export const useProjectStats = () => {
  return useQuery({
    queryKey: ['project-stats'],
    queryFn: async () => {
      const { data } = await api.get<ProjectStatsResponse>('/projects/stats');
      return data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

// 5. Create project
export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectData: CreateProjectInput) => {
      const { data } = await api.post('/projects', projectData);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['my-projects'] });
      queryClient.invalidateQueries({ queryKey: ['project-stats'] });
      toast.success('پروژه با موفقیت ایجاد شد');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'خطا در ایجاد پروژه');
    },
  });
};

// 6. Update project
export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data: projectData }: { id: string; data: UpdateProjectInput }) => {
      const { data } = await api.put(`/projects/${id}`, projectData);
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['my-projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['project-stats'] });
      toast.success('پروژه با موفقیت بروزرسانی شد');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'خطا در بروزرسانی پروژه');
    },
  });
};

// 7. Delete project
export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/projects/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['my-projects'] });
      queryClient.invalidateQueries({ queryKey: ['project-stats'] });
      toast.success('پروژه با موفقیت حذف شد');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'خطا در حذف پروژه');
    },
  });
};

// 8. Join project
export const useJoinProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, role }: { projectId: string; role?: string }) => {
      const { data } = await api.post(`/projects/${projectId}/join`, { role });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['my-projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ['project-stats'] });
      toast.success('با موفقیت به پروژه پیوستید');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'خطا در پیوستن به پروژه');
    },
  });
};

// 9. Leave project
export const useLeaveProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectId: string) => {
      const { data } = await api.delete(`/projects/${projectId}/leave`);
      return data;
    },
    onSuccess: (_, projectId) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['my-projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      queryClient.invalidateQueries({ queryKey: ['project-stats'] });
      toast.success('با موفقیت از پروژه خارج شدید');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'خطا در خروج از پروژه');
    },
  });
};

// 10. Add milestone
export const useAddMilestone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, data }: { projectId: string; data: any }) => {
      const response = await api.post(`/projects/${projectId}/milestones`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['project', variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('مایلستون با موفقیت اضافه شد');
    },
    onError: () => {
      toast.error('خطا در افزودن مایلستون');
    },
  });
};

// 11. Update milestone
export const useUpdateMilestone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      milestoneId,
      data,
    }: {
      projectId: string;
      milestoneId: string;
      data: UpdateMilestoneInput;
    }) => {
      const response = await api.put(`/milestones/${milestoneId}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['project', variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('مایلستون با موفقیت بروزرسانی شد');
    },
    onError: () => {
      toast.error('خطا در بروزرسانی مایلستون');
    },
  });
};

// 12. Delete milestone
export const useDeleteMilestone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      milestoneId,
    }: {
      projectId: string;
      milestoneId: string;
    }) => {
      const response = await api.delete(`/projects/${projectId}/milestones/${milestoneId}`);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['project', variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('مایلستون با موفقیت حذف شد');
    },
    onError: () => {
      toast.error('خطا در حذف مایلستون');
    },
  });
};
