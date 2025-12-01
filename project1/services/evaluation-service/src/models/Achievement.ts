import mongoose, { Schema, Document } from 'mongoose';

export enum AchievementCategory {
  TECHNICAL = 'technical',
  ACADEMIC = 'academic',
  LEADERSHIP = 'leadership',
  PARTICIPATION = 'participation',
  COMMUNITY = 'community',
  SPECIAL = 'special',
}

export interface IAchievement extends Document {
  title: string;
  description: string;
  category: AchievementCategory;
  icon: string; // icon name from icon library
  badge?: string; // badge image URL
  points: number;
  criteria: {
    type: string; // e.g., 'events_attended', 'projects_completed'
    threshold: number; // minimum required
    description: string;
  };
  earnedBy: {
    user: mongoose.Types.ObjectId;
    earnedAt: Date;
    progress?: number; // optional progress towards achievement
  }[];
  isActive: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const AchievementSchema = new Schema<IAchievement>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    category: {
      type: String,
      enum: Object.values(AchievementCategory),
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    badge: {
      type: String,
    },
    points: {
      type: Number,
      required: true,
      min: 0,
    },
    criteria: {
      type: {
        type: String,
        required: true,
      },
      threshold: {
        type: Number,
        required: true,
        min: 1,
      },
      description: {
        type: String,
        required: true,
      },
    },
    earnedBy: [{
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      earnedAt: {
        type: Date,
        default: Date.now,
      },
      progress: {
        type: Number,
        min: 0,
        max: 100,
      },
    }],
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IAchievement>('Achievement', AchievementSchema);
