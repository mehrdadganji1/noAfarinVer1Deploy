export interface UserXP {
  userId: string;
  currentXP: number;
  totalXP: number;
  level: number;
  xpToNextLevel: number;
  levelProgress: number;
  xpMultiplier: number;
  rank: string;
}

export interface XPTransaction {
  amount: number;
  source: string;
  sourceId?: string;
  description: string;
  multiplier: number;
  timestamp: string;
}

export interface XPHistory {
  history: XPTransaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface LevelInfo {
  level: number;
  xpRequired: number;
  totalXPRequired: number;
  rewards: LevelReward[];
  rankTitle: string;
}

export interface LevelReward {
  type: string;
  value: number;
  description: string;
}

export interface XPGainResult {
  xpGained: number;
  currentXP: number;
  totalXP: number;
  level: number;
  leveledUp: boolean;
  oldLevel: number;
  newLevel: number;
  xpToNextLevel: number;
  levelProgress: number;
  rewards: LevelReward[];
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar?: string;
  level: number;
  totalXP: number;
  rankTitle: string;
}

export interface MyRank {
  rank: number;
  total: number;
  percentile: number;
  level: number;
  totalXP: number;
  rankTitle: string;
}
