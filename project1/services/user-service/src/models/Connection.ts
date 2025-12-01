import mongoose, { Schema, Document } from 'mongoose';

// Connection Interface
export interface IConnection extends Document {
  followerId: mongoose.Types.ObjectId;
  followingId: mongoose.Types.ObjectId;
  status: 'active' | 'blocked' | 'pending';
  note: string;
  createdAt: Date;
  updatedAt: Date;
}

// Connection Schema
const ConnectionSchema = new Schema<IConnection>(
  {
    followerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    followingId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    status: {
      type: String,
      enum: ['active', 'blocked', 'pending'],
      default: 'active'
    },
    note: {
      type: String,
      maxlength: 200,
      default: ''
    }
  },
  {
    timestamps: true,
    collection: 'connections'
  }
);

// Compound index: یک user نمی‌تونه یک نفر رو دوبار follow کنه
ConnectionSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

// Index برای queries سریع
ConnectionSchema.index({ followerId: 1, status: 1 });
ConnectionSchema.index({ followingId: 1, status: 1 });
ConnectionSchema.index({ createdAt: -1 });

// Validation: نمی‌شه خودت رو follow کنی
ConnectionSchema.pre('save', function(next) {
  if (this.followerId.equals(this.followingId)) {
    next(new Error('Cannot follow yourself'));
  } else {
    next();
  }
});

// Statics

// Get followers of a user
ConnectionSchema.statics.getFollowers = function(userId: mongoose.Types.ObjectId) {
  return this.find({ 
    followingId: userId, 
    status: 'active' 
  })
    .populate('followerId', 'firstName lastName email membershipInfo avatar')
    .sort({ createdAt: -1 });
};

// Get following of a user
ConnectionSchema.statics.getFollowing = function(userId: mongoose.Types.ObjectId) {
  return this.find({ 
    followerId: userId, 
    status: 'active' 
  })
    .populate('followingId', 'firstName lastName email membershipInfo avatar')
    .sort({ createdAt: -1 });
};

// Check if user A follows user B
ConnectionSchema.statics.isFollowing = async function(
  followerId: mongoose.Types.ObjectId, 
  followingId: mongoose.Types.ObjectId
): Promise<boolean> {
  const connection = await this.findOne({ 
    followerId, 
    followingId, 
    status: 'active' 
  });
  return !!connection;
};

// Get mutual connections (users who follow each other)
ConnectionSchema.statics.getMutualConnections = async function(userId: mongoose.Types.ObjectId) {
  const following = await this.find({ 
    followerId: userId, 
    status: 'active' 
  }).select('followingId');
  
  const followingIds = following.map((f: any) => f.followingId);
  
  const mutuals = await this.find({
    followerId: { $in: followingIds },
    followingId: userId,
    status: 'active'
  }).populate('followerId', 'firstName lastName email membershipInfo avatar');
  
  return mutuals;
};

// Get connection count
ConnectionSchema.statics.getConnectionsCount = async function(userId: mongoose.Types.ObjectId) {
  const [followersCount, followingCount] = await Promise.all([
    this.countDocuments({ followingId: userId, status: 'active' }),
    this.countDocuments({ followerId: userId, status: 'active' })
  ]);
  
  return { followersCount, followingCount };
};

// Get suggested connections (followers of followers که خودت follow نکردی)
ConnectionSchema.statics.getSuggestedConnections = async function(
  userId: mongoose.Types.ObjectId, 
  limit: number = 10
) {
  // کسایی که تو follow می‌کنی
  const following = await this.find({ 
    followerId: userId, 
    status: 'active' 
  }).select('followingId');
  
  const followingIds = following.map((f: any) => f.followingId);
  
  if (followingIds.length === 0) {
    // اگه هنوز کسی رو follow نکردی، اعضای فعال رو نشون بده
    return [];
  }
  
  // کسایی که اونا follow می‌کنن
  const suggestions = await this.find({
    followerId: { $in: followingIds },
    followingId: { $ne: userId }, // خودت نباشه
    status: 'active'
  })
    .select('followingId')
    .populate('followingId', 'firstName lastName email membershipInfo avatar');
  
  // حذف duplicates و کسایی که قبلاً follow کردی
  const uniqueSuggestions = suggestions
    .filter((s: any, index: number, self: any[]) => 
      index === self.findIndex((t: any) => t.followingId._id.equals(s.followingId._id))
    )
    .filter((s: any) => 
      !followingIds.some((id: any) => id.equals(s.followingId._id))
    )
    .slice(0, limit);
  
  return uniqueSuggestions.map((s: any) => s.followingId);
};

// Export Model
const Connection = mongoose.model<IConnection>('Connection', ConnectionSchema);
export default Connection;
