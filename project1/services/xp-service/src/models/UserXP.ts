import mongoose, { Document, Schema } from 'mongoose';

export interface IXPTransaction {
  amount: number;
  source: string;
  sourceId?: string;
  description: string;
  multiplier: number;
  timestamp: Date;
}

export interface ILevelMilestone {
  level: number;
  unlockedAt: Date;
  rewards: {
    type: string;
    value: number;
    description: string;
  }[];
}

export interface IUserXP extends Document {
  userId: string;
  currentXP: number;
  totalXP: number;
  level: number;
  xpToNextLevel: number;
  levelProgress: number;
  xpMultiplier: number;
  xpHistory: IXPTransaction[];
  levelMilestones: ILevelMilestone[];
  lastXPGain: Date;
  createdAt: Date;
  updatedAt: Date;
}

const XPTransactionSchema = new Schema<IXPTransaction>({
  amount: { type: Number, required: true },
  source: { type: String, required: true },
  sourceId: { type: String },
  description: { type: String, required: true },
  multiplier: { type: Number, default: 1 },
  timestamp: { type: Date, default: Date.now },
});

const LevelMilestoneSchema = new Schema<ILevelMilestone>({
  level: { type: Number, required: true },
  unlockedAt: { type: Date, default: Date.now },
  rewards: [{
    type: { type: String, required: true },
    value: { type: Number, required: true },
    description: { type: String, required: true },
  }],
});

const UserXPSchema = new Schema<IUserXP>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    currentXP: { type: Number, default: 0, min: 0 },
    totalXP: { type: Number, default: 0, min: 0 },
    level: { type: Number, default: 1, min: 1 },
    xpToNextLevel: { type: Number, default: 100 },
    levelProgress: { type: Number, default: 0, min: 0, max: 100 },
    xpMultiplier: { type: Number, default: 1, min: 1 },
    xpHistory: [XPTransactionSchema],
    levelMilestones: [LevelMilestoneSchema],
    lastXPGain: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
UserXPSchema.index({ level: -1 });
UserXPSchema.index({ totalXP: -1 });
UserXPSchema.index({ 'xpHistory.timestamp': -1 });

export default mongoose.model<IUserXP>('UserXP', UserXPSchema);
