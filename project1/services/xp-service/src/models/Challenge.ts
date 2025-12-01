import mongoose, { Document, Schema } from 'mongoose';

export enum ChallengeType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  SPECIAL = 'special',
}

export enum ChallengeCategory {
  PROJECTS = 'projects',
  EVENTS = 'events',
  COURSES = 'courses',
  SOCIAL = 'social',
  PROFILE = 'profile',
  GENERAL = 'general',
}

export enum ChallengeDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export interface IChallenge extends Document {
  title: string;
  description: string;
  type: ChallengeType;
  category: ChallengeCategory;
  difficulty: ChallengeDifficulty;
  requirements: {
    action: string; // 'create_project', 'attend_event', 'complete_course', etc.
    count: number;
    metadata?: any;
  };
  rewards: {
    xp: number;
    badge?: string;
    title?: string;
  };
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  maxCompletions?: number; // null = unlimited
  currentCompletions: number;
  createdAt: Date;
  updatedAt: Date;
}

const ChallengeSchema = new Schema<IChallenge>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(ChallengeType),
      required: true,
      index: true,
    },
    category: {
      type: String,
      enum: Object.values(ChallengeCategory),
      required: true,
      index: true,
    },
    difficulty: {
      type: String,
      enum: Object.values(ChallengeDifficulty),
      required: true,
    },
    requirements: {
      action: {
        type: String,
        required: true,
      },
      count: {
        type: Number,
        required: true,
        min: 1,
      },
      metadata: Schema.Types.Mixed,
    },
    rewards: {
      xp: {
        type: Number,
        required: true,
        min: 0,
      },
      badge: String,
      title: String,
    },
    startDate: {
      type: Date,
      required: true,
      index: true,
    },
    endDate: {
      type: Date,
      required: true,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    maxCompletions: {
      type: Number,
      default: null,
    },
    currentCompletions: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for active challenges
ChallengeSchema.index({ isActive: 1, startDate: 1, endDate: 1 });
ChallengeSchema.index({ type: 1, isActive: 1 });

export default mongoose.model<IChallenge>('Challenge', ChallengeSchema);
