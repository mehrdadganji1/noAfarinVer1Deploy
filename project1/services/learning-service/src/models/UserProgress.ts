import mongoose, { Schema, Document } from 'mongoose';

export interface IUserProgress extends Document {
  userId: string;
  resourceId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number;
  timeSpent: number;
  bookmarked: boolean;
  liked: boolean;
  notes: string;
  lastAccessedAt: Date;
  completedAt?: Date;
  startedAt?: Date;
}

const UserProgressSchema: Schema = new Schema({
  userId: { type: String, required: true },
  resourceId: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['not_started', 'in_progress', 'completed'],
    default: 'not_started'
  },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  timeSpent: { type: Number, default: 0 }, // in seconds
  bookmarked: { type: Boolean, default: false },
  liked: { type: Boolean, default: false },
  notes: { type: String, default: '' },
  lastAccessedAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
  startedAt: { type: Date }
}, {
  timestamps: true
});

// Compound index for efficient queries
UserProgressSchema.index({ userId: 1, resourceId: 1 }, { unique: true });

export default mongoose.model<IUserProgress>('UserProgress', UserProgressSchema);
