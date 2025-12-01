import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/lib/toast';
import { useAuthStore } from '@/store/authStore';
import {
  useProfile,
  useAddEducation,
  useUpdateEducation,
  useDeleteEducation,
  useAddExperience,
  useUpdateExperience,
  useDeleteExperience,
  useAddCertification,
  useDeleteCertification,
  useAddSkill,
  useUpdateSkill,
  useDeleteSkill,
  useUpdateSocialLinks,
  useUploadAvatar,
  Education,
  WorkExperience,
  Certification,
  Skill,
} from '@/hooks/useProfile';

export const useProfileController = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  // Get userId from multiple sources - try user object first, then profile
  let userId = user?._id || (user as any)?.id || '';
  
  const { data: profileData, isLoading } = useProfile(userId);
  const profile = profileData?.user;
  
  // If userId is still empty, try to get it from profile
  if (!userId && profile) {
    userId = profile._id || (profile as any).id || '';
  }
  
  console.log('🔍 useProfileController:', { 
    hasUser: !!user, 
    userId, 
    hasProfile: !!profile,
    userKeys: user ? Object.keys(user) : [] 
  });

  // Mutations
  const addEducation = useAddEducation(userId);
  const updateEducation = useUpdateEducation(userId);
  const deleteEducation = useDeleteEducation(userId);
  const addExperience = useAddExperience(userId);
  const updateExperience = useUpdateExperience(userId);
  const deleteExperience = useDeleteExperience(userId);
  const addCertification = useAddCertification(userId);
  const deleteCertification = useDeleteCertification(userId);
  const addSkill = useAddSkill(userId);
  const updateSkill = useUpdateSkill(userId);
  const deleteSkill = useDeleteSkill(userId);
  const updateSocialLinks = useUpdateSocialLinks(userId);
  const uploadAvatar = useUploadAvatar(userId);

  // UI State
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | undefined>();
  
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<WorkExperience | undefined>();
  
  const [isCertificationModalOpen, setIsCertificationModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  // Handlers - Education
  const handleAddEducation = () => {
    setEditingEducation(undefined);
    setIsEducationModalOpen(true);
  };

  const handleEditEducation = (education: Education) => {
    setEditingEducation(education);
    setIsEducationModalOpen(true);
  };

  const handleSubmitEducation = async (education: Education) => {
    try {
      if (editingEducation?._id) {
        await updateEducation.mutateAsync({ eduId: editingEducation._id, education });
        toast.success('سابقه تحصیلی به‌روزرسانی شد');
      } else {
        await addEducation.mutateAsync(education);
        toast.success('سابقه تحصیلی اضافه شد');
      }
      setIsEducationModalOpen(false);
      setEditingEducation(undefined);
    } catch (error) {
      toast.error('خطا در ذخیره سابقه تحصیلی');
    }
  };

  const handleDeleteEducation = async (eduId: string) => {
    if (!confirm('آیا از حذف این مورد اطمینان دارید؟')) return;
    try {
      await deleteEducation.mutateAsync(eduId);
      toast.success('سابقه تحصیلی حذف شد');
    } catch {
      toast.error('خطا در حذف سابقه تحصیلی');
    }
  };

  // Handlers - Experience
  const handleAddExperience = () => {
    setEditingExperience(undefined);
    setIsExperienceModalOpen(true);
  };

  const handleEditExperience = (experience: WorkExperience) => {
    setEditingExperience(experience);
    setIsExperienceModalOpen(true);
  };

  const handleSubmitExperience = async (experience: WorkExperience) => {
    try {
      if (editingExperience?._id) {
        await updateExperience.mutateAsync({ expId: editingExperience._id, experience });
        toast.success('سابقه کاری به‌روزرسانی شد');
      } else {
        await addExperience.mutateAsync(experience);
        toast.success('سابقه کاری اضافه شد');
      }
      setIsExperienceModalOpen(false);
      setEditingExperience(undefined);
    } catch {
      toast.error('خطا در ذخیره سابقه کاری');
    }
  };

  const handleDeleteExperience = async (expId: string) => {
    if (!confirm('آیا از حذف این مورد اطمینان دارید؟')) return;
    try {
      await deleteExperience.mutateAsync(expId);
      toast.success('سابقه کاری حذف شد');
    } catch {
      toast.error('خطا در حذف سابقه کاری');
    }
  };

  // Handlers - Skills
  const handleAddSkill = async (skill: Skill) => {
    try {
      await addSkill.mutateAsync(skill);
      toast.success('مهارت اضافه شد');
      // Force refetch to update UI
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
    } catch {
      toast.error('خطا در افزودن مهارت');
    }
  };

  const handleEditSkill = async (skill: Skill) => {
    try {
      if (!skill._id) {
        throw new Error('شناسه مهارت یافت نشد');
      }
      
      console.log('🔄 Editing skill:', { skillId: skill._id, skill });
      
      // Wait for mutation to complete
      const result = await updateSkill.mutateAsync({ skillId: skill._id, skill });
      
      console.log('✅ Skill updated, result:', result);
      
      toast.success('مهارت به‌روزرسانی شد');
      
      // The mutation already updates the cache via setQueryData
      // But we also invalidate to ensure consistency
      await queryClient.invalidateQueries({ queryKey: ['profile', userId] });
      
    } catch (error: any) {
      console.error('❌ Error editing skill:', error);
      toast.error(error.message || 'خطا در ویرایش مهارت');
      throw error; // Re-throw so the modal doesn't close
    }
  };

  const handleDeleteSkill = async (skillId: string) => {
    try {
      await deleteSkill.mutateAsync(skillId);
      toast.success('مهارت حذف شد');
      // Force refetch to update UI
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
    } catch {
      toast.error('خطا در حذف مهارت');
    }
  };

  // Handlers - Certifications
  const handleSubmitCertification = async (certification: Certification) => {
    try {
      await addCertification.mutateAsync(certification);
      toast.success('گواهینامه اضافه شد');
      setIsCertificationModalOpen(false);
    } catch {
      toast.error('خطا در ذخیره گواهینامه');
    }
  };

  const handleDeleteCertification = async (certId: string) => {
    if (!confirm('آیا از حذف این مورد اطمینان دارید؟')) return;
    try {
      await deleteCertification.mutateAsync(certId);
      toast.success('گواهینامه حذف شد');
    } catch {
      toast.error('خطا در حذف گواهینامه');
    }
  };

  // Handlers - Other
  const handleSaveSocialLinks = async (socialLinks: any) => {
    try {
      await updateSocialLinks.mutateAsync(socialLinks);
      toast.success('لینک‌های اجتماعی به‌روزرسانی شدند');
    } catch {
      toast.error('خطا در ذخیره لینک‌ها');
    }
  };

  const handleUploadPhoto = async (file: File | string) => {
    try {
      console.log('📸 Starting photo upload...', { userId, hasFile: !!file });
      
      if (!userId) {
        throw new Error('شناسه کاربر یافت نشد. لطفاً دوباره وارد شوید.');
      }
      
      await uploadAvatar.mutateAsync(file);
      console.log('✅ Photo uploaded successfully');
      toast.success('عکس پروفایل به‌روزرسانی شد');
      setIsPhotoModalOpen(false);
    } catch (error: any) {
      console.error('❌ Photo upload failed:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      const errorMessage = error.response?.data?.error || error.message || 'خطا در آپلود عکس';
      toast.error(errorMessage);
    }
  };

  const handleProfileUpdate = () => {
    queryClient.invalidateQueries({ queryKey: ['profile', userId] });
    toast.success('پروفایل با موفقیت به‌روزرسانی شد');
  };

  // Computed
  const getCompletionItems = () => [
    {
      id: 'bio',
      label: 'افزودن بیوگرافی',
      completed: !!profile?.bio && profile.bio.length > 20,
      action: () => setIsEditProfileModalOpen(true),
    },
    {
      id: 'education',
      label: 'افزودن حداقل یک مدرک تحصیلی',
      completed: (profile?.educationHistory?.length || 0) > 0,
      action: handleAddEducation,
    },
    {
      id: 'experience',
      label: 'افزودن حداقل یک تجربه کاری',
      completed: (profile?.workExperience?.length || 0) > 0,
      action: handleAddExperience,
    },
    {
      id: 'skills',
      label: 'افزودن حداقل 3 مهارت',
      completed: (profile?.skills?.length || 0) >= 3,
      // Skills tab activation logic would be in view
    },
    {
      id: 'certifications',
      label: 'افزودن حداقل یک گواهینامه',
      completed: (profile?.certifications?.length || 0) > 0,
      action: () => setIsCertificationModalOpen(true),
    },
    {
      id: 'social',
      label: 'افزودن لینک‌های اجتماعی',
      completed: !!(profile?.socialLinks?.linkedin || profile?.socialLinks?.github),
      // Social tab activation logic would be in view
    },
  ];

  return {
    userId,
    profile,
    isLoading,
    
    // Modal States
    isEducationModalOpen,
    setIsEducationModalOpen,
    editingEducation,
    setEditingEducation,
    isExperienceModalOpen,
    setIsExperienceModalOpen,
    editingExperience,
    setEditingExperience,
    isCertificationModalOpen,
    setIsCertificationModalOpen,
    isEditProfileModalOpen,
    setIsEditProfileModalOpen,
    isPhotoModalOpen,
    setIsPhotoModalOpen,

    // Loading States
    isEducationLoading: addEducation.isPending || updateEducation.isPending,
    isExperienceLoading: addExperience.isPending || updateExperience.isPending,
    isCertificationLoading: addCertification.isPending,
    isSkillLoading: addSkill.isPending || updateSkill.isPending || deleteSkill.isPending,
    isSocialLoading: updateSocialLinks.isPending,
    isPhotoLoading: uploadAvatar.isPending,

    // Action Handlers
    handleAddEducation,
    handleEditEducation,
    handleSubmitEducation,
    handleDeleteEducation,
    handleAddExperience,
    handleEditExperience,
    handleSubmitExperience,
    handleDeleteExperience,
    handleAddSkill,
    handleEditSkill,
    handleDeleteSkill,
    handleSubmitCertification,
    handleDeleteCertification,
    handleSaveSocialLinks,
    handleUploadPhoto,
    handleProfileUpdate,
    getCompletionItems,
  };
};
