import mongoose, { Schema, Document } from 'mongoose';

export interface IEvaluationCriteria {
  name: string;
  description: string;
  score: number;
  maxScore: number;
  weight: number;
}

export interface IEvaluation extends Document {
  teamId: string;
  eventId?: string;
  evaluatorId: string;
  evaluationType: 'pitch' | 'progress' | 'final';
  criteria: IEvaluationCriteria[];
  totalScore: number;
  feedback?: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  status: 'draft' | 'submitted' | 'reviewed';
  submittedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const EvaluationSchema = new Schema<IEvaluation>(
  {
    teamId: {
      type: String,
      required: true,
      index: true,
    },
    eventId: {
      type: String,
      index: true,
    },
    evaluatorId: {
      type: String,
      required: true,
      index: true,
    },
    evaluationType: {
      type: String,
      enum: ['pitch', 'progress', 'final'],
      required: true,
      index: true,
    },
    criteria: [{
      name: { type: String, required: true },
      description: { type: String },
      score: { type: Number, required: true, min: 0 },
      maxScore: { type: Number, required: true },
      weight: { type: Number, default: 1, min: 0 },
    }],
    totalScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    feedback: {
      type: String,
      maxlength: 2000,
    },
    strengths: [{
      type: String,
    }],
    weaknesses: [{
      type: String,
    }],
    recommendations: [{
      type: String,
    }],
    status: {
      type: String,
      enum: ['draft', 'submitted', 'reviewed'],
      default: 'draft',
    },
    submittedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

EvaluationSchema.index({ teamId: 1, evaluatorId: 1, evaluationType: 1 });

export default mongoose.model<IEvaluation>('Evaluation', EvaluationSchema);
