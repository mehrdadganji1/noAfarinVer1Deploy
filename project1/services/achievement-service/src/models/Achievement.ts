import mongoose, { Document, Schema } from 'mongoose';

export interface IAchievement extends Document {
  title: string;
  titleFa: string;
  description: string;
  descriptionFa: string;
  icon: string;
  category: 'beginner' | 'project' | 'course' | 'community' | 'milestone' | 'team' | 'streak' | 'speed' | 'quality' | 'social' | 'special' | 'event' | 'skill';
  type: 'bronze' | 'silver' | 'gold' | 'platinum';
  points: number;
  requirement: {
    type: string;
    value: number;
    description: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AchievementSchema = new Schema<IAchievement>(
  {
    title: { type: String, required: true },
    titleFa: { type: String, required: true },
    description: { type: String, required: true },
    descriptionFa: { type: String, required: true },
    icon: { type: String, required: true },
    category: {
      type: String,
      enum: ['beginner', 'project', 'course', 'community', 'milestone', 'team', 'streak', 'speed', 'quality', 'social', 'special', 'event', 'skill'],
      required: true,
    },
    type: {
      type: String,
      enum: ['bronze', 'silver', 'gold', 'platinum'],
      required: true,
    },
    points: { type: Number, required: true, default: 0 },
    requirement: {
      type: {
        type: String,
        required: true,
      },
      value: {
        type: Number,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
    },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IAchievement>('Achievement', AchievementSchema);
