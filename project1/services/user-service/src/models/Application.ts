import mongoose, { Schema, Document } from 'mongoose';
import { UserRole } from './User';

export enum ApplicationStatus {
  PENDING = 'pending',
  UNDER_REVIEW = 'under-review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum DocumentStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
}

export interface IDocument {
  type: string;
  fileName: string;
  fileId: string;
  fileSize?: number;
  mimeType?: string;
  status: DocumentStatus;
  uploadedAt: Date;
  verifiedAt?: Date;
  verifiedBy?: mongoose.Types.ObjectId;
  rejectionReason?: string;
  notes?: string;
}

export interface IApplication extends Document {
  userId: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  nationalId: string;
  dateOfBirth: Date;
  
  // Educational Info
  university: string;
  major: string;
  degree: string;
  studentId?: string;
  graduationYear: number;
  
  // Submission tracking
  submittedAt?: Date;
  
  // Professional Info
  hasStartupIdea: boolean;
  startupIdea?: string;
  hasTeam: boolean;
  teamMembers?: string;
  technicalSkills: string[];
  interests: string[];
  
  // Motivation
  whyJoin: string;
  goals: string;
  previousExperience?: string;
  
  // Requested Role
  requestedRole: UserRole;
  
  // Status
  status: ApplicationStatus;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  reviewNotes?: string;
  
  // Documents
  documents: IDocument[];
  
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
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
    nationalId: {
      type: String,
      required: true,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    
    // Educational Info
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
      enum: ['دیپلم', 'کاردانی', 'کارشناسی', 'کارشناسی ارشد', 'دکتری'],
    },
    studentId: {
      type: String,
      trim: true,
    },
    graduationYear: {
      type: Number,
      required: true,
    },
    
    // Professional Info
    hasStartupIdea: {
      type: Boolean,
      required: true,
      default: false,
    },
    startupIdea: {
      type: String,
      trim: true,
    },
    hasTeam: {
      type: Boolean,
      required: true,
      default: false,
    },
    teamMembers: {
      type: String,
      trim: true,
    },
    technicalSkills: [{
      type: String,
      trim: true,
    }],
    interests: [{
      type: String,
      trim: true,
    }],
    
    // Motivation
    whyJoin: {
      type: String,
      required: true,
      trim: true,
      minlength: 50,
    },
    goals: {
      type: String,
      required: true,
      trim: true,
      minlength: 50,
    },
    previousExperience: {
      type: String,
      trim: true,
    },
    
    // Requested Role (CLUB_MEMBER is the main role after approval)
    requestedRole: {
      type: String,
      enum: [
        UserRole.CLUB_MEMBER,
        UserRole.TEAM_LEADER,
        UserRole.MENTOR,
        UserRole.JUDGE,
        UserRole.COORDINATOR,
        UserRole.MANAGER,
      ],
      required: false, // Not used anymore - all approved applicants become CLUB_MEMBER
      default: UserRole.CLUB_MEMBER,
    }, 
    
    // Status
    status: {
      type: String,
      enum: Object.values(ApplicationStatus),
      default: ApplicationStatus.PENDING,
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
    
    // Documents
    documents: [{
      type: {
        type: String,
        required: true,
      },
      fileName: {
        type: String,
        required: true,
      },
      fileId: {
        type: String,
        required: true,
      },
      fileSize: Number,
      mimeType: String,
      status: {
        type: String,
        enum: Object.values(DocumentStatus),
        default: DocumentStatus.PENDING,
      },
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
      verifiedAt: Date,
      verifiedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      rejectionReason: String,
      notes: String,
    }],
    
    // Submission tracking
    submittedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
ApplicationSchema.index({ userId: 1 });
ApplicationSchema.index({ status: 1 });
ApplicationSchema.index({ email: 1 });
ApplicationSchema.index({ createdAt: -1 });

export default mongoose.model<IApplication>('Application', ApplicationSchema);
