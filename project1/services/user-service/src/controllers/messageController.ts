import { Request, Response } from 'express';
import Message, { generateConversationId } from '../models/Message';
import User, { UserRole } from '../models/User';
import { z } from 'zod';
import mongoose from 'mongoose';

// =====================================================
// VALIDATION SCHEMAS
// =====================================================

const sendMessageSchema = z.object({
  receiverId: z.string().min(1),
  content: z.string().min(1).max(5000),
  attachments: z.array(z.object({
    type: z.enum(['image', 'file', 'link']),
    url: z.string().url(),
    name: z.string(),
    size: z.number().optional(),
    mimeType: z.string().optional()
  })).optional()
});

// =====================================================
// CONVERSATIONS
// =====================================================

/**
 * @route   GET /api/community/messages/conversations
 * @desc    Get my conversations
 * @access  Private
 */
export const getMyConversations = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    const conversations = await (Message as any).getUserConversations(userId);

    // برای هر conversation، اطلاعات طرف مقابل رو بده
    const enrichedConversations = conversations.map((conv: any) => {
      const lastMessage = conv.lastMessage;
      const otherUser = lastMessage.senderId._id.equals(userId)
        ? lastMessage.receiverId
        : lastMessage.senderId;

      return {
        conversationId: conv._id,
        otherUser,
        lastMessage: {
          content: lastMessage.content,
          createdAt: lastMessage.createdAt,
          status: lastMessage.status,
          isSentByMe: lastMessage.senderId._id.equals(userId)
        },
        unreadCount: conv.unreadCount
      };
    });

    res.json({
      success: true,
      data: enrichedConversations
    });
  } catch (error: any) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت مکالمات',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/community/messages/conversations/:conversationId
 * @desc    Get conversation messages
 * @access  Private
 */
export const getConversationMessages = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const messages = await (Message as any).getConversationMessages(
      conversationId,
      userId,
      Number(page),
      Number(limit)
    );

    const total = await Message.countDocuments({
      conversationId,
      deletedBy: { $ne: userId }
    });

    res.json({
      success: true,
      data: messages.reverse(), // جدیدترین پایین
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: any) {
    console.error('Get conversation messages error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت پیام‌ها',
      error: error.message
    });
  }
};

/**
 * @route   POST /api/community/messages/send
 * @desc    Send a message
 * @access  Private
 */
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const senderId = req.user?.id;
    
    const validatedData = sendMessageSchema.parse(req.body);
    const { receiverId, content, attachments } = validatedData;

    // Check if receiver exists and is a club member
    const receiver = await User.findById(receiverId);
    if (!receiver || !receiver.role?.includes(UserRole.CLUB_MEMBER)) {
      return res.status(404).json({
        success: false,
        message: 'گیرنده یافت نشد یا عضو باشگاه نیست'
      });
    }

    // Generate conversation ID
    const conversationId = generateConversationId(senderId as any, receiverId as any);

    // Create message
    const message = await Message.create({
      conversationId,
      senderId,
      receiverId,
      content,
      attachments: attachments || [],
      status: 'sent'
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('senderId', 'firstName lastName avatar')
      .populate('receiverId', 'firstName lastName avatar');

    // TODO: Send real-time notification via Socket.io
    // io.to(receiverId).emit('new_message', populatedMessage);

    res.status(201).json({
      success: true,
      message: 'پیام ارسال شد',
      data: populatedMessage
    });
  } catch (error: any) {
    console.error('Send message error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'داده‌های نامعتبر',
        errors: error.errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'خطا در ارسال پیام',
      error: error.message
    });
  }
};

/**
 * @route   PUT /api/community/messages/:messageId/read
 * @desc    Mark message as read
 * @access  Private
 */
export const markAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { messageId } = req.params;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'پیام یافت نشد'
      });
    }

    // فقط گیرنده می‌تونه پیام رو read کنه
    if (!message.receiverId.equals(userId)) {
      return res.status(403).json({
        success: false,
        message: 'شما دسترسی به این پیام ندارید'
      });
    }

    await (message as any).markAsRead();

    // TODO: Send real-time notification
    // io.to(message.senderId).emit('message_read', { messageId });

    res.json({
      success: true,
      message: 'پیام به عنوان خوانده شده علامت‌گذاری شد'
    });
  } catch (error: any) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در علامت‌گذاری پیام',
      error: error.message
    });
  }
};

/**
 * @route   PUT /api/community/messages/conversation/:conversationId/read
 * @desc    Mark all messages in conversation as read
 * @access  Private
 */
export const markConversationAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { conversationId } = req.params;

    await (Message as any).markConversationAsRead(conversationId, userId);

    res.json({
      success: true,
      message: 'همه پیام‌ها خوانده شدند'
    });
  } catch (error: any) {
    console.error('Mark conversation as read error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در علامت‌گذاری مکالمه',
      error: error.message
    });
  }
};

/**
 * @route   DELETE /api/community/messages/:messageId
 * @desc    Delete message (soft delete)
 * @access  Private
 */
export const deleteMessage = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { messageId } = req.params;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'پیام یافت نشد'
      });
    }

    // چک کن که user یا فرستنده یا گیرنده باشه
    if (!message.senderId.equals(userId) && !message.receiverId.equals(userId)) {
      return res.status(403).json({
        success: false,
        message: 'شما دسترسی به این پیام ندارید'
      });
    }

    await (message as any).deleteForUser(userId);

    res.json({
      success: true,
      message: 'پیام حذف شد'
    });
  } catch (error: any) {
    console.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در حذف پیام',
      error: error.message
    });
  }
};

// =====================================================
// MESSAGE MANAGEMENT
// =====================================================

/**
 * @route   GET /api/community/messages/unread/count
 * @desc    Get unread messages count
 * @access  Private
 */
export const getUnreadCount = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    const count = await (Message as any).getUnreadCount(userId);

    res.json({
      success: true,
      data: { count }
    });
  } catch (error: any) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت تعداد پیام‌های خوانده نشده',
      error: error.message
    });
  }
};

/**
 * @route   POST /api/community/messages/search
 * @desc    Search messages
 * @access  Private
 */
export const searchMessages = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { query, limit = 50 } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'عبارت جستجو الزامی است'
      });
    }

    const messages = await (Message as any).searchMessages(
      userId,
      query,
      Number(limit)
    );

    res.json({
      success: true,
      data: messages
    });
  } catch (error: any) {
    console.error('Search messages error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در جستجوی پیام‌ها',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/community/messages/archived
 * @desc    Get archived conversations
 * @access  Private
 */
export const getArchivedConversations = async (req: Request, res: Response) => {
  try {
    // TODO: Implement archive system
    // For now, return empty array
    res.json({
      success: true,
      data: []
    });
  } catch (error: any) {
    console.error('Get archived error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت مکالمات بایگانی شده',
      error: error.message
    });
  }
};

/**
 * @route   PUT /api/community/messages/archive/:conversationId
 * @desc    Archive a conversation
 * @access  Private
 */
export const archiveConversation = async (req: Request, res: Response) => {
  try {
    // TODO: Implement archive system
    res.json({
      success: true,
      message: 'مکالمه بایگانی شد'
    });
  } catch (error: any) {
    console.error('Archive conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در بایگانی مکالمه',
      error: error.message
    });
  }
};

/**
 * @route   PUT /api/community/messages/unarchive/:conversationId
 * @desc    Unarchive a conversation
 * @access  Private
 */
export const unarchiveConversation = async (req: Request, res: Response) => {
  try {
    // TODO: Implement archive system
    res.json({
      success: true,
      message: 'مکالمه از بایگانی خارج شد'
    });
  } catch (error: any) {
    console.error('Unarchive conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در خروج از بایگانی',
      error: error.message
    });
  }
};

export default {
  getMyConversations,
  getConversationMessages,
  sendMessage,
  markAsRead,
  markConversationAsRead,
  deleteMessage,
  getUnreadCount,
  searchMessages,
  getArchivedConversations,
  archiveConversation,
  unarchiveConversation
};
