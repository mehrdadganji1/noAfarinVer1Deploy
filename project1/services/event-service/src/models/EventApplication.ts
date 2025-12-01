import mongoose, { Schema, Document } from 'mongoose';

export enum EventApplicationStatus {
  PENDING = 'pending',
  UNDER_REVIEW = 'under-review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  WAITLIST = 'waitlist',
}

export interface IEventApplication extends Document {
  eventId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  
  // Applicant Info
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  
  // Application Details
  motivation: string;
  experience?: string;
  expectations?: string;
  teamName?: string;
  teamMembers?: string[];
  
  // Status
  status: EventApplicationStatus;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  reviewNotes?: string;
  
  // Metadata
  submittedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const EventApplicationSchema = new Schema<IEventApplication>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    
    // Applicant Info
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
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    
    // Application Details
    motivation: {
      type: String,
      required: true,
      trim: true,
      minlength: 50,
    },
    experience: {
      type: String,
      trim: true,
    },
    expectations: {
      type: String,
      trim: true,
    },
    teamName: {
      type: String,
      trim: true,
    },
    teamMembers: [{
      type: String,
      trim: true,
    }],
    
    // Status
    status: {
      type: String,
      enum: Object.values(EventApplicationStatus),
      default: EventApplicationStatus.PENDING,
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
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
EventApplicationSchema.index({ eventId: 1, userId: 1 }, { unique: true });
EventApplicationSchema.index({ status: 1 });
EventApplicationSchema.index({ createdAt: -1 });
EventApplicationSchema.index({ eventId: 1, status: 1 });

export default mongoose.model<IEventApplication>('EventApplication', EventApplicationSchema);
