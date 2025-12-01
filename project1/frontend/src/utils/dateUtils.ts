/**
 * Persian (Jalali/Shamsi) Date Utilities
 * تبدیل تاریخ میلادی به شمسی
 */

// Persian month names
const persianMonths = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

// Persian day names
const persianDays = [
  'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'
];

/**
 * Convert Gregorian date to Persian (Jalali) date
 */
function gregorianToJalali(gy: number, gm: number, gd: number): [number, number, number] {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let jy = gy <= 1600 ? 0 : 979;
  gy = gy <= 1600 ? gy - 621 : gy - 1600;
  const gy2 = gm > 2 ? gy + 1 : gy;
  let days = 365 * gy + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) +
    Math.floor((gy2 + 399) / 400) - 80 + gd + g_d_m[gm - 1];
  jy += 33 * Math.floor(days / 12053);
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  jy += Math.floor((days - 1) / 365);
  if (days > 365) days = (days - 1) % 365;
  const jm = days < 186 ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);
  const jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30);
  return [jy, jm, jd];
}

/**
 * Format date to Persian (Shamsi) string
 * @param date - Date object or ISO string
 * @param format - 'full' | 'short' | 'date' | 'time' | 'relative'
 */
export function toPersianDate(
  date: Date | string | number | null | undefined,
  format: 'full' | 'short' | 'date' | 'time' | 'relative' | 'datetime' = 'short'
): string {
  if (!date) return '-';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '-';
  
  const [jy, jm, jd] = gregorianToJalali(d.getFullYear(), d.getMonth() + 1, d.getDate());
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const dayName = persianDays[d.getDay()];
  const monthName = persianMonths[jm - 1];
  
  switch (format) {
    case 'full':
      return `${dayName}، ${jd} ${monthName} ${jy}`;
    case 'short':
      return `${jd} ${monthName} ${jy}`;
    case 'date':
      return `${jy}/${jm.toString().padStart(2, '0')}/${jd.toString().padStart(2, '0')}`;
    case 'time':
      return `${hours}:${minutes}`;
    case 'datetime':
      return `${jd} ${monthName} ${jy} - ${hours}:${minutes}`;
    case 'relative':
      return getRelativeTime(d);
    default:
      return `${jd} ${monthName} ${jy}`;
  }
}

/**
 * Get relative time in Persian
 */
export function getRelativeTime(date: Date | string | number): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  
  if (diffSec < 60) return 'همین الان';
  if (diffMin < 60) return `${diffMin} دقیقه پیش`;
  if (diffHour < 24) return `${diffHour} ساعت پیش`;
  if (diffDay === 1) return 'دیروز';
  if (diffDay < 7) return `${diffDay} روز پیش`;
  if (diffWeek === 1) return 'هفته پیش';
  if (diffWeek < 4) return `${diffWeek} هفته پیش`;
  if (diffMonth === 1) return 'ماه پیش';
  if (diffMonth < 12) return `${diffMonth} ماه پیش`;
  
  return toPersianDate(d, 'short');
}

/**
 * Get Persian month name
 */
export function getPersianMonthName(month: number): string {
  return persianMonths[month - 1] || '';
}

/**
 * Get Persian day name
 */
export function getPersianDayName(dayIndex: number): string {
  return persianDays[dayIndex] || '';
}

/**
 * Format date range in Persian
 */
export function formatPersianDateRange(startDate: Date | string, endDate: Date | string): string {
  const start = toPersianDate(startDate, 'short');
  const end = toPersianDate(endDate, 'short');
  return `${start} تا ${end}`;
}

/**
 * Get current Persian date
 */
export function getCurrentPersianDate(): { year: number; month: number; day: number; monthName: string } {
  const now = new Date();
  const [year, month, day] = gregorianToJalali(now.getFullYear(), now.getMonth() + 1, now.getDate());
  return { year, month, day, monthName: persianMonths[month - 1] };
}
