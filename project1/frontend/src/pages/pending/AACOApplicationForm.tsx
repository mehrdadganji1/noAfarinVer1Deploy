/**
 * AACo Event Application Form
 * Multi-step form for pre-registration in AACo (Accelerator for Advanced Companies & Organizations) event
 * Redesigned with modular components
 */


import { AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

// Custom Hooks
import { useAACOForm } from '@/components/aaco-form/hooks/useAACOForm';
import { useFormValidation } from '@/components/aaco-form/hooks/useFormValidation';

// Shared Components
import { StatusIndicator, ApprovedWarning } from '@/components/aaco-form/shared/StatusIndicator';
import { StepNavigation } from '@/components/aaco-form/shared/StepNavigation';
import { DashboardLayout } from '@/components/aaco-form/shared/DashboardLayout';
import { ProgressSidebar } from '@/components/aaco-form/shared/ProgressSidebar';
import { ModernFormCard } from '@/components/aaco-form/shared/ModernFormCard';
import { HeroSection } from '@/components/aaco-form/shared/HeroSection';

// Step Components
import { PersonalInfoStep } from '@/components/aaco-form/steps/PersonalInfoStep';
import { EducationStep } from '@/components/aaco-form/steps/EducationStep';
import { IdeaTeamStep } from '@/components/aaco-form/steps/IdeaTeamStep';
import { MotivationStep } from '@/components/aaco-form/steps/MotivationStep';

// Constants
import { STEPS } from '@/components/aaco-form/constants/form.constants';

export default function AACOApplicationForm() {
  // Custom hooks for form management
  const {
    formData,
    currentStep,
    isSubmitting,
    isLoading,
    existingApplication,
    isEditMode,
    updateFormData,
    handleNext: nextStep,
    handlePrevious: prevStep,
    handleSubmit: submitForm
  } = useAACOForm();

  const { errors, validateStep, clearError } = useFormValidation();

  // Navigation handlers with validation
  const handleNext = () => {
    if (validateStep(currentStep, formData)) {
      nextStep();
    }
  };

  const handleSubmit = async () => {
    if (validateStep(currentStep, formData)) {
      await submitForm();
    }
  };

  // Render appropriate step component
  const renderStep = () => {
    const stepProps = {
      formData,
      errors,
      onUpdate: updateFormData,
      onClearError: clearError
    };

    switch (currentStep) {
      case 1:
        return <PersonalInfoStep {...stepProps} />;
      case 2:
        return <EducationStep {...stepProps} />;
      case 3:
        return <IdeaTeamStep {...stepProps} />;
      case 4:
        return <MotivationStep {...stepProps} />;
      default:
        return null;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout
      currentStep={currentStep}
      sidebar={
        <ProgressSidebar
          currentStep={currentStep}
          totalSteps={STEPS.length}
          isEditMode={isEditMode}
        />
      }
    >
      {/* Hero Section */}
      <HeroSection isEditMode={isEditMode} />

      {/* Status Indicators & Navigation Combined */}
      <div className="mb-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Status Indicators */}
          {isEditMode && existingApplication && (
            <div className="flex-1 min-w-[200px]">
              <StatusIndicator application={existingApplication} />
              <ApprovedWarning application={existingApplication} />
            </div>
          )}
          
          {/* Navigation Buttons */}
          <div className={isEditMode && existingApplication ? '' : 'w-full'}>
            <StepNavigation
              currentStep={currentStep}
              totalSteps={STEPS.length}
              isEditMode={isEditMode}
              isSubmitting={isSubmitting}
              onPrevious={prevStep}
              onNext={handleNext}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>

      {/* Form Content */}
      <ModernFormCard
        title={STEPS[currentStep - 1].title}
        icon={STEPS[currentStep - 1].icon}
        isEditMode={isEditMode}
      >
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </ModernFormCard>
    </DashboardLayout>
  );
}
