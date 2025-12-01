import mongoose, { Document, Schema } from 'mongoose';

export interface IUserChallenge extends Document {
  userId: mongoose.Types.ObjectId;
  challengeId: mongoose.Types.ObjectId;
  progress: number;
  targetCount: number;
  completed: boolean;
  completedAt?: Date;
  claimedReward: boolean;
  claimedAt?: Date;
  startedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserChallengeSchema = new Schema<IUserChallenge>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    challengeId: {
      type: Schema.Types.ObjectId,
      ref: 'Challenge',
      required: true,
      index: true,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
    },
    targetCount: {
      type: Number,
      required: true,
      min: 1,
    },
    completed: {
      type: Boolean,
      default: false,
      index: true,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    claimedReward: {
      type: Boolean,
      default: false,
    },
    claimedAt: {
      type: Date,
      default: null,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes
UserChallengeSchema.index({ userId: 1, challengeId: 1 }, { unique: true });
UserChallengeSchema.index({ userId: 1, completed: 1 });
UserChallengeSchema.index({ userId: 1, claimedReward: 1 });

export default mongoose.model<IUserChallenge>('UserChallenge', UserChallengeSchema);
