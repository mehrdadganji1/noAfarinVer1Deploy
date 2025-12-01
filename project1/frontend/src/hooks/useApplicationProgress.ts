import { useMemo } from 'react';
import { useApplicationStatus } from './useApplicationStatus';

interface ProgressStep {
  id: string;
  label: string;
  weight: number;
  completed: boolean;
}

interface ApplicationProgress {
  percentage: number;
  completedSteps: number;
  totalSteps: number;
  steps: ProgressStep[];
  missingSteps: string[];
}

/**
 * Hook for calculating application progress
 * Returns progress percentage and detailed step information
 */
export const useApplicationProgress = (): ApplicationProgress => {
  const { data: applicationData } = useApplicationStatus();
  const application = applicationData?.application;

  return useMemo(() => {
    const steps: ProgressStep[] = [
      {
        id: 'basic_info',
        label: 'اطلاعات پایه',
        weight: 20,
        completed: !!(application?.firstName && application?.lastName && application?.email)
      },
      {
        id: 'education',
        label: 'تحصیلات',
        weight: 15,
        completed: !!(application?.university && application?.major && application?.degree)
      },
      {
        id: 'experience',
        label: 'تجربه کاری',
        weight: 15,
        completed: !!(application?.previousExperience && application.previousExperience.length > 10)
      },
      {
        id: 'skills',
        label: 'مهارت‌ها',
        weight: 10,
        completed: !!(application?.technicalSkills && application.technicalSkills.length > 0)
      },
      {
        id: 'documents',
        label: 'مدارک',
        weight: 20,
        completed: !!(application?.documents && application.documents.length >= 3)
      },
      {
        id: 'submitted',
        label: 'ارسال درخواست',
        weight: 20,
        completed: application?.status !== 'draft' && !!application?.status
      }
    ];

    const completedSteps = steps.filter(step => step.completed).length;
    const totalSteps = steps.length;
    const percentage = steps.reduce((acc, step) => {
      return acc + (step.completed ? step.weight : 0);
    }, 0);

    const missingSteps = steps
      .filter(step => !step.completed)
      .map(step => step.label);

    return {
      percentage,
      completedSteps,
      totalSteps,
      steps,
      missingSteps
    };
  }, [application]);
};
