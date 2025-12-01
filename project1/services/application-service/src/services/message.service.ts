import Message, { IMessage, MessageStatus } from '../models/Message';
import Conversation, { IConversation } from '../models/Conversation';
import mongoose from 'mongoose';

export class MessageService {
  /**
   * Send a new message
   */
  async sendMessage(data: Partial<IMessage>): Promise<IMessage> {
    try {
      // Find or create conversation
      const conversation = await this.findOrCreateConversation(
        data.senderId!.toString(),
        data.recipientId!.toString(),
        data.senderName!,
        data.recipientName!
      );

      // Create message
      const message = new Message({
        ...data,
        conversationId: (conversation as any)._id,
        status: MessageStatus.SENT,
        isRead: false
      });

      await message.save();

      // Update conversation with last message
      conversation.lastMessage = {
        content: message.content.substring(0, 100),
        senderId: message.senderId,
        senderName: message.senderName,
        createdAt: message.createdAt
      };

      // Increment unread count for recipient
      await (conversation as any).incrementUnread(data.recipientId!.toString());

      return message;
    } catch (error: any) {
      throw new Error(`Error sending message: ${error.message}`);
    }
  }

  /**
   * Find or create conversation between two users
   */
  async findOrCreateConversation(
    userId1: string,
    userId2: string,
    userName1: string,
    userName2: string
  ): Promise<IConversation> {
    try {
      const participants = [
        new mongoose.Types.ObjectId(userId1),
        new mongoose.Types.ObjectId(userId2)
      ].sort();

      let conversation = await Conversation.findOne({
        participants: { $all: participants }
      });

      if (!conversation) {
        conversation = new Conversation({
          participants,
          participantNames: [userName1, userName2],
          unreadCount: new Map()
        });
        await conversation.save();
      }

      return conversation;
    } catch (error: any) {
      throw new Error(`Error finding/creating conversation: ${error.message}`);
    }
  }

  /**
   * Get all messages for a user
   */
  async getMessagesByUser(userId: string): Promise<IMessage[]> {
    try {
      const messages = await Message.find({
        $or: [
          { senderId: new mongoose.Types.ObjectId(userId) },
          { recipientId: new mongoose.Types.ObjectId(userId) }
        ]
      })
        .sort({ createdAt: -1 })
        .exec();

      return messages;
    } catch (error: any) {
      throw new Error(`Error fetching messages: ${error.message}`);
    }
  }

  /**
   * Get inbox messages
   */
  async getInbox(userId: string): Promise<IMessage[]> {
    try {
      const messages = await Message.find({
        recipientId: userId
      })
        .sort({ createdAt: -1 })
        .exec();

      return messages;
    } catch (error: any) {
      console.error('Error fetching inbox:', error);
      throw new Error(`Error fetching inbox: ${error.message}`);
    }
  }

  /**
   * Get sent messages
   */
  async getSent(userId: string): Promise<IMessage[]> {
    try {
      const messages = await Message.find({
        senderId: new mongoose.Types.ObjectId(userId)
      })
        .sort({ createdAt: -1 })
        .exec();

      return messages;
    } catch (error: any) {
      throw new Error(`Error fetching sent messages: ${error.message}`);
    }
  }

  /**
   * Get unread messages
   */
  async getUnread(userId: string): Promise<IMessage[]> {
    try {
      const messages = await Message.find({
        recipientId: new mongoose.Types.ObjectId(userId),
        isRead: false
      })
        .sort({ createdAt: -1 })
        .exec();

      return messages;
    } catch (error: any) {
      throw new Error(`Error fetching unread messages: ${error.message}`);
    }
  }

  /**
   * Get unread count
   */
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const count = await Message.countDocuments({
        recipientId: new mongoose.Types.ObjectId(userId),
        isRead: false
      });

      return count;
    } catch (error: any) {
      throw new Error(`Error fetching unread count: ${error.message}`);
    }
  }

  /**
   * Get message by ID
   */
  async getMessageById(id: string): Promise<IMessage | null> {
    try {
      const message = await Message.findById(id).exec();
      return message;
    } catch (error: any) {
      throw new Error(`Error fetching message: ${error.message}`);
    }
  }

  /**
   * Mark message as read
   */
  async markAsRead(id: string, userId: string): Promise<IMessage | null> {
    try {
      const message = await Message.findById(id);

      if (!message) {
        return null;
      }

      // Only recipient can mark as read
      if (message.recipientId.toString() !== userId) {
        throw new Error('Unauthorized');
      }

      message.isRead = true;
      message.readAt = new Date();
      message.status = MessageStatus.READ;
      await message.save();

      // Decrement unread count in conversation
      const conversation = await Conversation.findById(message.conversationId);
      if (conversation) {
        await (conversation as any).resetUnread(userId);
      }

      return message;
    } catch (error: any) {
      throw new Error(`Error marking message as read: ${error.message}`);
    }
  }

  /**
   * Mark all messages as read
   */
  async markAllAsRead(userId: string): Promise<number> {
    try {
      const result = await Message.updateMany(
        {
          recipientId: new mongoose.Types.ObjectId(userId),
          isRead: false
        },
        {
          $set: {
            isRead: true,
            readAt: new Date(),
            status: MessageStatus.READ
          }
        }
      );

      return result.modifiedCount;
    } catch (error: any) {
      throw new Error(`Error marking all as read: ${error.message}`);
    }
  }

  /**
   * Delete message
   */
  async deleteMessage(id: string, userId: string): Promise<boolean> {
    try {
      const message = await Message.findById(id);

      if (!message) {
        return false;
      }

      // Only sender or recipient can delete
      if (
        message.senderId.toString() !== userId &&
        message.recipientId.toString() !== userId
      ) {
        throw new Error('Unauthorized');
      }

      await Message.findByIdAndDelete(id);
      return true;
    } catch (error: any) {
      throw new Error(`Error deleting message: ${error.message}`);
    }
  }

  /**
   * Get conversations for a user
   */
  async getConversations(userId: string): Promise<IConversation[]> {
    try {
      const conversations = await Conversation.find({
        participants: new mongoose.Types.ObjectId(userId)
      })
        .sort({ 'lastMessage.createdAt': -1 })
        .exec();

      return conversations;
    } catch (error: any) {
      throw new Error(`Error fetching conversations: ${error.message}`);
    }
  }

  /**
   * Get messages in a conversation
   */
  async getConversationMessages(conversationId: string): Promise<IMessage[]> {
    try {
      const messages = await Message.find({
        conversationId: new mongoose.Types.ObjectId(conversationId)
      })
        .sort({ createdAt: 1 })
        .exec();

      return messages;
    } catch (error: any) {
      throw new Error(`Error fetching conversation messages: ${error.message}`);
    }
  }

  /**
   * Search messages
   */
  async searchMessages(userId: string, query: string): Promise<IMessage[]> {
    try {
      const messages = await Message.find({
        $and: [
          {
            $or: [
              { senderId: new mongoose.Types.ObjectId(userId) },
              { recipientId: new mongoose.Types.ObjectId(userId) }
            ]
          },
          {
            $or: [
              { subject: { $regex: query, $options: 'i' } },
              { content: { $regex: query, $options: 'i' } }
            ]
          }
        ]
      })
        .sort({ createdAt: -1 })
        .limit(50)
        .exec();

      return messages;
    } catch (error: any) {
      throw new Error(`Error searching messages: ${error.message}`);
    }
  }
}

export default new MessageService();
