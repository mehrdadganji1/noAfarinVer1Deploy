import mongoose, { Schema, Document } from 'mongoose';

// Reaction Interface
export interface IReaction {
  userId: mongoose.Types.ObjectId;
  type: 'like' | 'celebrate' | 'support' | 'love';
  createdAt: Date;
}

// Comment Interface
export interface IComment {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

// Member Activity Interface
export interface IMemberActivity extends Document {
  userId: mongoose.Types.ObjectId;
  type: 
    | 'project_completed' 
    | 'achievement_earned' 
    | 'event_attended' 
    | 'course_completed'
    | 'skill_added'
    | 'connection_made'
    | 'profile_updated'
    | 'post_created';
  
  title: string;
  description: string;
  
  // Content
  content?: string; // برای post_created
  images?: string[];
  
  // Metadata
  metadata: {
    projectId?: mongoose.Types.ObjectId;
    achievementId?: mongoose.Types.ObjectId;
    eventId?: mongoose.Types.ObjectId;
    courseId?: mongoose.Types.ObjectId;
    skillName?: string;
    [key: string]: any;
  };
  
  // Privacy
  visibility: 'public' | 'connections' | 'private';
  
  // Engagement
  reactions: IReaction[];
  comments: IComment[];
  viewsCount: number;
  sharesCount: number;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Reaction Schema
const ReactionSchema = new Schema<IReaction>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['like', 'celebrate', 'support', 'love'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

// Comment Schema
const CommentSchema = new Schema<IComment>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 500
  }
}, { timestamps: true });

// Member Activity Schema
const MemberActivitySchema = new Schema<IMemberActivity>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    type: {
      type: String,
      enum: [
        'project_completed',
        'achievement_earned',
        'event_attended',
        'course_completed',
        'skill_added',
        'connection_made',
        'profile_updated',
        'post_created'
      ],
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      maxlength: 200
    },
    description: {
      type: String,
      required: true,
      maxlength: 1000
    },
    content: {
      type: String,
      maxlength: 5000
    },
    images: [String],
    metadata: {
      type: Map,
      of: Schema.Types.Mixed,
      default: {}
    },
    visibility: {
      type: String,
      enum: ['public', 'connections', 'private'],
      default: 'connections'
    },
    reactions: [ReactionSchema],
    comments: [CommentSchema],
    viewsCount: {
      type: Number,
      default: 0
    },
    sharesCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    collection: 'memberactivities'
  }
);

// Indexes
MemberActivitySchema.index({ userId: 1, createdAt: -1 });
MemberActivitySchema.index({ type: 1, createdAt: -1 });
MemberActivitySchema.index({ visibility: 1, createdAt: -1 });
MemberActivitySchema.index({ 'reactions.userId': 1 });

// Methods

// Add reaction
MemberActivitySchema.methods.addReaction = async function(
  userId: mongoose.Types.ObjectId, 
  type: string
) {
  // حذف reaction قبلی user (اگه وجود داشت)
  this.reactions = this.reactions.filter(
    (r: IReaction) => !r.userId.equals(userId)
  );
  
  // اضافه کردن reaction جدید
  this.reactions.push({
    userId,
    type: type as any,
    createdAt: new Date()
  });
  
  return this.save();
};

// Remove reaction
MemberActivitySchema.methods.removeReaction = async function(
  userId: mongoose.Types.ObjectId
) {
  this.reactions = this.reactions.filter(
    (r: IReaction) => !r.userId.equals(userId)
  );
  return this.save();
};

// Add comment
MemberActivitySchema.methods.addComment = async function(
  userId: mongoose.Types.ObjectId,
  content: string
) {
  this.comments.push({
    _id: new mongoose.Types.ObjectId(),
    userId,
    content,
    createdAt: new Date(),
    updatedAt: new Date()
  } as any);
  
  return this.save();
};

// Delete comment
MemberActivitySchema.methods.deleteComment = async function(
  commentId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId
) {
  const comment = this.comments.id(commentId);
  if (comment && comment.userId.equals(userId)) {
    comment.remove();
    return this.save();
  }
  return this;
};

// Increment views
MemberActivitySchema.methods.incrementViews = async function() {
  this.viewsCount += 1;
  return this.save();
};

// Get reaction counts
MemberActivitySchema.methods.getReactionCounts = function() {
  const counts: Record<string, number> = {
    like: 0,
    celebrate: 0,
    support: 0,
    love: 0
  };
  
  this.reactions.forEach((r: IReaction) => {
    counts[r.type] = (counts[r.type] || 0) + 1;
  });
  
  return counts;
};

// Check if user reacted
MemberActivitySchema.methods.hasUserReacted = function(
  userId: mongoose.Types.ObjectId
): boolean {
  return this.reactions.some((r: IReaction) => r.userId.equals(userId));
};

// Statics

// Get user feed (activities از connections)
MemberActivitySchema.statics.getUserFeed = async function(
  userId: mongoose.Types.ObjectId,
  connectionIds: mongoose.Types.ObjectId[],
  page: number = 1,
  limit: number = 20
) {
  return this.find({
    $or: [
      { userId: { $in: connectionIds }, visibility: { $in: ['public', 'connections'] } },
      { userId } // My own activities (all visibility levels)
    ]
  })
    .populate('userId', 'firstName lastName avatar membershipInfo')
    .populate('reactions.userId', 'firstName lastName avatar')
    .populate('comments.userId', 'firstName lastName avatar')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
};

// Get public activities (برای explore)
MemberActivitySchema.statics.getPublicActivities = function(
  page: number = 1,
  limit: number = 20
) {
  return this.find({ visibility: 'public' })
    .populate('userId', 'firstName lastName avatar membershipInfo')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
};

// Get user activities
MemberActivitySchema.statics.getUserActivities = function(
  userId: mongoose.Types.ObjectId,
  viewerId?: mongoose.Types.ObjectId,
  page: number = 1,
  limit: number = 20
) {
  const query: any = { userId };
  
  // اگر viewer خود user نیست، فقط public و connections رو نشون بده
  if (viewerId && !viewerId.equals(userId)) {
    query.visibility = { $in: ['public', 'connections'] };
  }
  
  return this.find(query)
    .populate('userId', 'firstName lastName avatar membershipInfo')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
};

// Get trending activities (most engaged)
MemberActivitySchema.statics.getTrendingActivities = function(
  days: number = 7,
  limit: number = 10
) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return this.aggregate([
    {
      $match: {
        createdAt: { $gte: cutoffDate },
        visibility: 'public'
      }
    },
    {
      $addFields: {
        engagementScore: {
          $add: [
            { $size: '$reactions' },
            { $multiply: [{ $size: '$comments' }, 2] },
            { $multiply: ['$viewsCount', 0.1] }
          ]
        }
      }
    },
    {
      $sort: { engagementScore: -1 }
    },
    {
      $limit: limit
    }
  ]);
};

// Export Model
const MemberActivity = mongoose.model<IMemberActivity>('MemberActivity', MemberActivitySchema);
export default MemberActivity;
