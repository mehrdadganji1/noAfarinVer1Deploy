import mongoose, { Schema, Document } from 'mongoose';

// Attachment Interface
export interface IAttachment {
  type: 'image' | 'file' | 'link';
  url: string;
  name: string;
  size?: number;
  mimeType?: string;
}

// Message Interface
export interface IMessage extends Document {
  conversationId: string;
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  content: string;
  attachments: IAttachment[];
  status: 'sent' | 'delivered' | 'read';
  readAt?: Date;
  deletedBy: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

// Attachment Schema
const AttachmentSchema = new Schema<IAttachment>({
  type: {
    type: String,
    enum: ['image', 'file', 'link'],
    required: true
  },
  url: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  size: Number,
  mimeType: String
}, { _id: false });

// Message Schema
const MessageSchema = new Schema<IMessage>(
  {
    conversationId: {
      type: String,
      required: true,
      index: true
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    content: {
      type: String,
      required: true,
      maxlength: 5000
    },
    attachments: [AttachmentSchema],
    status: {
      type: String,
      enum: ['sent', 'delivered', 'read'],
      default: 'sent'
    },
    readAt: Date,
    deletedBy: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  {
    timestamps: true,
    collection: 'messages'
  }
);

// Indexes for performance
MessageSchema.index({ conversationId: 1, createdAt: -1 });
MessageSchema.index({ senderId: 1, receiverId: 1, createdAt: -1 });
MessageSchema.index({ status: 1, receiverId: 1 });

// Generate conversationId من دو userId
export const generateConversationId = (
  userId1: mongoose.Types.ObjectId, 
  userId2: mongoose.Types.ObjectId
): string => {
  const ids = [userId1.toString(), userId2.toString()].sort();
  return `conv_${ids[0]}_${ids[1]}`;
};

// Methods

// Mark as read
MessageSchema.methods.markAsRead = async function() {
  if (this.status !== 'read') {
    this.status = 'read';
    this.readAt = new Date();
    return this.save();
  }
  return this;
};

// Mark as delivered
MessageSchema.methods.markAsDelivered = async function() {
  if (this.status === 'sent') {
    this.status = 'delivered';
    return this.save();
  }
  return this;
};

// Soft delete for a user
MessageSchema.methods.deleteForUser = async function(userId: mongoose.Types.ObjectId) {
  if (!this.deletedBy.includes(userId)) {
    this.deletedBy.push(userId);
    return this.save();
  }
  return this;
};

// Check if message is deleted for user
MessageSchema.methods.isDeletedFor = function(userId: mongoose.Types.ObjectId): boolean {
  return this.deletedBy.some((id: any) => id.equals(userId));
};

// Statics

// Get conversation messages
MessageSchema.statics.getConversationMessages = function(
  conversationId: string,
  userId: mongoose.Types.ObjectId,
  page: number = 1,
  limit: number = 50
) {
  return this.find({
    conversationId,
    deletedBy: { $ne: userId }
  })
    .populate('senderId', 'firstName lastName avatar')
    .populate('receiverId', 'firstName lastName avatar')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
};

// Get all conversations for a user
MessageSchema.statics.getUserConversations = async function(userId: mongoose.Types.ObjectId) {
  // پیدا کردن آخرین message هر conversation
  const messages = await this.aggregate([
    {
      $match: {
        $or: [
          { senderId: userId },
          { receiverId: userId }
        ],
        deletedBy: { $ne: userId }
      }
    },
    {
      $sort: { createdAt: -1 }
    },
    {
      $group: {
        _id: '$conversationId',
        lastMessage: { $first: '$$ROOT' },
        unreadCount: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ['$receiverId', userId] },
                  { $ne: ['$status', 'read'] }
                ]
              },
              1,
              0
            ]
          }
        }
      }
    },
    {
      $sort: { 'lastMessage.createdAt': -1 }
    }
  ]);

  // Populate user details
  await this.populate(messages, [
    { path: 'lastMessage.senderId', select: 'firstName lastName avatar' },
    { path: 'lastMessage.receiverId', select: 'firstName lastName avatar' }
  ]);

  return messages;
};

// Get unread count for user
MessageSchema.statics.getUnreadCount = function(userId: mongoose.Types.ObjectId) {
  return this.countDocuments({
    receiverId: userId,
    status: { $ne: 'read' },
    deletedBy: { $ne: userId }
  });
};

// Mark all messages in conversation as read
MessageSchema.statics.markConversationAsRead = async function(
  conversationId: string, 
  userId: mongoose.Types.ObjectId
) {
  return this.updateMany(
    {
      conversationId,
      receiverId: userId,
      status: { $ne: 'read' }
    },
    {
      $set: {
        status: 'read',
        readAt: new Date()
      }
    }
  );
};

// Search messages
MessageSchema.statics.searchMessages = function(
  userId: mongoose.Types.ObjectId,
  query: string,
  limit: number = 50
) {
  return this.find({
    $or: [
      { senderId: userId },
      { receiverId: userId }
    ],
    content: { $regex: query, $options: 'i' },
    deletedBy: { $ne: userId }
  })
    .populate('senderId', 'firstName lastName avatar')
    .populate('receiverId', 'firstName lastName avatar')
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Delete old messages (cleanup job)
MessageSchema.statics.deleteOldMessages = function(daysOld: number = 365) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);
  
  return this.deleteMany({
    createdAt: { $lt: cutoffDate }
  });
};

// Export Model
const Message = mongoose.model<IMessage>('Message', MessageSchema);
export default Message;
