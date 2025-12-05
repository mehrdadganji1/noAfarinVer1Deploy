import mongoose from 'mongoose';
const { Schema } = mongoose;

// Export InterviewStatus enum
export enum InterviewStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  RESCHEDULED = 'rescheduled',
  NO_SHOW = 'no-show',
}

export interface IInterview extends mongoose.Document {
  applicationId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  interviewDate: Date;
  interviewTime: string;
  duration: number; // minutes
  location: 'online' | 'office' | 'phone';
  meetingLink?: string;
  meetingPassword?: string;
  officeAddress?: string;
  phoneNumber?: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled' | 'no-show';
  interviewers: mongoose.Types.ObjectId[];
  interviewType: 'technical' | 'hr' | 'final' | 'panel';
  notes?: string;
  feedback?: string;
  score?: number;
  rescheduleReason?: string;
  rescheduleRequestedAt?: Date;
  rescheduleRequestedBy?: mongoose.Types.ObjectId;
  cancelledReason?: string;
  cancelledAt?: Date;
  cancelledBy?: mongoose.Types.ObjectId;
  reminderSent?: boolean;
  reminderSentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const InterviewSchema = new Schema<IInterview>(
  {
    applicationId: {
      type: Schema.Types.ObjectId,
      ref: 'Application',
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    interviewDate: {
      type: Date,
      required: true,
      index: true,
    },
    interviewTime: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      default: 60, // 60 minutes default
    },
    location: {
      type: String,
      enum: ['online', 'office', 'phone'],
      required: true,
    },
    meetingLink: String,
    meetingPassword: String,
    officeAddress: String,
    phoneNumber: String,
    status: {
      type: String,
      enum: ['scheduled', 'confirmed', 'completed', 'cancelled', 'rescheduled', 'no-show'],
      default: 'scheduled',
      index: true,
    },
    interviewers: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    interviewType: {
      type: String,
      enum: ['technical', 'hr', 'final', 'panel'],
      default: 'hr',
    },
    notes: String,
    feedback: String,
    score: {
      type: Number,
      min: 0,
      max: 100,
    },
    rescheduleReason: String,
    rescheduleRequestedAt: Date,
    rescheduleRequestedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    cancelledReason: String,
    cancelledAt: Date,
    cancelledBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
    reminderSentAt: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
InterviewSchema.index({ userId: 1, interviewDate: 1 });
InterviewSchema.index({ status: 1, interviewDate: 1 });
InterviewSchema.index({ applicationId: 1, status: 1 });

// Virtual for checking if interview is upcoming
InterviewSchema.virtual('isUpcoming').get(function(this: IInterview) {
  return this.interviewDate > new Date() && ['scheduled', 'confirmed'].includes(this.status);
});

// Virtual for checking if interview is past
InterviewSchema.virtual('isPast').get(function(this: IInterview) {
  return this.interviewDate < new Date();
});

// Method to check if interview can be rescheduled
InterviewSchema.methods.canReschedule = function(this: IInterview): boolean {
  const now = new Date();
  const interviewDateTime = new Date(this.interviewDate);
  const hoursUntilInterview = (interviewDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
  
  // Can reschedule if more than 24 hours away and status is scheduled or confirmed
  return hoursUntilInterview > 24 && ['scheduled', 'confirmed'].includes(this.status);
};

// Method to check if interview can be confirmed
InterviewSchema.methods.canConfirm = function(this: IInterview): boolean {
  return this.status === 'scheduled' && this.interviewDate > new Date();
};

export default mongoose.model<IInterview>('Interview', InterviewSchema);
