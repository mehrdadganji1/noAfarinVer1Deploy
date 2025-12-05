import mongoose, { Document, Schema } from 'mongoose';

export interface IUserAchievement extends Document {
  userId: string;
  achievementId: mongoose.Types.ObjectId;
  unlockedAt: Date;
  progress: number;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserAchievementSchema = new Schema<IUserAchievement>(
  {
    userId: { type: String, required: true },
    achievementId: {
      type: Schema.Types.ObjectId,
      ref: 'Achievement',
      required: true,
    },
    unlockedAt: { type: Date },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    isCompleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

UserAchievementSchema.index({ userId: 1, achievementId: 1 }, { unique: true });

export default mongoose.model<IUserAchievement>(
  'UserAchievement',
  UserAchievementSchema
);
