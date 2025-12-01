import mongoose, { Schema, Document } from 'mongoose';

export interface ITraining extends Document {
  title: string;
  description: string;
  type: 'course' | 'workshop' | 'webinar';
  instructor: string;
  instructorBio?: string;
  duration: number; // in hours
  level: 'beginner' | 'intermediate' | 'advanced';
  topics: string[];
  materials: string[];
  enrolledUsers: mongoose.Types.ObjectId[];
  completedUsers: mongoose.Types.ObjectId[];
  capacity?: number;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  prerequisites?: string[];
  objectives?: string[];
  startDate?: Date;
  endDate?: Date;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TrainingSchema = new Schema<ITraining>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, maxlength: 2000 },
    type: { type: String, enum: ['course', 'workshop', 'webinar'], required: true },
    instructor: { type: String, required: true },
    instructorBio: { type: String },
    duration: { type: Number, required: true, min: 1 },
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    topics: [{ type: String }],
    materials: [{ type: String }],
    enrolledUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    completedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    capacity: { type: Number, min: 1 },
    status: { type: String, enum: ['draft', 'active', 'completed', 'cancelled'], default: 'draft' },
    prerequisites: [{ type: String }],
    objectives: [{ type: String }],
    startDate: { type: Date },
    endDate: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ITraining>('Training', TrainingSchema);
