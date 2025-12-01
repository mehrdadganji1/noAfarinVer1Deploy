import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

// ====================================
// TYPES
// ====================================

export interface TeamMember {
  userId: string;
  role: 'founder' | 'member' | 'mentor';
  joinedAt: string;
}

export interface Team {
  _id: string;
  name: string;
  description: string;
  projectId?: string;
  members: TeamMember[];
  mentors: string[];
  status: 'active' | 'inactive' | 'completed';
  phase: 'forming' | 'norming' | 'performing' | 'adjourning';
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTeamInput {
  name: string;
  description: string;
  projectId?: string;
  tags?: string[];
}

export interface UpdateTeamInput {
  name?: string;
  description?: string;
  status?: 'active' | 'inactive' | 'completed';
  phase?: 'forming' | 'norming' | 'performing' | 'adjourning';
  tags?: string[];
}

export interface TeamsFilters {
  status?: 'active' | 'inactive' | 'completed';
  phase?: 'forming' | 'norming' | 'performing' | 'adjourning';
  page?: number;
  limit?: number;
}

interface TeamsResponse {
  success: boolean;
  data: {
    teams: Team[];
    total: number;
    page: number;
    totalPages: number;
  };
}

interface TeamResponse {
  success: boolean;
  data: Team;
}

// ====================================
// API FUNCTIONS
// ====================================

const teamsApi = {
  getAll: async (filters?: TeamsFilters): Promise<TeamsResponse> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.phase) params.append('phase', filters.phase);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await api.get(`/api/teams?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string): Promise<TeamResponse> => {
    const response = await api.get(`/api/teams/${id}`);
    return response.data;
  },

  create: async (data: CreateTeamInput): Promise<TeamResponse> => {
    const response = await api.post('/teams', data);
    return response.data;
  },

  update: async (id: string, data: UpdateTeamInput): Promise<TeamResponse> => {
    const response = await api.put(`/teams/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/teams/${id}`);
    return response.data;
  },

  addMember: async (id: string, userId: string, role: string): Promise<TeamResponse> => {
    const response = await api.post(`/teams/${id}/members`, { userId, role });
    return response.data;
  },

  removeMember: async (id: string, userId: string): Promise<TeamResponse> => {
    const response = await api.delete(`/teams/${id}/members/${userId}`);
    return response.data;
  },

  addMentor: async (id: string, mentorId: string): Promise<TeamResponse> => {
    const response = await api.post(`/teams/${id}/mentors`, { mentorId });
    return response.data;
  },
};

// ====================================
// HOOKS
// ====================================

export const useTeams = (filters?: TeamsFilters) => {
  return useQuery({
    queryKey: ['teams', filters],
    queryFn: () => teamsApi.getAll(filters),
  });
};

export const useTeam = (id: string) => {
  return useQuery({
    queryKey: ['teams', id],
    queryFn: () => teamsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: teamsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast.success('تیم با موفقیت ایجاد شد');
    },
    onError: () => {
      toast.error('خطا در ایجاد تیم');
    },
  });
};

export const useUpdateTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTeamInput }) =>
      teamsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['teams', variables.id] });
      toast.success('تیم با موفقیت به‌روزرسانی شد');
    },
    onError: () => {
      toast.error('خطا در به‌روزرسانی تیم');
    },
  });
};

export const useDeleteTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: teamsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast.success('تیم با موفقیت حذف شد');
    },
    onError: () => {
      toast.error('خطا در حذف تیم');
    },
  });
};

export const useAddMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teamId, userId, role }: { teamId: string; userId: string; role: string }) =>
      teamsApi.addMember(teamId, userId, role),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['teams', variables.teamId] });
      toast.success('عضو با موفقیت اضافه شد');
    },
    onError: () => {
      toast.error('خطا در افزودن عضو');
    },
  });
};

export const useRemoveMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teamId, userId }: { teamId: string; userId: string }) =>
      teamsApi.removeMember(teamId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['teams', variables.teamId] });
      toast.success('عضو با موفقیت حذف شد');
    },
    onError: () => {
      toast.error('خطا در حذف عضو');
    },
  });
};

export const useAddMentor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teamId, mentorId }: { teamId: string; mentorId: string }) =>
      teamsApi.addMentor(teamId, mentorId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['teams', variables.teamId] });
      toast.success('منتور با موفقیت اضافه شد');
    },
    onError: () => {
      toast.error('خطا در افزودن منتور');
    },
  });
};
