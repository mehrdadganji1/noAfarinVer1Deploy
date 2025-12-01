/**
 * Type definitions for Application Status components
 */

export interface AACOApplication {
  _id: string;
  userId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  city?: string;
  university?: string;
  major?: string;
  degree?: string;
  graduationYear?: string;
  startupIdea?: string;
  businessModel?: string;
  targetMarket?: string;
  teamSize?: string;
  teamMembers?: string;
  skills?: string[];
  motivation?: string;
  goals?: string;
  experience?: string;
  expectations?: string;
  status: string;
  reviewedBy?: string;
  reviewedAt?: Date | string;
  reviewNotes?: string;
  submittedAt?: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
  [key: string]: any;
}

export type ApplicationStatus = 
  | 'draft'
  | 'submitted'
  | 'under-review'
  | 'approved'
  | 'rejected';

export interface StatusConfig {
  label: string;
  color: string;
  bgColor: string;
  icon: any;
  description: string;
}

export interface TimelineStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'active' | 'pending';
}
