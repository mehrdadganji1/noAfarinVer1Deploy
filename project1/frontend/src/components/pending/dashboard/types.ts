/**
 * Type definitions for Pending Dashboard components
 * Following Clean Code principles with clear, descriptive types
 */

import { LucideIcon } from 'lucide-react';

/**
 * Application status types
 * Supports both regular application and AACO application statuses
 */
export type ApplicationStatus =
  | 'not_submitted'
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'under-review'  // AACO application status
  | 'interview_scheduled'
  | 'accepted'
  | 'approved'  // AACO application status
  | 'rejected'
  | 'withdrawn';

/**
 * Status information configuration
 */
export interface StatusInfo {
  text: string;
  color: string;
  icon: LucideIcon;
  description: string;
  pulse?: boolean;
}

/**
 * Timeline step configuration
 */
export interface TimelineStep {
  id: string;
  title: string;
  description?: string;
  requiredStatuses: ApplicationStatus[];
}

/**
 * Quick action configuration
 */
export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  color: string;
  badge?: string | number;
}

/**
 * Info card configuration
 */
export interface InfoCard {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

/**
 * Contact method configuration
 */
export interface ContactMethod {
  id: string;
  label: string;
  value: string;
  icon: LucideIcon;
  action: () => void;
}
