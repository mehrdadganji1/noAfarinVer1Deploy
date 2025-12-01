import mongoose, { Schema, Document } from 'mongoose';

export enum ProjectStatus {
  PLANNING = 'planning',
  IN_PROGRESS = 'in_progress',
  REVIEW = 'review',
  COMPLETED = 'completed',
  ON_HOLD = 'on_hold',
  CANCELLED = 'cancelled',
}

export enum ProjectCategory {
  WEB_APP = 'web_app',
  MOBILE_APP = 'mobile_app',
  AI_ML = 'ai_ml',
  IOT = 'iot',
  BLOCKCHAIN = 'blockchain',
  GAME = 'game',
  OTHER = 'other',
}

export enum MemberRole {
  LEADER = 'leader',
  DEVELOPER = 'developer',
  DESIGNER = 'designer',
  RESEARCHER = 'researcher',
  TESTER = 'tester',
  MENTOR = 'mentor',
}

export enum MilestoneStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

interface ITeamMember {
  userId: mongoose.Types.ObjectId;
  role: MemberRole;
  joinedAt: Date;
  contributions?: string;
}

interface IMilestone {
  title: string;
  description?: string;
  dueDate: Date;
  status: MilestoneStatus;
  completedAt?: Date;
  assignedTo?: mongoose.Types.ObjectId[];
}

export interface IProject extends Document {
  title: string;
  description: string;
  category: ProjectCategory;
  status: ProjectStatus;
  
  // Team
  teamMembers: ITeamMember[];
  maxTeamSize: number;
  
  // Progress
  milestones: IMilestone[];
  progress: number; // 0-100
  
  // Dates
  startDate: Date;
  endDate?: Date;
  completedAt?: Date;
  
  // Details
  technologies?: string[];
  tags?: string[];
  goals?: string;
  challenges?: string;
  achievements?: string;
  
  // Links & Resources
  repositoryUrl?: string;
  demoUrl?: string;
  documentationUrl?: string;
  thumbnail?: string;
  gallery?: string[];
  
  // Metadata
  createdBy: mongoose.Types.ObjectId;
  isPublic: boolean;
  viewCount: number;
  likeCount: number;
  
  createdAt: Date;
  updatedAt: Date;
}

const TeamMemberSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  role: {
    type: String,
    enum: Object.values(MemberRole),
    required: true,
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
  contributions: {
    type: String,
  },
});

const MilestoneSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(MilestoneStatus),
    default: MilestoneStatus.PENDING,
  },
  completedAt: {
    type: Date,
  },
  assignedTo: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
});

const ProjectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      maxlength: 3000,
    },
    category: {
      type: String,
      enum: Object.values(ProjectCategory),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(ProjectStatus),
      default: ProjectStatus.PLANNING,
    },
    teamMembers: [TeamMemberSchema],
    maxTeamSize: {
      type: Number,
      default: 5,
      min: 1,
      max: 20,
    },
    milestones: [MilestoneSchema],
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    technologies: [{
      type: String,
      trim: true,
    }],
    tags: [{
      type: String,
      trim: true,
    }],
    goals: {
      type: String,
      maxlength: 2000,
    },
    challenges: {
      type: String,
      maxlength: 2000,
    },
    achievements: {
      type: String,
      maxlength: 2000,
    },
    repositoryUrl: {
      type: String,
      trim: true,
    },
    demoUrl: {
      type: String,
      trim: true,
    },
    documentationUrl: {
      type: String,
      trim: true,
    },
    thumbnail: {
      type: String,
    },
    gallery: [{
      type: String,
    }],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
ProjectSchema.index({ title: 'text', description: 'text' });
ProjectSchema.index({ category: 1, status: 1 });
ProjectSchema.index({ 'teamMembers.userId': 1 });
ProjectSchema.index({ createdBy: 1 });

export default mongoose.model<IProject>('Project', ProjectSchema);
