import mongoose, { Schema } from 'mongoose';

export interface IConversation extends mongoose.Document {
  participants: mongoose.Types.ObjectId[];
  lastMessage?: {
    content: string;
    senderId: mongoose.Types.ObjectId;
    createdAt: Date;
  };
  unreadCount: Map<string, number>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>(
  {
    participants: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }],
    lastMessage: {
      content: String,
      senderId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      createdAt: Date,
    },
    unreadCount: {
      type: Map,
      of: Number,
      default: new Map(),
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for finding conversations by participants
conversationSchema.index({ participants: 1 });
conversationSchema.index({ 'lastMessage.createdAt': -1 });

export default mongoose.model<IConversation>('Conversation', conversationSchema);
