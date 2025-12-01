import mongoose, { Document, Schema } from 'mongoose';

export enum ActivityType {
  APPLICATION = 'application',
  DOCUMENT = 'document',
  INTERVIEW = 'interview',
  MESSAGE = 'message',
  STATUS = 'status',
  PROFILE = 'profile',
  NOTIFICATION = 'notification'
}

export enum ActivityStatus {
  SUCCESS = 'success',
  PENDING = 'pending',
  ERROR = 'error',
  INFO = 'info'
}

export interface IActivity extends Document {
  userId: mongoose.Types.ObjectId;
  type: ActivityType;
  title: string;
  description: string;
  status: ActivityStatus;
  metadata?: Record<string, any>;
  relatedId?: mongoose.Types.ObjectId; // ID of related entity (application, document, etc.)
  createdAt: Date;
  updatedAt: Date;
}

const ActivitySchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    type: {
      type: String,
      enum: Object.values(ActivityType),
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },
    status: {
      type: String,
      enum: Object.values(ActivityStatus),
      required: true,
      default: ActivityStatus.INFO
    },
    metadata: {
      type: Map,
      of: Schema.Types.Mixed,
      default: {}
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Indexes for better query performance
ActivitySchema.index({ userId: 1, createdAt: -1 });
ActivitySchema.index({ userId: 1, type: 1 });
ActivitySchema.index({ userId: 1, status: 1 });

export default mongoose.model<IActivity>('Activity', ActivitySchema);
