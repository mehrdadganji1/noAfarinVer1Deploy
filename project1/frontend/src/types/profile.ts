// Profile Types

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

export interface Skill {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  endorsements: number;
  endorsedBy: string[];
}

export interface Language {
  name: string;
  proficiency: 'basic' | 'conversational' | 'fluent' | 'native';
}

export interface SocialLinks {
  website?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  telegram?: string;
  portfolio?: string;
  other?: string;
}

export interface Availability {
  status: 'available' | 'busy' | 'not_available';
  lookingFor: ('collaboration' | 'mentorship' | 'job' | 'learning')[];
  preferredRoles: string[];
}

export interface VisibilitySettings {
  profile: 'public' | 'members_only' | 'private';
  email: boolean;
  phone: boolean;
  projects: boolean;
  achievements: boolean;
  skills: boolean;
}

export interface ProfileStats {
  profileViews: number;
  connectionsCount: number;
  endorsementsReceived: number;
  lastActiveAt: Date;
}

export interface ProfileCompletion {
  completion: number;
  missingFields: string[];
  completedSections: {
    basicInfo: boolean;
    contactInfo: boolean;
    bio: boolean;
    avatar: boolean;
    education: boolean;
    experience: boolean;
    skills: boolean;
    certifications: boolean;
    socialLinks: boolean;
  };
}

export const getSkillLevelLabel = (level: Skill['level']): string => {
  const labels = {
    beginner: 'مبتدی',
    intermediate: 'متوسط',
    advanced: 'پیشرفته',
    expert: 'حرفه‌ای'
  };
  return labels[level];
};

export const getSkillLevelColor = (level: Skill['level']): string => {
  const colors = {
    beginner: 'blue',
    intermediate: 'green',
    advanced: 'orange',
    expert: 'purple'
  };
  return colors[level];
};

export const getLanguageProficiencyLabel = (proficiency: Language['proficiency']): string => {
  const labels = {
    basic: 'مبتدی',
    conversational: 'مکالمه',
    fluent: 'روان',
    native: 'زبان مادری'
  };
  return labels[proficiency];
};

export const getAvailabilityStatusLabel = (status: Availability['status']): string => {
  const labels = {
    available: 'آماده همکاری',
    busy: 'مشغول',
    not_available: 'غیرفعال'
  };
  return labels[status];
};

export const getAvailabilityStatusColor = (status: Availability['status']): string => {
  const colors = {
    available: 'green',
    busy: 'orange',
    not_available: 'gray'
  };
  return colors[status];
};
