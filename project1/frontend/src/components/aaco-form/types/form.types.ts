/**
 * Type definitions for AACO Application Form
 */

export interface AACOFormData {
  // Step 1: Personal Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  
  // Step 2: Educational Background
  university: string;
  major: string;
  degree: string;
  graduationYear: string;
  
  // Step 3: Startup Idea & Team
  startupIdea: string;
  businessModel: string;
  targetMarket: string;
  teamSize: string;
  teamMembers: string;
  skills: string[];
  
  // Step 4: Motivation & Goals
  motivation: string;
  goals: string;
  experience: string;
  expectations: string;
}

export interface FormErrors {
  [key: string]: string | undefined;
}

export interface StepConfig {
  id: number;
  title: string;
  icon: any;
}

export interface ExistingApplication extends AACOFormData {
  _id: string;
  status: 'submitted' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}
