import { Schema, model, Document } from 'mongoose';

export enum FileRelatedType {
  TEAM = 'team',
  EVENT = 'event',
  EVALUATION = 'evaluation',
  TRAINING = 'training',
  USER = 'user',
  FUNDING = 'funding',
}

export interface IFile extends Document {
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  path: string;
  url: string;
  thumbnail?: string;
  uploadedBy: string;
  relatedTo?: {
    type: FileRelatedType;
    id: string;
  };
  metadata?: {
    width?: number;
    height?: number;
    duration?: number;
    [key: string]: any;
  };
  isPublic: boolean;
  downloads: number;
  createdAt: Date;
  updatedAt: Date;
}

const FileSchema = new Schema<IFile>(
  {
    filename: {
      type: String,
      required: true,
      unique: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    mimetype: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
    },
    uploadedBy: {
      type: String,
      required: true,
      index: true,
    },
    relatedTo: {
      type: {
        type: String,
        enum: Object.values(FileRelatedType),
      },
      id: String,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    downloads: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
FileSchema.index({ uploadedBy: 1, createdAt: -1 });
FileSchema.index({ 'relatedTo.type': 1, 'relatedTo.id': 1 });
// filename index is created by unique: true option

export default model<IFile>('File', FileSchema);
