import mongoose, { Schema, Document } from 'mongoose';

export enum FundingType {
  SEED_FUNDING = 'seed_funding',
  GRANT = 'grant',
  LOAN = 'loan',
}

export enum FundingStatus {
  PENDING = 'pending',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  DISBURSED = 'disbursed',
}

export interface IFunding extends Document {
  teamId: string;
  type: FundingType;
  amount: number;
  currency: string;
  status: FundingStatus;
  applicationDate: Date;
  approvalDate?: Date;
  disbursementDate?: Date;
  terms?: string;
  documents: string[];
  reviewerId?: string;
  reviewNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FundingSchema = new Schema<IFunding>(
  {
    teamId: { type: String, required: true, index: true },
    type: { type: String, enum: Object.values(FundingType), required: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'IRR' },
    status: { type: String, enum: Object.values(FundingStatus), default: FundingStatus.PENDING },
    applicationDate: { type: Date, default: Date.now },
    approvalDate: { type: Date },
    disbursementDate: { type: Date },
    terms: { type: String, maxlength: 2000 },
    documents: [{ type: String }],
    reviewerId: { type: String },
    reviewNotes: { type: String, maxlength: 1000 },
  },
  { timestamps: true }
);

export default mongoose.model<IFunding>('Funding', FundingSchema);
