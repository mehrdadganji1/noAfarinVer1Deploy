import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export enum UserRole {
  APPLICANT = 'applicant',
  CLUB_MEMBER = 'club_member',
  TEAM_LEADER = 'team-leader',
  MENTOR = 'mentor',
  JUDGE = 'judge',
  COORDINATOR = 'coordinator',
  MANAGER = 'manager',
  ADMIN = 'admin',
  DIRECTOR = 'director',
}

export enum MembershipLevel {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum',
}

export enum MembershipStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

export interface IMembershipInfo {
  memberId: string;
  memberSince: Date;
  membershipLevel: MembershipLevel;
  points: number;
  status: MembershipStatus;
  promotedBy?: mongoose.Types.ObjectId;
  promotedAt?: Date;
  lastActivityAt?: Date;
}

export interface IEducation {
  _id?: string;
  institution: string;
  degree: string;
  major: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  gpa?: number;
  achievements?: string;
}

export interface IWorkExperience {
  _id?: string;
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description?: string;
  location?: string;
}

export interface ISkill {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  endorsements: number;
  endorsedBy: mongoose.Types.ObjectId[];
}

export interface ICertification {
  _id?: string;
  name: string;
  issuer: string;
  date: Date;
  expiryDate?: Date;
  credentialId?: string;
  url?: string;
}

export interface ISocialLinks {
  linkedin?: string;
  github?: string;
  portfolio?: string;
  twitter?: string;
  other?: string;
}

export interface IMemberStats {
  eventsAttended: number;
  projectsCompleted: number;
  coursesCompleted: number;
  achievementsEarned: number;
  totalPoints: number;
  rank?: number;
}

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole[];
  phoneNumber?: string;
  phoneVerified?: boolean;
  emailVerified?: boolean;
  hasPassword?: boolean;
  university?: string;
  major?: string;
  studentId?: string;
  bio?: string;
  avatar?: string;
  expertise?: string[];
  
  // Extended Profile Fields
  educationHistory?: IEducation[];
  workExperience?: IWorkExperience[];
  skills?: ISkill[];
  certifications?: ICertification[];
  socialLinks?: ISocialLinks;
  profileCompletion?: number;
  
  // Club Membership
  membershipInfo?: IMembershipInfo;
  memberStats?: IMemberStats;
  
  isActive: boolean;
  isVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  calculateProfileCompletion(): number;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
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
    role: {
      type: [String],
      enum: Object.values(UserRole),
      default: [UserRole.APPLICANT],
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    phoneVerified: {
      type: Boolean,
      default: false,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    hasPassword: {
      type: Boolean,
      default: false,
    },
    university: {
      type: String,
      trim: true,
    },
    major: {
      type: String,
      trim: true,
    },
    studentId: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    avatar: {
      type: String,
    },
    expertise: [{
      type: String,
    }],
    
    // Extended Profile Fields
    educationHistory: [{
      institution: { type: String, required: true },
      degree: { type: String, required: true },
      major: { type: String, required: true },
      startDate: { type: Date, required: true },
      endDate: { type: Date },
      current: { type: Boolean, default: false },
      gpa: { type: Number, min: 0, max: 4 },
      achievements: { type: String, maxlength: 500 },
    }],
    
    workExperience: [{
      company: { type: String, required: true },
      position: { type: String, required: true },
      startDate: { type: Date, required: true },
      endDate: { type: Date },
      current: { type: Boolean, default: false },
      description: { type: String, maxlength: 1000 },
      location: { type: String },
    }],
    
    skills: [{
      name: { type: String, required: true, trim: true },
      level: { 
        type: String, 
        enum: ['beginner', 'intermediate', 'advanced', 'expert'],
        default: 'beginner'
      },
      endorsements: { type: Number, default: 0 },
      endorsedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    }],
    
    certifications: [{
      name: { type: String, required: true },
      issuer: { type: String, required: true },
      date: { type: Date, required: true },
      expiryDate: { type: Date },
      credentialId: { type: String },
      url: { type: String },
    }],
    
    socialLinks: {
      linkedin: { type: String },
      github: { type: String },
      portfolio: { type: String },
      twitter: { type: String },
      other: { type: String },
    },
    
    profileCompletion: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    
    // Club Membership
    membershipInfo: {
      memberId: { 
        type: String, 
        unique: true, 
        sparse: true  // Allows null values while keeping unique constraint
      },
      memberSince: { type: Date },
      membershipLevel: { 
        type: String, 
        enum: Object.values(MembershipLevel),
        default: MembershipLevel.BRONZE,
      },
      points: { 
        type: Number, 
        default: 0, 
        min: 0,
      },
      status: { 
        type: String, 
        enum: Object.values(MembershipStatus),
        default: MembershipStatus.ACTIVE,
      },
      promotedBy: { 
        type: Schema.Types.ObjectId, 
        ref: 'User',
      },
      promotedAt: { type: Date },
      lastActivityAt: { type: Date },
    },
    
    memberStats: {
      eventsAttended: { type: Number, default: 0 },
      projectsCompleted: { type: Number, default: 0 },
      coursesCompleted: { type: Number, default: 0 },
      achievementsEarned: { type: Number, default: 0 },
      totalPoints: { type: Number, default: 0 },
      rank: { type: Number },
    },
    
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      select: false,
    },
    emailVerificationExpires: {
      type: Date,
      select: false,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  
  // Note: hasPassword should be set explicitly when creating user
  // or when user sets their password via setPasswordWithOTP
  // Don't auto-set it here to avoid marking auto-generated passwords as real
  
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Calculate profile completion percentage
UserSchema.methods.calculateProfileCompletion = function (): number {
  let completion = 0;
  const totalFields = 12;
  
  // Basic fields (4 points each = 48%)
  if (this.firstName && this.lastName) completion += 8;
  if (this.email) completion += 8;
  if (this.phoneNumber) completion += 8;
  if (this.bio) completion += 8;
  if (this.avatar) completion += 8;
  if (this.university && this.major) completion += 8;
  
  // Extended fields (4 points each = 28%)
  if (this.educationHistory && this.educationHistory.length > 0) completion += 7;
  if (this.workExperience && this.workExperience.length > 0) completion += 7;
  if (this.skills && this.skills.length > 0) completion += 7;
  if (this.certifications && this.certifications.length > 0) completion += 7;
  
  // Social links (12%)
  const socialLinksCount = Object.values(this.socialLinks || {}).filter(link => link).length;
  completion += Math.min(socialLinksCount * 3, 12);
  
  // Application status (12%)
  // This will be added from application model
  
  this.profileCompletion = Math.min(completion, 100);
  return this.profileCompletion;
};

// Auto-calculate profile completion before saving
UserSchema.pre('save', function(next) {
  if (this.isModified('educationHistory') || 
      this.isModified('workExperience') || 
      this.isModified('skills') ||
      this.isModified('certifications') ||
      this.isModified('socialLinks') ||
      this.isModified('bio') ||
      this.isModified('avatar')) {
    this.calculateProfileCompletion();
  }
  next();
});

export default mongoose.model<IUser>('User', UserSchema);
