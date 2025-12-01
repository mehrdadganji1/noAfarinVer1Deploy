import mongoose, { Schema, Document } from 'mongoose';

export enum ProjectStatus {
  PLANNING = 'planning',
  IN_PROGRESS = 'in-progress',
  REVIEW = 'review',
  COMPLETED = 'completed',
}

export interface IProject extends Document {
  title: string;
  description: string;
  category: string;
  status: ProjectStatus;
  progress: number; // 0-100
  team: {
    name: string;
    leader: mongoose.Types.ObjectId;
    members: mongoose.Types.ObjectId[];
    maxMembers: number;
  };
  startDate: Date;
  deadline: Date;
  technologies: string[];
  tasks: {
    title: string;
    completed: boolean;
    assignedTo?: mongoose.Types.ObjectId;
  }[];
  createdBy: mongoose.Types.ObjectId;
  thumbnail?: string;
  repository?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(ProjectStatus),
      default: ProjectStatus.PLANNING,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    team: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      leader: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      members: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
      }],
      maxMembers: {
        type: Number,
        required: true,
        min: 1,
      },
    },
    startDate: {
      type: Date,
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    technologies: [{
      type: String,
      trim: true,
    }],
    tasks: [{
      title: {
        type: String,
        required: true,
      },
      completed: {
        type: Boolean,
        default: false,
      },
      assignedTo: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    }],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    thumbnail: {
      type: String,
    },
    repository: {
      type: String,
    },
    tags: [{
      type: String,
    }],
  },
  {
    timestamps: true,
  }
);

// Auto-calculate progress based on completed tasks
ProjectSchema.pre('save', function(next) {
  if (this.tasks && this.tasks.length > 0) {
    const completedTasks = this.tasks.filter(task => task.completed).length;
    this.progress = Math.round((completedTasks / this.tasks.length) * 100);
  }
  next();
});

export default mongoose.model<IProject>('Project', ProjectSchema);
