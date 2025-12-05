// =====================================================
// ENUMS
// =====================================================

export enum MembershipLevel {
  BRONZE = 'Bronze',
  SILVER = 'Silver',
  GOLD = 'Gold',
  PLATINUM = 'Platinum'
}

export enum AvailabilityStatus {
  AVAILABLE = 'available',
  BUSY = 'busy',
  NOT_AVAILABLE = 'not_available'
}

export enum ProfileVisibility {
  PUBLIC = 'public',
  MEMBERS_ONLY = 'members_only',
  PRIVATE = 'private'
}

export enum ActivityType {
  PROJECT_COMPLETED = 'project_completed',
  ACHIEVEMENT_EARNED = 'achievement_earned',
  EVENT_ATTENDED = 'event_attended',
  COURSE_COMPLETED = 'course_completed',
  SKILL_ADDED = 'skill_added',
  CONNECTION_MADE = 'connection_made',
  PROFILE_UPDATED = 'profile_updated',
  POST_CREATED = 'post_created'
}

export enum ReactionType {
  LIKE = 'like',
  CELEBRATE = 'celebrate',
  SUPPORT = 'support',
  LOVE = 'love'
}

export enum MessageStatus {
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read'
}

// =====================================================
// BASE INTERFACES
// =====================================================

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  university?: string;
  major?: string;
  membershipInfo?: {
    memberId: string;
    level: MembershipLevel;
    points: number;
    memberSince: string;
  };
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

export interface Availability {
  status: AvailabilityStatus;
  lookingFor: ('collaboration' | 'mentorship' | 'job' | 'learning')[];
  preferredRoles: string[];
}

export interface VisibilitySettings {
  profile: ProfileVisibility;
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
  lastActiveAt: string;
}

// =====================================================
// MEMBER PROFILE
// =====================================================

export interface MemberProfile {
  _id: string;
  userId: User;
  
  // Basic Info
  bio: string;
  headline: string;
  location: string;
  
  // Social Links
  website: string;
  github: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  telegram: string;
  
  // Professional Info
  skills: Skill[];
  interests: string[];
  languages: Language[];
  
  // Availability
  availability: Availability;
  
  // Privacy
  visibility: VisibilitySettings;
  
  // Stats
  stats: ProfileStats;
  
  // Featured Content
  featuredProjects: string[];
  featuredAchievements: string[];
  
  // Connection Status (added by API)
  isFollowing?: boolean;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileInput {
  bio?: string;
  headline?: string;
  location?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  telegram?: string;
  interests?: string[];
  availability?: Partial<Availability>;
}

export interface ProfileSearchFilters {
  search?: string;
  skill?: string;
  level?: MembershipLevel;
  location?: string;
  availability?: AvailabilityStatus;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'connectionsCount' | 'profileViews';
  sortOrder?: 'asc' | 'desc';
}

// =====================================================
// CONNECTIONS
// =====================================================

export interface Connection {
  _id: string;
  followerId: User;
  followingId: User;
  status: 'active' | 'blocked' | 'pending';
  note: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConnectionStatus {
  isFollowing: boolean;
  isFollower: boolean;
  isMutual: boolean;
}

export interface ConnectionCounts {
  followersCount: number;
  followingCount: number;
}

// =====================================================
// MESSAGES
// =====================================================

export interface MessageAttachment {
  type: 'image' | 'file' | 'link';
  url: string;
  name: string;
  size?: number;
  mimeType?: string;
}

export interface Message {
  _id: string;
  conversationId: string;
  senderId: User;
  receiverId: User;
  content: string;
  attachments: MessageAttachment[];
  status: MessageStatus;
  readAt?: string;
  deletedBy: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  conversationId: string;
  otherUser: User;
  lastMessage: {
    content: string;
    createdAt: string;
    status: MessageStatus;
    isSentByMe: boolean;
  };
  unreadCount: number;
}

export interface SendMessageInput {
  receiverId: string;
  content: string;
  attachments?: MessageAttachment[];
}

// =====================================================
// ACTIVITIES
// =====================================================

export interface Reaction {
  userId: User;
  type: ReactionType;
  createdAt: string;
}

export interface Comment {
  _id: string;
  userId: User;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface MemberActivity {
  _id: string;
  userId: User;
  type: ActivityType;
  title: string;
  description: string;
  content?: string;
  images?: string[];
  metadata: Record<string, any>;
  visibility: 'public' | 'connections' | 'private';
  reactions: Reaction[];
  comments: Comment[];
  viewsCount: number;
  sharesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateActivityInput {
  type: ActivityType;
  title: string;
  description: string;
  content?: string;
  images?: string[];
  metadata?: Record<string, any>;
  visibility?: 'public' | 'connections' | 'private';
}

export interface UpdateActivityInput {
  title?: string;
  description?: string;
  content?: string;
  images?: string[];
  visibility?: 'public' | 'connections' | 'private';
}

export interface ReactionCounts {
  like: number;
  celebrate: number;
  support: number;
  love: number;
}

// =====================================================
// COMMUNITY STATS
// =====================================================

export interface CommunityStats {
  overview: {
    totalMembers: number;
    newMembersThisMonth: number;
    totalConnections: number;
    totalActivities: number;
    activeMembers: number;
    averageConnectionsPerMember: number;
  };
  levelDistribution: {
    Bronze: number;
    Silver: number;
    Gold: number;
    Platinum: number;
  };
  topSkills: {
    name: string;
    count: number;
  }[];
}

export interface TrendingMember {
  user: User;
  stats: {
    activityCount: number;
    totalReactions: number;
    totalComments: number;
    engagementScore: number;
  };
}

export interface ActiveMember {
  user: User;
  stats: ProfileStats;
  activityScore: number;
}

export interface EngagementStats {
  dailyActivities: {
    date: string;
    activities: number;
    reactions: number;
    comments: number;
  }[];
  activityByType: Record<ActivityType, number>;
}

// =====================================================
// API RESPONSES
// =====================================================

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// =====================================================
// HELPER FUNCTIONS
// =====================================================

export const getAvailabilityLabel = (status: AvailabilityStatus): string => {
  const labels: Record<AvailabilityStatus, string> = {
    available: 'در دسترس',
    busy: 'مشغول',
    not_available: 'غیرقابل دسترس'
  };
  return labels[status] || status;
};

export const getAvailabilityColor = (status: AvailabilityStatus): string => {
  const colors: Record<AvailabilityStatus, string> = {
    available: 'green',
    busy: 'orange',
    not_available: 'gray'
  };
  return colors[status] || 'gray';
};

export const getActivityTypeLabel = (type: ActivityType): string => {
  const labels: Record<ActivityType, string> = {
    project_completed: 'پروژه تکمیل شد',
    achievement_earned: 'دستاورد کسب شد',
    event_attended: 'در رویداد شرکت کرد',
    course_completed: 'دوره تکمیل شد',
    skill_added: 'مهارت اضافه شد',
    connection_made: 'ارتباط برقرار شد',
    profile_updated: 'پروفایل به‌روزرسانی شد',
    post_created: 'پست ایجاد شد'
  };
  return labels[type] || type;
};

export const getActivityTypeColor = (type: ActivityType): string => {
  const colors: Record<ActivityType, string> = {
    project_completed: 'green',
    achievement_earned: 'amber',
    event_attended: 'blue',
    course_completed: 'purple',
    skill_added: 'cyan',
    connection_made: 'pink',
    profile_updated: 'gray',
    post_created: 'indigo'
  };
  return colors[type] || 'gray';
};

export const getReactionLabel = (type: ReactionType): string => {
  const labels: Record<ReactionType, string> = {
    like: 'پسندیدم',
    celebrate: 'تبریک',
    support: 'حمایت',
    love: 'عالی'
  };
  return labels[type] || type;
};

export const formatMessageTime = (date: string): string => {
  const messageDate = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - messageDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'اکنون';
  if (diffMins < 60) return `${diffMins} دقیقه پیش`;
  if (diffHours < 24) return `${diffHours} ساعت پیش`;
  if (diffDays < 7) return `${diffDays} روز پیش`;
  
  return messageDate.toLocaleDateString('fa-IR');
};

export const getInitials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};
