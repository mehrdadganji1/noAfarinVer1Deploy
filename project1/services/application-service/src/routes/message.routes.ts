import express from 'express';
import {
  getConversations,
  getMessages,
  sendMessage,
  markAsRead,
  deleteMessage,
  getUnreadCount,
} from '../controllers/message.controller';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All routes are protected
router.use(authenticate);

// Message routes
router.get('/conversations', getConversations);
router.get('/conversations/:conversationId/messages', getMessages);
router.post('/send', sendMessage);
router.put('/:messageId/read', markAsRead);
router.delete('/:messageId', deleteMessage);
router.get('/unread-count', getUnreadCount);

export default router;
