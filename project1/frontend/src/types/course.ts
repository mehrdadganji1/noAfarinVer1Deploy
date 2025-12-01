// Course Types and Interfaces

export enum CourseLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

export enum CourseStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export interface CourseInstructor {
  _id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  bio?: string;
}

export interface Lesson {
  _id?: string;
  title: string;
  description?: string;
  duration: number; // minutes
  videoUrl?: string;
  order: number;
  isCompleted?: boolean;
}

export interface CourseProgress {
  userId: string;
  completedLessons: string[];
  progress: number; // 0-100
  lastAccessedAt: Date | string;
  certificateIssued?: boolean;
}

export interface CourseReview {
  _id?: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  rating: number; // 1-5
  comment: string;
  createdAt: Date | string;
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  instructor: CourseInstructor;
  level: CourseLevel;
  status: CourseStatus;
  duration: number; // total minutes
  lessons: Lesson[];
  thumbnail?: string;
  tags?: string[];
  category?: string;
  enrolledCount: number;
  rating: number;
  reviewCount: number;
  reviews?: CourseReview[];
  isEnrolled?: boolean;
  myProgress?: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CoursesListResponse {
  success: boolean;
  data: {
    courses: Course[];
    total: number;
    page: number;
    totalPages: number;
  };
}

export interface CourseStatsResponse {
  success: boolean;
  data: {
    total: number;
    published: number;
    myEnrolled: number;
    myCompleted: number;
  };
}

// Helper functions
export const getCourseLevelLabel = (level: CourseLevel): string => {
  const labels: Record<CourseLevel, string> = {
    [CourseLevel.BEGINNER]: 'مبتدی',
    [CourseLevel.INTERMEDIATE]: 'متوسط',
    [CourseLevel.ADVANCED]: 'پیشرفته',
  };
  return labels[level];
};

export const getCourseLevelColor = (level: CourseLevel): string => {
  const colors: Record<CourseLevel, string> = {
    [CourseLevel.BEGINNER]: 'green',
    [CourseLevel.INTERMEDIATE]: 'blue',
    [CourseLevel.ADVANCED]: 'purple',
  };
  return colors[level];
};
