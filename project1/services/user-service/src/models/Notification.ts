import mongoose, { Schema, Document } from 'mongoose'

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId
  type: 'achievement' | 'project' | 'milestone' | 'team' | 'event' | 'course' | 'community' | 'system' | 'application' | 'training' | 'evaluation' | 'funding' | 'role-change' | 'status-change'
  priority: 'urgent' | 'high' | 'medium' | 'low'
  title: string
  message: string
  link?: string
  metadata?: Record<string, any>
  isRead: boolean
  readAt?: Date
  createdAt: Date
  updatedAt: Date
}

const NotificationSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['achievement', 'project', 'milestone', 'team', 'event', 'course', 'community', 'system', 'application', 'training', 'evaluation', 'funding', 'role-change', 'status-change'],
      required: true,
      index: true,
    },
    priority: {
      type: String,
      enum: ['urgent', 'high', 'medium', 'low'],
      default: 'medium',
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      trim: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

// Indexes for better query performance
NotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 })
NotificationSchema.index({ userId: 1, type: 1, createdAt: -1 })
NotificationSchema.index({ userId: 1, priority: 1, createdAt: -1 })

export default mongoose.model<INotification>('Notification', NotificationSchema)
