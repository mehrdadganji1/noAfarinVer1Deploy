import mongoose, { Document, Schema } from 'mongoose';

export interface IUserStreak extends Document {
  userId: mongoose.Types.ObjectId;
  currentStreak: number;
  longestStreak: number;
  lastCheckIn: Date;
  totalCheckIns: number;
  streakHistory: Array<{
    date: Date;
    maintained: boolean;
  }>;
  milestones: Array<{
    days: number;
    achievedAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const UserStreakSchema = new Schema<IUserStreak>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      index: true,
    },
    currentStreak: {
      type: Number,
      default: 0,
      min: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastCheckIn: {
      type: Date,
      default: null,
    },
    totalCheckIns: {
      type: Number,
      default: 0,
      min: 0,
    },
    streakHistory: [
      {
        date: {
          type: Date,
          required: true,
        },
        maintained: {
          type: Boolean,
          required: true,
        },
      },
    ],
    milestones: [
      {
        days: {
          type: Number,
          required: true,
        },
        achievedAt: {
          type: Date,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for leaderboard queries
UserStreakSchema.index({ currentStreak: -1 });
UserStreakSchema.index({ longestStreak: -1 });

export default mongoose.model<IUserStreak>('UserStreak', UserStreakSchema);
