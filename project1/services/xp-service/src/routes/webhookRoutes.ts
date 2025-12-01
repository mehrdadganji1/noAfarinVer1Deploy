import { Router, Request, Response } from 'express';
import * as xpEvents from '../events/xpEvents';

const router = Router();

/**
 * Webhook endpoint for other services to trigger XP events
 * این endpoint برای سرویس‌های دیگه است که بتونن XP اضافه کنن
 */

// Project Events
router.post('/project/create', async (req: Request, res: Response) => {
    try {
        const { userId, projectId } = req.body;
        const result = await xpEvents.handleProjectCreate(userId, projectId);
        res.json({ success: true, data: result });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/project/complete', async (req: Request, res: Response) => {
    try {
        const { userId, projectId } = req.body;
        const result = await xpEvents.handleProjectComplete(userId, projectId);
        res.json({ success: true, data: result });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/milestone/complete', async (req: Request, res: Response) => {
    try {
        const { userId, milestoneId } = req.body;
        const result = await xpEvents.handleMilestoneComplete(userId, milestoneId);
        res.json({ success: true, data: result });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Course Events
router.post('/course/complete', async (req: Request, res: Response) => {
    try {
        const { userId, courseId } = req.body;
        const result = await xpEvents.handleCourseComplete(userId, courseId);
        res.json({ success: true, data: result });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/lesson/complete', async (req: Request, res: Response) => {
    try {
        const { userId, lessonId } = req.body;
        const result = await xpEvents.handleLessonComplete(userId, lessonId);
        res.json({ success: true, data: result });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Achievement Events
router.post('/achievement/unlock', async (req: Request, res: Response) => {
    try {
        const { userId, achievementId, tier } = req.body;
        const result = await xpEvents.handleAchievementUnlock(userId, achievementId, tier);
        res.json({ success: true, data: result });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Login Events
router.post('/login/daily', async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;
        const result = await xpEvents.handleDailyLogin(userId);
        res.json({ success: true, data: result });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Profile Events
router.post('/profile/complete', async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;
        const result = await xpEvents.handleProfileComplete(userId);
        res.json({ success: true, data: result });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Event Events
router.post('/event/attend', async (req: Request, res: Response) => {
    try {
        const { userId, eventId } = req.body;
        const result = await xpEvents.handleEventAttend(userId, eventId);
        res.json({ success: true, data: result });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Streak Events
router.post('/streak/milestone', async (req: Request, res: Response) => {
    try {
        const { userId, days } = req.body;
        const result = await xpEvents.handleStreakMilestone(userId, days);
        res.json({ success: true, data: result });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
