export type RewardType = 'badge' | 'theme' | 'avatar_frame' | 'title' | 'boost' | 'feature';

export type RewardRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Reward {
  _id: string;
  title: string;
  titleFa: string;
  description: string;
  descriptionFa: string;
  type: RewardType;
  rarity: RewardRarity;
  cost: number;
  icon: string;
  preview?: string;
  isActive: boolean;
  requirements?: {
    minLevel?: number;
    achievements?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface UserReward {
  _id: string;
  userId: string;
  rewardId: Reward;
  purchasedAt: string;
  isEquipped: boolean;
}

export interface RewardsShopResponse {
  rewards: Reward[];
  userRewards: UserReward[];
  userXP: number;
}
