import mongoose, { Schema, Document } from 'mongoose';

export enum AACOApplicationStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under-review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export interface IAACOApplication extends Document {
  userId: mongoose.Types.ObjectId;
  
  // Step 1: Personal Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  
  // Step 2: Educational Background
  university: string;
  major: string;
  degree: string;
  graduationYear?: string;
  
  // Step 3: Startup Idea & Team
  startupIdea: string;
  businessModel: string;
  targetMarket: string;
  teamSize?: string;
  teamMembers?: string;
  skills: string[];
  
  // Step 4: Motivation & Goals
  motivation: string;
  goals: string;
  experience?: string;
  expectations?: string;
  
  // Status
  status: AACOApplicationStatus;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  reviewNotes?: string;
  
  // Metadata
  submittedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AACOApplicationSchema = new Schema<IAACOApplication>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // One application per user
    },
    
    // Step 1: Personal Info
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    
    // Step 2: Educational Background
    university: {
      type: String,
      required: true,
      trim: true,
    },
    major: {
      type: String,
      required: true,
      trim: true,
    },
    degree: {
      type: String,
      required: true,
      enum: ['diploma', 'associate', 'bachelor', 'master', 'phd'],
    },
    graduationYear: {
      type: String,
      trim: true,
    },
    
    // Step 3: Startup Idea & Team
    startupIdea: {
      type: String,
      required: true,
      trim: true,
    },
    businessModel: {
      type: String,
      required: true,
      trim: true,
    },
    targetMarket: {
      type: String,
      required: true,
      trim: true,
    },
    teamSize: {
      type: String,
      enum: ['1', '2-3', '4-5', '6+'],
    },
    teamMembers: {
      type: String,
      trim: true,
    },
    skills: [{
      type: String,
      trim: true,
    }],
    
    // Step 4: Motivation & Goals
    motivation: {
      type: String,
      required: true,
      trim: true,
    },
    goals: {
      type: String,
      required: true,
      trim: true,
    },
    experience: {
      type: String,
      trim: true,
    },
    expectations: {
      type: String,
      trim: true,
    },
    
    // Status
    status: {
      type: String,
      enum: Object.values(AACOApplicationStatus),
      default: AACOApplicationStatus.DRAFT,
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: {
      type: Date,
    },
    reviewNotes: {
      type: String,
      trim: true,
    },
    
    // Metadata
    submittedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
AACOApplicationSchema.index({ userId: 1 });
AACOApplicationSchema.index({ status: 1 });
AACOApplicationSchema.index({ createdAt: -1 });
AACOApplicationSchema.index({ email: 1 });

export default mongoose.model<IAACOApplication>('AACOApplication', AACOApplicationSchema);
