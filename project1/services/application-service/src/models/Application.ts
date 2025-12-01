import mongoose from 'mongoose';
const { Schema } = mongoose;

export interface IApplication extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    nationalId: string;
    birthDate: Date;
    gender: 'male' | 'female' | 'other';
    address: string;
    city: string;
    province: string;
    postalCode: string;
  };
  educationInfo: {
    university: string;
    major: string;
    degree: 'diploma' | 'associate' | 'bachelor' | 'master' | 'phd';
    studentId: string;
    gpa: number;
    graduationYear: number;
    isCurrentStudent: boolean;
  };
  technicalInfo: {
    skills: string[];
    programmingLanguages: string[];
    frameworks: string[];
    tools: string[];
    experience: string;
    portfolio?: string;
    github?: string;
    linkedin?: string;
  };
  motivation: {
    whyJoin: string;
    goals: string;
    contribution: string;
    availability: string;
  };
  documents: {
    resume?: string;
    transcript?: string;
    idCard?: string;
    photo?: string;
  };
  status: 'draft' | 'submitted' | 'under_review' | 'interview_scheduled' | 'accepted' | 'rejected' | 'withdrawn';
  reviewNotes?: string;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  submittedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const applicationSchema = new Schema<IApplication>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    personalInfo: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      nationalId: { type: String, required: true },
      birthDate: { type: Date, required: true },
      gender: { type: String, enum: ['male', 'female', 'other'], required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      province: { type: String, required: true },
      postalCode: { type: String, required: true },
    },
    educationInfo: {
      university: { type: String, required: true },
      major: { type: String, required: true },
      degree: { type: String, enum: ['diploma', 'associate', 'bachelor', 'master', 'phd'], required: true },
      studentId: { type: String, required: true },
      gpa: { type: Number, required: true },
      graduationYear: { type: Number, required: true },
      isCurrentStudent: { type: Boolean, default: true },
    },
    technicalInfo: {
      skills: [String],
      programmingLanguages: [String],
      frameworks: [String],
      tools: [String],
      experience: String,
      portfolio: String,
      github: String,
      linkedin: String,
    },
    motivation: {
      whyJoin: String,
      goals: String,
      contribution: String,
      availability: String,
    },
    documents: {
      resume: String,
      transcript: String,
      idCard: String,
      photo: String,
    },
    status: {
      type: String,
      enum: ['draft', 'submitted', 'under_review', 'interview_scheduled', 'accepted', 'rejected', 'withdrawn'],
      default: 'draft',
      index: true,
    },
    reviewNotes: String,
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: Date,
    submittedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes
applicationSchema.index({ userId: 1, status: 1 });
applicationSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model<IApplication>('Application', applicationSchema);
