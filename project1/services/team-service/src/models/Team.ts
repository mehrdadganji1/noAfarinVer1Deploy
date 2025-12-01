import mongoose, { Schema, Document } from 'mongoose';

export enum TeamStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  IN_EVALUATION = 'in_evaluation',
  SELECTED = 'selected',
  REJECTED = 'rejected',
  GRADUATED = 'graduated',
}

export enum TeamPhase {
  IDEATION = 'ideation',
  AACO_EVENT = 'aaco_event',
  TRAINING = 'training',
  MVP_DEVELOPMENT = 'mvp_development',
  PITCH_PREPARATION = 'pitch_preparation',
  FINAL_PRESENTATION = 'final_presentation',
  PARK_ENTRY = 'park_entry',
}

export interface ITeamMember {
  userId: string;
  role: 'founder' | 'co-founder' | 'member';
  joinedAt: Date;
}

export interface ITeam extends Document {
  name: string;
  description: string;
  ideaTitle: string;
  ideaDescription: string;
  problemStatement: string;
  solution: string;
  targetMarket: string;
  technology: string[];
  members: ITeamMember[];
  mentors: string[];
  status: TeamStatus;
  phase: TeamPhase;
  score?: number;
  ranking?: number;
  logo?: string;
  pitchDeck?: string;
  mvpUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TeamSchema = new Schema<ITeam>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    ideaTitle: {
      type: String,
      required: true,
      trim: true,
    },
    ideaDescription: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    problemStatement: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    solution: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    targetMarket: {
      type: String,
      required: true,
      maxlength: 500,
    },
    technology: [{
      type: String,
    }],
    members: [{
      userId: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        enum: ['founder', 'co-founder', 'member'],
        required: true,
      },
      joinedAt: {
        type: Date,
        default: Date.now,
      },
    }],
    mentors: [{
      type: String,
    }],
    status: {
      type: String,
      enum: Object.values(TeamStatus),
      default: TeamStatus.DRAFT,
    },
    phase: {
      type: String,
      enum: Object.values(TeamPhase),
      default: TeamPhase.IDEATION,
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
    },
    ranking: {
      type: Number,
    },
    logo: {
      type: String,
    },
    pitchDeck: {
      type: String,
    },
    mvpUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

TeamSchema.index({ name: 'text', ideaTitle: 'text', description: 'text' });

export default mongoose.model<ITeam>('Team', TeamSchema);
