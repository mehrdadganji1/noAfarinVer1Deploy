import express from 'express';
import communityController from '../controllers/communityController';
import connectionController from '../controllers/connectionController';
import messageController from '../controllers/messageController';
import memberActivityController from '../controllers/memberActivityController';
import communityStatsController from '../controllers/communityStatsController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// =====================================================
// MIDDLEWARE: All routes require authentication
// =====================================================
router.use(authenticate);

// =====================================================
// MEMBER PROFILES
// =====================================================

// Get all profiles با فیلتر
router.get('/profiles', communityController.getAllProfiles);

// Get specific profile
router.get('/profiles/:userId', communityController.getProfile);

// Update my profile
router.put('/profiles/me', communityController.updateMyProfile);

// Update visibility settings
router.put('/profiles/me/visibility', communityController.updateVisibility);

// Get profile stats
router.get('/profiles/:userId/stats', communityController.getProfileStats);

// Record profile view
router.post('/profiles/:userId/view', communityController.recordProfileView);

// =====================================================
// SKILLS & ENDORSEMENTS
// =====================================================

// Add skill
router.post('/profiles/me/skills', communityController.addSkill);

// Endorse skill
router.post('/profiles/:userId/endorse', communityController.endorseSkill);

// Get endorsers
router.get('/profiles/:userId/endorsers', communityController.getEndorsers);

// =====================================================
// SEARCH & SUGGESTIONS
// =====================================================

// Advanced search
router.get('/search', communityController.advancedSearch);

// Get connection suggestions
router.get('/suggestions', communityController.getConnectionSuggestions);

// =====================================================
// CONNECTIONS
// =====================================================

// Follow member
router.post('/connections/follow/:userId', connectionController.followMember);

// Unfollow member
router.delete('/connections/unfollow/:userId', connectionController.unfollowMember);

// Get my followers
router.get('/connections/followers', connectionController.getMyFollowers);

// Get my following
router.get('/connections/following', connectionController.getMyFollowing);

// Get user's followers
router.get('/connections/:userId/followers', connectionController.getUserFollowers);

// Get user's following
router.get('/connections/:userId/following', connectionController.getUserFollowing);

// Check connection status
router.get('/connections/status/:userId', connectionController.getConnectionStatus);

// Block member
router.post('/connections/block/:userId', connectionController.blockMember);

// Get mutual connections
router.get('/connections/mutual', connectionController.getMutualConnections);

// =====================================================
// MESSAGES
// =====================================================

// Get my conversations
router.get('/messages/conversations', messageController.getMyConversations);

// Get conversation messages
router.get('/messages/conversations/:conversationId', messageController.getConversationMessages);

// Send message
router.post('/messages/send', messageController.sendMessage);

// Mark message as read
router.put('/messages/:messageId/read', messageController.markAsRead);

// Mark conversation as read
router.put('/messages/conversation/:conversationId/read', messageController.markConversationAsRead);

// Delete message
router.delete('/messages/:messageId', messageController.deleteMessage);

// Get unread count
router.get('/messages/unread/count', messageController.getUnreadCount);

// Search messages
router.post('/messages/search', messageController.searchMessages);

// Archived conversations
router.get('/messages/archived', messageController.getArchivedConversations);
router.put('/messages/archive/:conversationId', messageController.archiveConversation);
router.put('/messages/unarchive/:conversationId', messageController.unarchiveConversation);

// =====================================================
// MEMBER ACTIVITIES
// =====================================================

// Get activity feed
router.get('/activities', memberActivityController.getActivityFeed);

// Get public activities
router.get('/activities/public', memberActivityController.getPublicActivities);

// Get trending activities
router.get('/activities/trending', memberActivityController.getTrendingActivities);

// Get user activities
router.get('/activities/:userId', memberActivityController.getUserActivities);

// Create activity
router.post('/activities', memberActivityController.createActivity);

// Update activity
router.put('/activities/:activityId', memberActivityController.updateActivity);

// Delete activity
router.delete('/activities/:activityId', memberActivityController.deleteActivity);

// React to activity
router.post('/activities/:activityId/react', memberActivityController.reactToActivity);

// Add comment
router.post('/activities/:activityId/comment', memberActivityController.addComment);

// Delete comment
router.delete('/activities/:activityId/comment/:commentId', memberActivityController.deleteComment);

// =====================================================
// COMMUNITY STATS
// =====================================================

// Get overall stats
router.get('/stats', communityStatsController.getCommunityStats);

// Get trending members
router.get('/stats/trending', communityStatsController.getTrendingMembers);

// Get active members
router.get('/stats/active', communityStatsController.getActiveMembers);

// Get new members
router.get('/stats/new-members', communityStatsController.getNewMembers);

// Get engagement stats
router.get('/stats/engagement', communityStatsController.getEngagementStats);

// =====================================================
// EXPORT
// =====================================================

export default router;
