import mongoose from 'mongoose';

export enum FAQCategory {
  GENERAL = 'general',
  APPLICATION = 'application',
  DOCUMENTS = 'documents',
  INTERVIEW = 'interview',
  APPROVAL = 'approval',
  TECHNICAL = 'technical'
}

export interface IFAQ extends mongoose.Document {
  question: string;
  answer: string;
  category: FAQCategory;
  tags: string[];
  helpfulCount: number;
  notHelpfulCount: number;
  views: number;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FAQSchema: mongoose.Schema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300
    },
    answer: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000
    },
    category: {
      type: String,
      enum: Object.values(FAQCategory),
      required: true,
      index: true
    },
    tags: [{
      type: String,
      trim: true
    }],
    helpfulCount: {
      type: Number,
      default: 0,
      min: 0
    },
    notHelpfulCount: {
      type: Number,
      default: 0,
      min: 0
    },
    views: {
      type: Number,
      default: 0,
      min: 0
    },
    order: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Indexes for better query performance
FAQSchema.index({ category: 1, order: 1 });
FAQSchema.index({ isActive: 1, views: -1 });
FAQSchema.index({ question: 'text', answer: 'text', tags: 'text' });

// Virtual for helpfulness ratio
FAQSchema.virtual('helpfulnessRatio').get(function(this: IFAQ) {
  const total = this.helpfulCount + this.notHelpfulCount;
  if (total === 0) return 0;
  return (this.helpfulCount / total) * 100;
});

export default mongoose.model<IFAQ>('FAQ', FAQSchema);
