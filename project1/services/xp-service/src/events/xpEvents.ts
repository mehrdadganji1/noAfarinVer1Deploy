/**
 * XP Event Handlers
 * این فایل event های مختلف رو listen میکنه و XP اضافه میکنه
 */

import UserXP from '../models/UserXP';
import {
  calculateLevelFromXP,
  calculateCurrentXP,
  calculateXPForLevel,
  getLevelRewards,
  checkLevelUp,
} from '../utils/xpCalculator';

// XP Values for different events
export const XP_VALUES = {
  // Login Events
  LOGIN: 10,
  DAILY_LOGIN: 20,
  
  // Profile Events
  PROFILE_COMPLETE: 50,
  AVATAR_UPLOAD: 15,
  BIO_WRITE: 10,
  
  // Project Events
  PROJECT_CREATE: 100,
  PROJECT_COMPLETE: 200,
  MILESTONE_COMPLETE: 50,
  PROJECT_UPDATE: 10,
  
  // Course Events
  COURSE_COMPLETE: 200,
  LESSON_COMPLETE: 30,
  QUIZ_PASS: 40,
  QUIZ_PERFECT: 100,
  
  // Achievement Events
  ACHIEVEMENT_BRONZE: 50,
  ACHIEVEMENT_SILVER: 100,
  ACHIEVEMENT_GOLD: 200,
  ACHIEVEMENT_PLATINUM: 500,
  
  // Community Events
  POST_CREATE: 15,
  COMMENT_CREATE: 5,
  HELP_MEMBER: 25,
  
  // Team Events
  TEAM_JOIN: 30,
  TEAM_LEAD: 60,
  
  // Event Events
  EVENT_ATTEND: 50,
  EVENT_ORGANIZE: 100,
  
  // Streak Events
  STREAK_3_DAYS: 50,
  STREAK_7_DAYS: 100,
  STREAK_14_DAYS: 200,
  STREAK_30_DAYS: 500,
};

/**
 * Add XP to user
 */
export async function addXPToUser(
  userId: string,
  amount: number,
  source: string,
  description: string,
  sourceId?: string,
  multiplier: number = 1.0
) {
  try {
    let userXP = await UserXP.findOne({ userId });

    if (!userXP) {
      // Create new XP record
      userXP = new UserXP({
        userId,
        currentXP: 0,
        totalXP: 0,
        level: 1,
        xpMultiplier: 1.0,
        xpHistory: [],
        levelMilestones: [],
      });
    }

    // Calculate XP gain with multiplier
    const finalAmount = Math.floor(amount * multiplier * userXP.xpMultiplier);
    
    // Calculate new totals
    const oldLevel = userXP.level;
    const newTotalXP = userXP.totalXP + finalAmount;
    const newLevel = calculateLevelFromXP(newTotalXP);
    const newCurrentXP = calculateCurrentXP(newTotalXP, newLevel);
    const xpToNextLevel = calculateXPForLevel(newLevel + 1);
    const leveledUp = checkLevelUp(oldLevel, newLevel);
    const rewards = leveledUp ? getLevelRewards(newLevel) : [];

    // Update user XP
    userXP.currentXP = newCurrentXP;
    userXP.totalXP = newTotalXP;
    userXP.level = newLevel;
    userXP.lastXPGain = new Date();

    // Add to history
    userXP.xpHistory.push({
      amount: finalAmount,
      source,
      sourceId,
      description,
      multiplier: multiplier * userXP.xpMultiplier,
      timestamp: new Date(),
    });

    // If leveled up, add milestone
    if (leveledUp) {
      userXP.levelMilestones.push({
        level: newLevel,
        unlockedAt: new Date(),
        rewards,
      });
    }

    await userXP.save();

    return {
      success: true,
      xpGained: finalAmount,
      leveledUp,
      oldLevel,
      newLevel,
      currentXP: newCurrentXP,
      totalXP: newTotalXP,
      xpToNextLevel,
      rewards,
    };
  } catch (error) {
    console.error('Error adding XP:', error);
    throw error;
  }
}

/**
 * Event Handlers
 */

// Project Events
export async function handleProjectCreate(userId: string, projectId: string) {
  return addXPToUser(
    userId,
    XP_VALUES.PROJECT_CREATE,
    'project_create',
    'ایجاد پروژه جدید',
    projectId
  );
}

export async function handleProjectComplete(userId: string, projectId: string) {
  return addXPToUser(
    userId,
    XP_VALUES.PROJECT_COMPLETE,
    'project_complete',
    'تکمیل پروژه',
    projectId
  );
}

export async function handleMilestoneComplete(userId: string, milestoneId: string) {
  return addXPToUser(
    userId,
    XP_VALUES.MILESTONE_COMPLETE,
    'milestone_complete',
    'تکمیل Milestone',
    milestoneId
  );
}

// Course Events
export async function handleCourseComplete(userId: string, courseId: string) {
  return addXPToUser(
    userId,
    XP_VALUES.COURSE_COMPLETE,
    'course_complete',
    'تکمیل دوره آموزشی',
    courseId
  );
}

export async function handleLessonComplete(userId: string, lessonId: string) {
  return addXPToUser(
    userId,
    XP_VALUES.LESSON_COMPLETE,
    'lesson_complete',
    'تکمیل درس',
    lessonId
  );
}

// Achievement Events
export async function handleAchievementUnlock(
  userId: string,
  achievementId: string,
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
) {
  const xpValues = {
    bronze: XP_VALUES.ACHIEVEMENT_BRONZE,
    silver: XP_VALUES.ACHIEVEMENT_SILVER,
    gold: XP_VALUES.ACHIEVEMENT_GOLD,
    platinum: XP_VALUES.ACHIEVEMENT_PLATINUM,
  };

  return addXPToUser(
    userId,
    xpValues[tier],
    'achievement_unlock',
    `باز کردن دستاورد ${tier}`,
    achievementId
  );
}

// Login Events
export async function handleDailyLogin(userId: string) {
  return addXPToUser(
    userId,
    XP_VALUES.DAILY_LOGIN,
    'daily_login',
    'ورود روزانه'
  );
}

// Profile Events
export async function handleProfileComplete(userId: string) {
  return addXPToUser(
    userId,
    XP_VALUES.PROFILE_COMPLETE,
    'profile_complete',
    'تکمیل پروفایل'
  );
}

// Event Events
export async function handleEventAttend(userId: string, eventId: string) {
  return addXPToUser(
    userId,
    XP_VALUES.EVENT_ATTEND,
    'event_attend',
    'شرکت در رویداد',
    eventId
  );
}

// Streak Events
export async function handleStreakMilestone(userId: string, days: number) {
  const xpValues: Record<number, number> = {
    3: XP_VALUES.STREAK_3_DAYS,
    7: XP_VALUES.STREAK_7_DAYS,
    14: XP_VALUES.STREAK_14_DAYS,
    30: XP_VALUES.STREAK_30_DAYS,
  };

  const xp = xpValues[days] || 0;
  if (xp === 0) return null;

  return addXPToUser(
    userId,
    xp,
    'streak_milestone',
    `${days} روز Streak متوالی`
  );
}
