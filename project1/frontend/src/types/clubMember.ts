/**
 * Club Member Types
 * Types for Club Membership system
 */

export enum MembershipLevel {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum',
}

export enum MembershipStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

export interface MembershipInfo {
  memberId: string;
  memberSince: Date | string;
  membershipLevel: MembershipLevel;
  points: number;
  status: MembershipStatus;
  promotedBy?: string;
  promotedAt?: Date | string;
  lastActivityAt?: Date | string;
}

export interface MemberStats {
  eventsAttended: number;
  projectsCompleted: number;
  coursesCompleted: number;
  achievementsEarned: number;
  totalPoints: number;
  rank?: number;
  membershipDays?: number;
}

export interface ClubMember {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  phoneNumber?: string;
  university?: string;
  major?: string;
  bio?: string;
  membershipInfo?: MembershipInfo;
  memberStats?: MemberStats;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface PromotionRequest {
  userId: string;
}

export interface PromotionResponse {
  success: boolean;
  message: string;
  data?: {
    userId: string;
    memberId: string;
    memberSince: Date | string;
    membershipLevel: MembershipLevel;
  };
}

export interface MemberListParams {
  page?: number;
  limit?: number;
  level?: MembershipLevel;
  status?: MembershipStatus;
  sortBy?: 'memberSince' | 'points';
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface MemberListResponse {
  success: boolean;
  data: ClubMember[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface MemberStatsResponse {
  success: boolean;
  data: {
    membershipInfo: MembershipInfo;
    stats: MemberStats;
  };
}

export interface UpdateLevelRequest {
  level: MembershipLevel;
}

export interface UpdateStatusRequest {
  status: MembershipStatus;
  reason?: string;
}

export interface PromotionHistory {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  membershipInfo: MembershipInfo;
}

export interface PromotionHistoryResponse {
  success: boolean;
  data: PromotionHistory[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

// Helper functions
export const getMembershipLevelLabel = (level: MembershipLevel): string => {
  const labels: Record<MembershipLevel, string> = {
    [MembershipLevel.BRONZE]: 'برنز',
    [MembershipLevel.SILVER]: 'نقره',
    [MembershipLevel.GOLD]: 'طلا',
    [MembershipLevel.PLATINUM]: 'پلاتین',
  };
  return labels[level];
};

export const getMembershipLevelColor = (level: MembershipLevel): string => {
  const colors: Record<MembershipLevel, string> = {
    [MembershipLevel.BRONZE]: 'text-orange-600 bg-orange-100',
    [MembershipLevel.SILVER]: 'text-gray-600 bg-gray-100',
    [MembershipLevel.GOLD]: 'text-yellow-600 bg-yellow-100',
    [MembershipLevel.PLATINUM]: 'text-purple-600 bg-purple-100',
  };
  return colors[level];
};

export const getMembershipStatusLabel = (status: MembershipStatus): string => {
  const labels: Record<MembershipStatus, string> = {
    [MembershipStatus.ACTIVE]: 'فعال',
    [MembershipStatus.INACTIVE]: 'غیرفعال',
    [MembershipStatus.SUSPENDED]: 'معلق',
  };
  return labels[status];
};

export const getMembershipStatusColor = (status: MembershipStatus): string => {
  const colors: Record<MembershipStatus, string> = {
    [MembershipStatus.ACTIVE]: 'text-green-600 bg-green-100',
    [MembershipStatus.INACTIVE]: 'text-gray-600 bg-gray-100',
    [MembershipStatus.SUSPENDED]: 'text-red-600 bg-red-100',
  };
  return colors[status];
};

export const formatMembershipDuration = (days: number): string => {
  if (days < 30) {
    return `${days} روز`;
  }
  if (days < 365) {
    const months = Math.floor(days / 30);
    return `${months} ماه`;
  }
  const years = Math.floor(days / 365);
  const remainingMonths = Math.floor((days % 365) / 30);
  if (remainingMonths > 0) {
    return `${years} سال و ${remainingMonths} ماه`;
  }
  return `${years} سال`;
};
