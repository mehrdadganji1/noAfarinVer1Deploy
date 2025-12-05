import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

// Helper function to convert File to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// Types
export interface Education {
  _id?: string;
  institution: string;
  degree: string;
  major: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  gpa?: number;
  achievements?: string;
}

export interface WorkExperience {
  _id?: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
  location?: string;
}

export interface Certification {
  _id?: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  credentialId?: string;
  url?: string;
}

export interface SocialLinks {
  linkedin?: string;
  github?: string;
  portfolio?: string;
  twitter?: string;
  other?: string;
}

export interface ProfileData {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  university?: string;
  major?: string;
  bio?: string;
  avatar?: string;
  educationHistory?: Education[];
  workExperience?: WorkExperience[];
  skills?: Skill[];
  certifications?: Certification[];
  socialLinks?: SocialLinks;
  profileCompletion?: number;
}

// ==================== PROFILE ====================

/**
 * Get full profile
 */
export const useProfile = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      const { data } = await api.get(`/profile/${userId}`);
      const profileData = data.data;
      
      // Transform skills: map 'level' from backend to 'proficiency' for frontend
      if (profileData?.user?.skills) {
        profileData.user.skills = profileData.user.skills.map((skill: any) => ({
          ...skill,
          proficiency: skill.level || skill.proficiency || 'beginner',
        }));
      }
      
      return profileData;
    },
    staleTime: 0, // Always consider data stale
    refetchOnWindowFocus: true,
    enabled: !!userId,
    retry: false, // Don't retry on 404
  });
};

/**
 * Get profile completion percentage
 */
export const useProfileCompletion = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['profile-completion', userId],
    queryFn: async () => {
      const { data } = await api.get(`/profile/${userId}/completion`);
      return data.data;
    },
    enabled: !!userId,
    refetchInterval: 10000, // Refetch every 10 seconds
    retry: false, // Don't retry on 404
  });
};

// ==================== EDUCATION ====================

/**
 * Add education entry
 */
export const useAddEducation = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (education: Education) => {
      const { data } = await api.post(`/profile/${userId}/education`, education);
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
      queryClient.invalidateQueries({ queryKey: ['profile-completion', userId] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

/**
 * Update education entry
 */
export const useUpdateEducation = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eduId, education }: { eduId: string; education: Partial<Education> }) => {
      const { data } = await api.put(`/profile/${userId}/education/${eduId}`, education);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
      queryClient.invalidateQueries({ queryKey: ['profile-completion', userId] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

/**
 * Delete education entry
 */
export const useDeleteEducation = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eduId: string) => {
      const { data} = await api.delete(`/profile/${userId}/education/${eduId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
      queryClient.invalidateQueries({ queryKey: ['profile-completion', userId] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

// ==================== WORK EXPERIENCE ====================

/**
 * Add work experience
 */
export const useAddExperience = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (experience: WorkExperience) => {
      const { data } = await api.post(`/profile/${userId}/experience`, experience);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
      queryClient.invalidateQueries({ queryKey: ['profile-completion', userId] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

/**
 * Update work experience
 */
export const useUpdateExperience = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ expId, experience }: { expId: string; experience: Partial<WorkExperience> }) => {
      const { data } = await api.put(`/profile/${userId}/experience/${expId}`, experience);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
      queryClient.invalidateQueries({ queryKey: ['profile-completion', userId] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

/**
 * Delete work experience
 */
export const useDeleteExperience = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (expId: string) => {
      const { data } = await api.delete(`/profile/${userId}/experience/${expId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
      queryClient.invalidateQueries({ queryKey: ['profile-completion', userId] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

// ==================== SKILLS ====================

export interface Skill {
  _id?: string;
  name: string;
  category: string;
  proficiency: string;
}

/**
 * Add skill
 */
export const useAddSkill = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (skill: Skill) => {
      const { data } = await api.post(`/profile/${userId}/skills`, skill);
      return data;
    },
    onSuccess: (data) => {
      // Directly update the cache with new data
      queryClient.setQueryData(['profile', userId], data.data);
      queryClient.invalidateQueries({ queryKey: ['profile-completion', userId] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

/**
 * Update skill
 */
export const useUpdateSkill = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ skillId, skill }: { skillId: string; skill: Skill }) => {
      console.log('🔄 Updating skill:', { skillId, skill });
      const { data } = await api.put(`/profile/${userId}/skills/${skillId}`, skill);
      console.log('✅ Update response:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('📦 Setting query data with new user:', data.data);
      
      // Directly update the cache with new data
      queryClient.setQueryData(['profile', userId], (oldData: any) => {
        console.log('🔄 Old cache data:', oldData);
        console.log('🆕 New data from server:', data.data);
        return data.data;
      });
      
      // Force refetch to ensure UI updates
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
      queryClient.invalidateQueries({ queryKey: ['profile-completion', userId] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error) => {
      console.error('❌ Mutation error:', error);
    }
  });
};

/**
 * Delete skill
 */
export const useDeleteSkill = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (skillId: string) => {
      const { data } = await api.delete(`/profile/${userId}/skills/${skillId}`);
      return data;
    },
    onSuccess: (data) => {
      // Directly update the cache with new data
      queryClient.setQueryData(['profile', userId], data.data);
      queryClient.invalidateQueries({ queryKey: ['profile-completion', userId] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

// ==================== CERTIFICATIONS ====================

/**
 * Add certification
 */
export const useAddCertification = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (certification: Certification) => {
      const { data } = await api.post(`/profile/${userId}/certifications`, certification);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
      queryClient.invalidateQueries({ queryKey: ['profile-completion', userId] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

/**
 * Delete certification
 */
export const useDeleteCertification = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (certId: string) => {
      const { data } = await api.delete(`/profile/${userId}/certifications/${certId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
      queryClient.invalidateQueries({ queryKey: ['profile-completion', userId] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

// ==================== SOCIAL LINKS ====================

/**
 * Update social links
 */
export const useUpdateSocialLinks = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (socialLinks: SocialLinks) => {
      const { data } = await api.put(`/profile/${userId}/social-links`, { socialLinks });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
      queryClient.invalidateQueries({ queryKey: ['profile-completion', userId] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

// ==================== AVATAR ====================

/**
 * Upload avatar - supports both File and base64 string
 */
export const useUploadAvatar = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: File | string) => {
      console.log('📸 Uploading avatar for user:', userId);
      
      // Validate userId
      if (!userId || userId === 'undefined' || userId === 'null') {
        throw new Error('شناسه کاربر نامعتبر است');
      }
      
      // Always send as JSON with base64 string
      const avatarData = typeof input === 'string' ? input : await fileToBase64(input);
      
      console.log('📤 Sending avatar data, length:', avatarData.length);
      
      const { data } = await api.post(`/profile/${userId}/avatar`, 
        { avatar: avatarData },
        { 
          headers: { 
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('✅ Avatar uploaded successfully');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
      queryClient.invalidateQueries({ queryKey: ['profile-completion', userId] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error: any) => {
      console.error('❌ Avatar upload failed:', error);
      console.error('Error response:', error.response?.data);
    }
  });
};

/**
 * Delete avatar
 */
export const useDeleteAvatar = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.delete(`/profile/${userId}/avatar`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
      queryClient.invalidateQueries({ queryKey: ['profile-completion', userId] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};
