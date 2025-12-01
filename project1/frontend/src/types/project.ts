// Project Types and Interfaces

export enum ProjectStatus {
  PLANNING = 'planning',
  IN_PROGRESS = 'in_progress',
  REVIEW = 'review',
  COMPLETED = 'completed',
  ON_HOLD = 'on_hold',
  CANCELLED = 'cancelled',
}

export enum ProjectCategory {
  WEB_APP = 'web_app',
  MOBILE_APP = 'mobile_app',
  AI_ML = 'ai_ml',
  IOT = 'iot',
  BLOCKCHAIN = 'blockchain',
  GAME = 'game',
  OTHER = 'other',
}

export enum MemberRole {
  LEADER = 'leader',
  DEVELOPER = 'developer',
  DESIGNER = 'designer',
  RESEARCHER = 'researcher',
  TESTER = 'tester',
  MENTOR = 'mentor',
}

export enum MilestoneStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface TeamMember {
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    email?: string;
  };
  role: MemberRole;
  joinedAt: Date | string;
  contributions?: string;
}

export interface Milestone {
  _id?: string;
  title: string;
  description?: string;
  dueDate: Date | string;
  status: MilestoneStatus;
  completedAt?: Date | string;
  assignedTo?: Array<{
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  }>;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  category: ProjectCategory;
  status: ProjectStatus;
  
  // Team
  teamMembers: TeamMember[];
  maxTeamSize: number;
  
  // Progress
  milestones: Milestone[];
  progress: number; // 0-100
  
  // Dates
  startDate: Date | string;
  endDate?: Date | string;
  completedAt?: Date | string;
  
  // Details
  technologies?: string[];
  tags?: string[];
  goals?: string;
  challenges?: string;
  achievements?: string;
  
  // Links & Resources
  repositoryUrl?: string;
  demoUrl?: string;
  documentationUrl?: string;
  thumbnail?: string;
  gallery?: string[];
  
  // Metadata
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    email?: string;
  };
  isPublic: boolean;
  viewCount: number;
  likeCount: number;
  
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ProjectsListResponse {
  success: boolean;
  data: {
    projects: Project[];
    total: number;
    page: number;
    totalPages: number;
  };
}

export interface ProjectResponse {
  success: boolean;
  data: Project;
  message?: string;
}

export interface ProjectStatsResponse {
  success: boolean;
  data: {
    total: number;
    planning: number;
    inProgress: number;
    completed: number;
    myProjects: number;
    myActiveProjects: number;
  };
}

export interface ProjectFilters {
  category?: ProjectCategory;
  status?: ProjectStatus;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateProjectInput {
  title: string;
  description: string;
  category: ProjectCategory;
  startDate: Date | string;
  endDate?: Date | string;
  maxTeamSize?: number;
  technologies?: string[];
  tags?: string[];
  goals?: string;
  repositoryUrl?: string;
  demoUrl?: string;
  documentationUrl?: string;
  thumbnail?: string;
  isPublic?: boolean;
}

export interface UpdateProjectInput extends Partial<CreateProjectInput> {
  status?: ProjectStatus;
  progress?: number;
  completedAt?: Date | string;
  challenges?: string;
  achievements?: string;
  gallery?: string[];
}

export interface JoinProjectInput {
  role?: MemberRole;
}

export interface UpdateMilestoneInput {
  status?: MilestoneStatus;
  completedAt?: Date | string;
}

// Helper Functions
export const getProjectStatusLabel = (status: ProjectStatus): string => {
  const labels: Record<ProjectStatus, string> = {
    [ProjectStatus.PLANNING]: 'در حال برنامه‌ریزی',
    [ProjectStatus.IN_PROGRESS]: 'در حال انجام',
    [ProjectStatus.REVIEW]: 'در حال بررسی',
    [ProjectStatus.COMPLETED]: 'تکمیل شده',
    [ProjectStatus.ON_HOLD]: 'متوقف شده',
    [ProjectStatus.CANCELLED]: 'لغو شده',
  };
  return labels[status] || status;
};

export const getProjectStatusColor = (status: ProjectStatus): string => {
  const colors: Record<ProjectStatus, string> = {
    [ProjectStatus.PLANNING]: 'blue',
    [ProjectStatus.IN_PROGRESS]: 'green',
    [ProjectStatus.REVIEW]: 'purple',
    [ProjectStatus.COMPLETED]: 'gray',
    [ProjectStatus.ON_HOLD]: 'orange',
    [ProjectStatus.CANCELLED]: 'red',
  };
  return colors[status] || 'gray';
};

export const getProjectCategoryLabel = (category: ProjectCategory): string => {
  const labels: Record<ProjectCategory, string> = {
    [ProjectCategory.WEB_APP]: 'اپلیکیشن وب',
    [ProjectCategory.MOBILE_APP]: 'اپلیکیشن موبایل',
    [ProjectCategory.AI_ML]: 'هوش مصنوعی و یادگیری ماشین',
    [ProjectCategory.IOT]: 'اینترنت اشیا',
    [ProjectCategory.BLOCKCHAIN]: 'بلاکچین',
    [ProjectCategory.GAME]: 'بازی',
    [ProjectCategory.OTHER]: 'سایر',
  };
  return labels[category] || category;
};

export const getProjectCategoryColor = (category: ProjectCategory): string => {
  const colors: Record<ProjectCategory, string> = {
    [ProjectCategory.WEB_APP]: 'blue',
    [ProjectCategory.MOBILE_APP]: 'purple',
    [ProjectCategory.AI_ML]: 'cyan',
    [ProjectCategory.IOT]: 'green',
    [ProjectCategory.BLOCKCHAIN]: 'amber',
    [ProjectCategory.GAME]: 'pink',
    [ProjectCategory.OTHER]: 'gray',
  };
  return colors[category] || 'gray';
};

export const getMemberRoleLabel = (role: MemberRole): string => {
  const labels: Record<MemberRole, string> = {
    [MemberRole.LEADER]: 'رهبر',
    [MemberRole.DEVELOPER]: 'توسعه‌دهنده',
    [MemberRole.DESIGNER]: 'طراح',
    [MemberRole.RESEARCHER]: 'محقق',
    [MemberRole.TESTER]: 'تستر',
    [MemberRole.MENTOR]: 'مربی',
  };
  return labels[role] || role;
};

export const getMemberRoleColor = (role: MemberRole): string => {
  const colors: Record<MemberRole, string> = {
    [MemberRole.LEADER]: 'purple',
    [MemberRole.DEVELOPER]: 'blue',
    [MemberRole.DESIGNER]: 'pink',
    [MemberRole.RESEARCHER]: 'cyan',
    [MemberRole.TESTER]: 'green',
    [MemberRole.MENTOR]: 'amber',
  };
  return colors[role] || 'gray';
};

export const getMilestoneStatusLabel = (status: MilestoneStatus): string => {
  const labels: Record<MilestoneStatus, string> = {
    [MilestoneStatus.PENDING]: 'در انتظار',
    [MilestoneStatus.IN_PROGRESS]: 'در حال انجام',
    [MilestoneStatus.COMPLETED]: 'تکمیل شده',
    [MilestoneStatus.CANCELLED]: 'لغو شده',
  };
  return labels[status] || status;
};

export const getMilestoneStatusColor = (status: MilestoneStatus): string => {
  const colors: Record<MilestoneStatus, string> = {
    [MilestoneStatus.PENDING]: 'gray',
    [MilestoneStatus.IN_PROGRESS]: 'blue',
    [MilestoneStatus.COMPLETED]: 'green',
    [MilestoneStatus.CANCELLED]: 'red',
  };
  return colors[status] || 'gray';
};

export const formatProjectDate = (date: Date | string): string => {
  return new Date(date).toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const isTeamFull = (project: Project): boolean => {
  return project.teamMembers.length >= project.maxTeamSize;
};

export const isUserInTeam = (project: Project, userId: string): boolean => {
  return project.teamMembers.some(member => member.userId._id === userId);
};

export const getUserRole = (project: Project, userId: string): MemberRole | null => {
  const member = project.teamMembers.find(m => m.userId._id === userId);
  return member ? member.role : null;
};

export const getTeamSize = (project: Project): number => {
  return project.teamMembers.length;
};

export const getSpotsLeft = (project: Project): number => {
  return project.maxTeamSize - project.teamMembers.length;
};
