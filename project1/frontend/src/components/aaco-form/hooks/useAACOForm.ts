/**
 * Main form state management hook for AACO Application
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
import { AACOFormData, ExistingApplication } from '../types/form.types';
import { INITIAL_FORM_DATA } from '../constants/form.constants';

export const useAACOForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<AACOFormData>(INITIAL_FORM_DATA);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [existingApplication, setExistingApplication] = useState<ExistingApplication | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    loadExistingApplication();
  }, []);

  const loadExistingApplication = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/aaco-applications/my-application');
      
      if (response.data.application) {
        const app = response.data.application;
        setExistingApplication(app);
        setIsEditMode(true);
        
        setFormData({
          firstName: app.firstName || '',
          lastName: app.lastName || '',
          email: app.email || '',
          phone: app.phone || '',
          city: app.city || '',
          university: app.university || '',
          major: app.major || '',
          degree: app.degree || '',
          graduationYear: app.graduationYear || '',
          startupIdea: app.startupIdea || '',
          businessModel: app.businessModel || '',
          targetMarket: app.targetMarket || '',
          teamSize: app.teamSize || '',
          teamMembers: app.teamMembers || '',
          skills: app.skills || [],
          motivation: app.motivation || '',
          goals: app.goals || '',
          experience: app.experience || '',
          expectations: app.expectations || ''
        });
      }
    } catch (error: any) {
      if (error.response?.status !== 404) {
        console.error('Error loading application:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: keyof AACOFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      let response;
      
      if (isEditMode && existingApplication) {
        response = await api.put(`/aaco-applications/${existingApplication._id}`, formData);
        toast.success('درخواست شما با موفقیت به‌روزرسانی شد!');
        
        if (existingApplication.status === 'approved') {
          toast('توجه: درخواست شما مجدداً در انتظار بررسی قرار گرفت.', {
            icon: '⚠️',
            duration: 5000,
          });
        }
      } else {
        response = await api.post('/aaco-applications/submit', formData);
        toast.success('درخواست شما با موفقیت ثبت شد!');
      }

      if (response.data.success) {
        localStorage.removeItem('aaco_banner_dismissed');
        // Set flag to trigger refetch in other pages
        localStorage.setItem('aaco_application_updated', Date.now().toString());
        navigate('/pending');
      } else {
        throw new Error(response.data.error || 'Failed to submit application');
      }
    } catch (error: any) {
      console.error('Submit error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'خطا در ثبت درخواست';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    currentStep,
    isSubmitting,
    isLoading,
    existingApplication,
    isEditMode,
    updateFormData,
    handleNext,
    handlePrevious,
    handleSubmit,
    setCurrentStep
  };
};
