/**
 * XP Calculator Utility
 * محاسبات مربوط به XP و Level
 */

const BASE_XP = parseInt(process.env.BASE_XP_PER_LEVEL || '100');
const MULTIPLIER = parseFloat(process.env.XP_MULTIPLIER || '1.5');
const MAX_LEVEL = parseInt(process.env.MAX_LEVEL || '100');

/**
 * محاسبه XP مورد نیاز برای رسیدن به یک سطح خاص
 */
export function calculateXPForLevel(level: number): number {
  if (level <= 1) return 0;
  
  // فرمول: BASE_XP * (MULTIPLIER ^ (level - 1))
  // مثال: Level 2 = 100, Level 3 = 150, Level 4 = 225, ...
  return Math.floor(BASE_XP * Math.pow(MULTIPLIER, level - 2));
}

/**
 * محاسبه کل XP مورد نیاز برای رسیدن به یک سطح
 */
export function calculateTotalXPForLevel(level: number): number {
  let totalXP = 0;
  for (let i = 2; i <= level; i++) {
    totalXP += calculateXPForLevel(i);
  }
  return totalXP;
}

/**
 * محاسبه سطح بر اساس کل XP
 */
export function calculateLevelFromXP(totalXP: number): number {
  let level = 1;
  let xpNeeded = 0;
  
  while (level < MAX_LEVEL) {
    const nextLevelXP = calculateXPForLevel(level + 1);
    if (xpNeeded + nextLevelXP > totalXP) {
      break;
    }
    xpNeeded += nextLevelXP;
    level++;
  }
  
  return level;
}

/**
 * محاسبه XP فعلی در سطح جاری
 */
export function calculateCurrentXP(totalXP: number, level: number): number {
  const xpForCurrentLevel = calculateTotalXPForLevel(level);
  return totalXP - xpForCurrentLevel;
}

/**
 * محاسبه درصد پیشرفت در سطح جاری
 */
export function calculateLevelProgress(currentXP: number, xpToNextLevel: number): number {
  if (xpToNextLevel === 0) return 100;
  return Math.min(100, Math.floor((currentXP / xpToNextLevel) * 100));
}

/**
 * محاسبه XP بر اساس منبع
 */
export function calculateXPGain(source: string, data?: any): number {
  const xpSources: Record<string, number> = {
    // Basic Actions
    'login': 10,
    'daily_login': 20,
    'profile_complete': 50,
    'profile_update': 5,
    
    // Projects
    'project_create': 100,
    'project_complete': 200,
    'project_milestone': 50,
    'project_update': 10,
    
    // Courses
    'course_enroll': 25,
    'course_complete': 200,
    'course_lesson': 30,
    'course_quiz': 40,
    
    // Achievements
    'achievement_bronze': 50,
    'achievement_silver': 100,
    'achievement_gold': 200,
    'achievement_platinum': 500,
    
    // Community
    'post_create': 15,
    'comment_create': 5,
    'like_give': 1,
    'help_member': 25,
    
    // Team
    'team_join': 30,
    'team_create': 50,
    'team_project': 150,
    
    // Challenges
    'challenge_complete': 100,
    'daily_challenge': 50,
    'weekly_challenge': 150,
    
    // Streaks
    'streak_3': 50,
    'streak_7': 100,
    'streak_14': 200,
    'streak_30': 500,
    
    // Special
    'referral': 100,
    'feedback': 20,
    'bug_report': 50,
  };
  
  return xpSources[source] || 0;
}

/**
 * اعمال ضریب XP
 */
export function applyMultiplier(xp: number, multiplier: number): number {
  return Math.floor(xp * multiplier);
}

/**
 * محاسبه پاداش‌های سطح
 */
export function getLevelRewards(level: number): any[] {
  const rewards: any[] = [];
  
  // هر 5 سطح
  if (level % 5 === 0) {
    rewards.push({
      type: 'coins',
      value: level * 10,
      description: `${level * 10} سکه`,
    });
  }
  
  // سطوح خاص
  const specialLevels: Record<number, any[]> = {
    5: [{ type: 'badge', value: 1, description: 'نشان برنزی' }],
    10: [{ type: 'theme', value: 1, description: 'تم پروفایل' }],
    15: [{ type: 'badge', value: 2, description: 'نشان نقره‌ای' }],
    20: [{ type: 'avatar_frame', value: 1, description: 'قاب آواتار' }],
    25: [{ type: 'title', value: 1, description: 'عنوان ویژه' }],
    30: [{ type: 'badge', value: 3, description: 'نشان طلایی' }],
    50: [{ type: 'badge', value: 4, description: 'نشان پلاتینیوم' }],
    100: [{ type: 'badge', value: 5, description: 'نشان الماس' }],
  };
  
  if (specialLevels[level]) {
    rewards.push(...specialLevels[level]);
  }
  
  return rewards;
}

/**
 * بررسی آیا کاربر Level Up کرده
 */
export function checkLevelUp(oldLevel: number, newLevel: number): boolean {
  return newLevel > oldLevel;
}

/**
 * محاسبه رتبه بر اساس سطح
 */
export function getRankFromLevel(level: number): string {
  if (level >= 100) return 'افسانه';
  if (level >= 75) return 'استاد بزرگ';
  if (level >= 50) return 'استاد';
  if (level >= 30) return 'خبره';
  if (level >= 20) return 'پیشرفته';
  if (level >= 10) return 'متوسط';
  if (level >= 5) return 'مبتدی';
  return 'تازه‌کار';
}

export default {
  calculateXPForLevel,
  calculateTotalXPForLevel,
  calculateLevelFromXP,
  calculateCurrentXP,
  calculateLevelProgress,
  calculateXPGain,
  applyMultiplier,
  getLevelRewards,
  checkLevelUp,
  getRankFromLevel,
};
