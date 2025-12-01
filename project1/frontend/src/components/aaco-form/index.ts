/**
 * AACO Form Components - Main Export File
 */

// Hooks
export { useAACOForm } from './hooks/useAACOForm';
export { useFormValidation } from './hooks/useFormValidation';

// Shared Components
export { FormHeader } from './shared/FormHeader';
export { EditModeBadge } from './shared/EditModeBadge';
export { StatusIndicator, ApprovedWarning } from './shared/StatusIndicator';
export { StepNavigation } from './shared/StepNavigation';
export { SkillSelector } from './shared/SkillSelector';

// Step Components
export { PersonalInfoStep } from './steps/PersonalInfoStep';
export { EducationStep } from './steps/EducationStep';
export { IdeaTeamStep } from './steps/IdeaTeamStep';
export { MotivationStep } from './steps/MotivationStep';

// Types
export type { AACOFormData, FormErrors, StepConfig, ExistingApplication } from './types/form.types';

// Constants
export { INITIAL_FORM_DATA, STEPS, AVAILABLE_SKILLS, DEGREE_OPTIONS, TEAM_SIZE_OPTIONS } from './constants/form.constants';
