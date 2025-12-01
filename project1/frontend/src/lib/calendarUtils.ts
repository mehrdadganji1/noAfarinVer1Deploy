// Calendar Integration Utilities

interface CalendarEvent {
  title: string;
  description?: string;
  location?: string;
  startDate: Date;
  endDate: Date;
  url?: string;
}

/**
 * Generate .ics file content for calendar import
 */
export function generateICSFile(event: CalendarEvent): string {
  const formatDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const escape = (str: string): string => {
    return str.replace(/[,;\\]/g, '\\$&').replace(/\n/g, '\\n');
  };

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Noafarin Platform//Interview Calendar//FA',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `DTSTART:${formatDate(event.startDate)}`,
    `DTEND:${formatDate(event.endDate)}`,
    `SUMMARY:${escape(event.title)}`,
    event.description ? `DESCRIPTION:${escape(event.description)}` : '',
    event.location ? `LOCATION:${escape(event.location)}` : '',
    event.url ? `URL:${event.url}` : '',
    `DTSTAMP:${formatDate(new Date())}`,
    `UID:${Date.now()}@noafarin.com`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'BEGIN:VALARM',
    'TRIGGER:-PT1H',
    'ACTION:DISPLAY',
    'DESCRIPTION:یادآوری مصاحبه - 1 ساعت مانده',
    'END:VALARM',
    'BEGIN:VALARM',
    'TRIGGER:-PT15M',
    'ACTION:DISPLAY',
    'DESCRIPTION:یادآوری مصاحبه - 15 دقیقه مانده',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean).join('\r\n');

  return icsContent;
}

/**
 * Download ICS file
 */
export function downloadICSFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

/**
 * Generate Google Calendar URL
 */
export function generateGoogleCalendarUrl(event: CalendarEvent): string {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${formatGoogleDate(event.startDate)}/${formatGoogleDate(event.endDate)}`,
    details: event.description || '',
    location: event.location || '',
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function formatGoogleDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

/**
 * Export interview to calendar
 */
export function exportInterviewToCalendar(
  interview: {
    type: string;
    interviewDate: string;
    interviewTime: string;
    duration: number;
    interviewer?: { name: string; title?: string };
    location?: string;
    meetingLink?: string;
    notes?: string;
  },
  method: 'ics' | 'google' = 'ics'
): void {
  const startDate = new Date(`${interview.interviewDate} ${interview.interviewTime}`);
  const endDate = new Date(startDate.getTime() + interview.duration * 60000);

  const typeLabel = interview.type === 'technical' ? 'فنی' :
                   interview.type === 'hr' ? 'منابع انسانی' :
                   interview.type === 'panel' ? 'پنل' : 'فنی';

  const event: CalendarEvent = {
    title: `مصاحبه ${typeLabel} - نوآفرین`,
    description: [
      `مصاحبه‌کننده: ${interview.interviewer?.name || 'تعیین نشده'}`,
      interview.interviewer?.title ? `سمت: ${interview.interviewer.title}` : '',
      interview.notes ? `\nیادداشت: ${interview.notes}` : '',
      interview.meetingLink ? `\nلینک جلسه: ${interview.meetingLink}` : '',
    ].filter(Boolean).join('\n'),
    location: interview.meetingLink || interview.location || 'مشخص نشده',
    startDate,
    endDate,
    url: interview.meetingLink,
  };

  if (method === 'google') {
    const url = generateGoogleCalendarUrl(event);
    window.open(url, '_blank');
  } else {
    const icsContent = generateICSFile(event);
    const filename = `interview-${startDate.toISOString().split('T')[0]}.ics`;
    downloadICSFile(icsContent, filename);
  }
}
