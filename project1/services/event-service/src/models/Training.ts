import mongoose, { Schema, Document } from 'mongoose';

export interface ITraining extends Document {
  title: string;
  description: string;
  type: string;
  level: string;
  instructor: string;
  startDate: Date;
  endDate: Date;
  duration: number;
  status: string;
  capacity: number;
  participants: string[];
  location: string;
  isOnline: boolean;
  materials: string[];
  prerequisites: string[];
  rating: number;
  reviews: number;
  price: number;
  certificate: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TrainingSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true, enum: ['technical', 'soft-skills', 'management', 'design'] },
    level: { type: String, required: true, enum: ['beginner', 'intermediate', 'advanced'] },
    instructor: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    duration: { type: Number, required: true },
    status: { type: String, required: true, enum: ['upcoming', 'active', 'completed', 'cancelled'], default: 'upcoming' },
    capacity: { type: Number, required: true },
    participants: [{ type: String }],
    location: { type: String, required: true },
    isOnline: { type: Boolean, default: false },
    materials: [{ type: String }],
    prerequisites: [{ type: String }],
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    price: { type: Number, required: true },
    certificate: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITraining>('Training', TrainingSchema);
