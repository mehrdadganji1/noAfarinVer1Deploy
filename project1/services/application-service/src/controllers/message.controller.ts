import { Request, Response } from 'express';
import Message from '../models/Message';
import Conversation from '../models/Conversation';
import mongoose from 'mongoose';

/**
 * Get all conversations for current user
 */
export const getConversations = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;

    const conversations = await Conversation.find({
      participants: userId,
      isActive: true,
    })
      .populate('participants', 'firstName lastName email avatar')
      .sort({ 'lastMessage.createdAt': -1 })
      .lean();

    res.json({
      success: true,
      data: conversations,
    });
  } catch (error: any) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در دریافت مکالمات',
    });
  }
};

/**
 * Get messages for a conversation
 */
export const getMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { conversationId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    // Verify user is participant
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId,
    });

    if (!conversation) {
      res.status(404).json({
        success: false,
        error: 'مکالمه یافت نشد',
      });
      return;
    }

    const messages = await Message.find({
      conversationId,
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('senderId', 'firstName lastName avatar')
      .lean();

    const total = await Message.countDocuments({
      conversationId,
      isDeleted: false,
    });

    // Mark messages as read
    await Message.updateMany(
      {
        conversationId,
        receiverId: userId,
        isRead: false,
      },
      {
        isRead: true,
        readAt: new Date(),
      }
    );

    // Update unread count
    conversation.unreadCount.set(userId, 0);
    await conversation.save();

    res.json({
      success: true,
      data: messages.reverse(),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در دریافت پیام‌ها',
    });
  }
};

/**
 * Send a message
 */
export const sendMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { receiverId, content, messageType = 'text', fileUrl, fileName, fileSize } = req.body;

    if (!receiverId || !content) {
      res.status(400).json({
        success: false,
        error: 'گیرنده و محتوای پیام الزامی است',
      });
      return;
    }

    // Find or create conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [userId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [userId, receiverId],
        unreadCount: new Map([
          [userId, 0],
          [receiverId, 1],
        ]),
      });
    } else {
      // Increment unread count for receiver
      const currentCount = conversation.unreadCount.get(receiverId) || 0;
      conversation.unreadCount.set(receiverId, currentCount + 1);
    }

    // Create message
    const message = await Message.create({
      conversationId: conversation._id,
      senderId: userId,
      receiverId,
      content,
      messageType,
      fileUrl,
      fileName,
      fileSize,
    });

    // Update conversation last message
    conversation.lastMessage = {
      content,
      senderId: new mongoose.Types.ObjectId(userId),
      createdAt: new Date(),
    };
    await conversation.save();

    const populatedMessage = await Message.findById(message._id)
      .populate('senderId', 'firstName lastName avatar')
      .lean();

    res.status(201).json({
      success: true,
      message: 'پیام ارسال شد',
      data: populatedMessage,
    });
  } catch (error: any) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در ارسال پیام',
    });
  }
};

/**
 * Mark message as read
 */
export const markAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { messageId } = req.params;

    const message = await Message.findOne({
      _id: messageId,
      receiverId: userId,
    });

    if (!message) {
      res.status(404).json({
        success: false,
        error: 'پیام یافت نشد',
      });
      return;
    }

    message.isRead = true;
    message.readAt = new Date();
    await message.save();

    res.json({
      success: true,
      message: 'پیام به عنوان خوانده شده علامت‌گذاری شد',
    });
  } catch (error: any) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در علامت‌گذاری پیام',
    });
  }
};

/**
 * Delete a message
 */
export const deleteMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { messageId } = req.params;

    const message = await Message.findOne({
      _id: messageId,
      senderId: userId,
    });

    if (!message) {
      res.status(404).json({
        success: false,
        error: 'پیام یافت نشد یا شما مجاز به حذف آن نیستید',
      });
      return;
    }

    message.isDeleted = true;
    message.deletedAt = new Date();
    await message.save();

    res.json({
      success: true,
      message: 'پیام حذف شد',
    });
  } catch (error: any) {
    console.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در حذف پیام',
    });
  }
};

/**
 * Get unread messages count
 */
export const getUnreadCount = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;

    const count = await Message.countDocuments({
      receiverId: userId,
      isRead: false,
      isDeleted: false,
    });

    res.json({
      success: true,
      data: { count },
    });
  } catch (error: any) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در دریافت تعداد پیام‌های خوانده نشده',
    });
  }
};
