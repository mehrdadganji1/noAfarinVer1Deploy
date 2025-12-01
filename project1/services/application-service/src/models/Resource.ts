import mongoose from 'mongoose';
const { Schema } = mongoose;

export interface IResource extends mongoose.Document {
  title: string;
  description: string;
  category: 'document' | 'video' | 'link' | 'book' | 'course' | 'tool';
  type: 'public' | 'members_only' | 'applicants';
  fileUrl?: string;
  externalUrl?: string;
  thumbnailUrl?: string;
  tags: string[];
  author?: {
    userId: mongoose.Types.ObjectId;
    name: string;
  };
  downloads: number;
  views: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const resourceSchema = new Schema<IResource>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['document', 'video', 'link', 'book', 'course', 'tool'],
      required: true,
    },
    type: {
      type: String,
      enum: ['public', 'members_only', 'applicants'],
      default: 'public',
    },
    fileUrl: String,
    externalUrl: String,
    thumbnailUrl: String,
    tags: [String],
    author: {
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      name: String,
    },
    downloads: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
resourceSchema.index({ category: 1, isActive: 1 });
resourceSchema.index({ type: 1, isActive: 1 });
resourceSchema.index({ tags: 1 });

export default mongoose.model<IResource>('Resource', resourceSchema);
