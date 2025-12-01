import mongoose, { Schema, Document } from 'mongoose';

// Skill Interface
export interface ISkill {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  endorsements: number;
  endorsedBy: mongoose.Types.ObjectId[];
}

// Language Interface
export interface ILanguage {
  name: string;
  proficiency: 'basic' | 'conversational' | 'fluent' | 'native';
}

// Availability Interface
export interface IAvailability {
  status: 'available' | 'busy' | 'not_available';
  lookingFor: ('collaboration' | 'mentorship' | 'job' | 'learning')[];
  preferredRoles: string[];
}

// Visibility Settings Interface
export interface IVisibilitySettings {
  profile: 'public' | 'members_only' | 'private';
  email: boolean;
  phone: boolean;
  projects: boolean;
  achievements: boolean;
  skills: boolean;
}

// Profile Stats Interface
export interface IProfileStats {
  profileViews: number;
  connectionsCount: number;
  endorsementsReceived: number;
  lastActiveAt: Date;
}

// Member Profile Interface
export interface IMemberProfile extends Document {
  userId: mongoose.Types.ObjectId;
  
  // Basic Info
  bio: string;
  headline: string;
  location: string;
  
  // Social Links
  website: string;
  github: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  telegram: string;
  
  // Professional Info
  skills: ISkill[];
  interests: string[];
  languages: ILanguage[];
  
  // Availability
  availability: IAvailability;
  
  // Privacy
  visibility: IVisibilitySettings;
  
  // Stats
  stats: IProfileStats;
  
  // Featured Content
  featuredProjects: mongoose.Types.ObjectId[];
  featuredAchievements: mongoose.Types.ObjectId[];
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Skill Schema
const SkillSchema = new Schema<ISkill>({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  level: { 
    type: String, 
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'intermediate'
  },
  endorsements: { 
    type: Number, 
    default: 0 
  },
  endorsedBy: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  }]
}, { _id: false });

// Language Schema
const LanguageSchema = new Schema<ILanguage>({
  name: { 
    type: String, 
    required: true 
  },
  proficiency: { 
    type: String, 
    enum: ['basic', 'conversational', 'fluent', 'native'],
    default: 'conversational'
  }
}, { _id: false });

// Availability Schema
const AvailabilitySchema = new Schema<IAvailability>({
  status: { 
    type: String, 
    enum: ['available', 'busy', 'not_available'],
    default: 'available'
  },
  lookingFor: [{ 
    type: String, 
    enum: ['collaboration', 'mentorship', 'job', 'learning']
  }],
  preferredRoles: [String]
}, { _id: false });

// Visibility Settings Schema
const VisibilitySettingsSchema = new Schema<IVisibilitySettings>({
  profile: { 
    type: String, 
    enum: ['public', 'members_only', 'private'],
    default: 'members_only'
  },
  email: { type: Boolean, default: false },
  phone: { type: Boolean, default: false },
  projects: { type: Boolean, default: true },
  achievements: { type: Boolean, default: true },
  skills: { type: Boolean, default: true }
}, { _id: false });

// Profile Stats Schema
const ProfileStatsSchema = new Schema<IProfileStats>({
  profileViews: { type: Number, default: 0 },
  connectionsCount: { type: Number, default: 0 },
  endorsementsReceived: { type: Number, default: 0 },
  lastActiveAt: { type: Date, default: Date.now }
}, { _id: false });

// Member Profile Schema
const MemberProfileSchema = new Schema<IMemberProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    
    // Basic Info
    bio: { 
      type: String, 
      maxlength: 500,
      default: '' 
    },
    headline: { 
      type: String, 
      maxlength: 120,
      default: '' 
    },
    location: { 
      type: String, 
      maxlength: 100,
      default: '' 
    },
    
    // Social Links
    website: { type: String, default: '' },
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    instagram: { type: String, default: '' },
    telegram: { type: String, default: '' },
    
    // Professional Info
    skills: [SkillSchema],
    interests: [{ type: String, trim: true }],
    languages: [LanguageSchema],
    
    // Availability
    availability: {
      type: AvailabilitySchema,
      default: () => ({})
    },
    
    // Privacy
    visibility: {
      type: VisibilitySettingsSchema,
      default: () => ({})
    },
    
    // Stats
    stats: {
      type: ProfileStatsSchema,
      default: () => ({})
    },
    
    // Featured Content
    featuredProjects: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'Project' 
    }],
    featuredAchievements: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'Achievement' 
    }]
  },
  { 
    timestamps: true,
    collection: 'memberprofiles'
  }
);

// Indexes for performance
MemberProfileSchema.index({ 'skills.name': 1 });
MemberProfileSchema.index({ interests: 1 });
MemberProfileSchema.index({ location: 1 });
MemberProfileSchema.index({ 'availability.status': 1 });
MemberProfileSchema.index({ createdAt: -1 });
MemberProfileSchema.index({ 'stats.connectionsCount': -1 });
MemberProfileSchema.index({ 'stats.endorsementsReceived': -1 });

// Methods

// Update profile stats
MemberProfileSchema.methods.incrementViews = async function() {
  this.stats.profileViews += 1;
  this.stats.lastActiveAt = new Date();
  return this.save();
};

// Update connections count
MemberProfileSchema.methods.updateConnectionsCount = async function(count: number) {
  this.stats.connectionsCount = count;
  return this.save();
};

// Add skill
MemberProfileSchema.methods.addSkill = async function(skillName: string, level: string) {
  const existingSkill = this.skills.find((s: ISkill) => s.name === skillName);
  if (!existingSkill) {
    this.skills.push({ name: skillName, level, endorsements: 0, endorsedBy: [] });
    return this.save();
  }
  return this;
};

// Endorse skill
MemberProfileSchema.methods.endorseSkill = async function(skillName: string, endorserId: mongoose.Types.ObjectId) {
  const skill = this.skills.find((s: ISkill) => s.name === skillName);
  if (skill && !skill.endorsedBy.includes(endorserId)) {
    skill.endorsedBy.push(endorserId);
    skill.endorsements += 1;
    this.stats.endorsementsReceived += 1;
    return this.save();
  }
  return this;
};

// Statics

// Find profiles by skill
MemberProfileSchema.statics.findBySkill = function(skillName: string) {
  return this.find({ 'skills.name': skillName })
    .populate('userId', 'firstName lastName email membershipInfo')
    .sort({ 'stats.connectionsCount': -1 });
};

// Find available members
MemberProfileSchema.statics.findAvailable = function() {
  return this.find({ 'availability.status': 'available' })
    .populate('userId', 'firstName lastName email membershipInfo')
    .sort({ 'stats.connectionsCount': -1 });
};

// Search profiles
MemberProfileSchema.statics.searchProfiles = function(query: string) {
  return this.find({
    $or: [
      { bio: { $regex: query, $options: 'i' } },
      { headline: { $regex: query, $options: 'i' } },
      { 'skills.name': { $regex: query, $options: 'i' } },
      { interests: { $regex: query, $options: 'i' } }
    ]
  })
  .populate('userId', 'firstName lastName email membershipInfo')
  .limit(50);
};

// Export Model
const MemberProfile = mongoose.model<IMemberProfile>('MemberProfile', MemberProfileSchema);
export default MemberProfile;
