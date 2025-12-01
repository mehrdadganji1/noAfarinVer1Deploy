export type AchievementCategory =
  | 'project'
  | 'course'
  | 'community'
  | 'milestone'
  | 'team';

export type AchievementType = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface Achievement {
  _id: string;
  title: string;
  titleFa: string;
  description: string;
  descriptionFa: string;
  icon: string;
  category: AchievementCategory;
  type: AchievementType;
  points: number;
  requirement: {
    type: string;
    value: number;
    description: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserAchievement {
  _id: string;
  userId: string;
  achievementId: Achievement;
  unlockedAt?: string;
  progress: number;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AchievementStats {
  totalPoints: number;
  completedCount: number;
  totalCount: number;
}

export interface UserAchievementsResponse {
  achievements: UserAchievement[];
  stats: AchievementStats;
}
