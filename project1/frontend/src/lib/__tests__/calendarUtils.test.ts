import { generateICSFile, generateGoogleCalendarUrl } from '../calendarUtils';

describe('calendarUtils', () => {
  describe('generateICSFile', () => {
    it('should generate valid ICS content with all fields', () => {
      const event = {
        title: 'Test Event',
        description: 'Test Description',
        location: 'Test Location',
        startDate: new Date('2025-01-15T10:00:00Z'),
        endDate: new Date('2025-01-15T11:00:00Z'),
        url: 'https://example.com',
      };

      const ics = generateICSFile(event);

      expect(ics).toContain('BEGIN:VCALENDAR');
      expect(ics).toContain('END:VCALENDAR');
      expect(ics).toContain('BEGIN:VEVENT');
      expect(ics).toContain('END:VEVENT');
      expect(ics).toContain('SUMMARY:Test Event');
      expect(ics).toContain('DESCRIPTION:Test Description');
      expect(ics).toContain('LOCATION:Test Location');
      expect(ics).toContain('URL:https://example.com');
    });

    it('should handle events without optional fields', () => {
      const event = {
        title: 'Simple Event',
        startDate: new Date('2025-01-15T10:00:00Z'),
        endDate: new Date('2025-01-15T11:00:00Z'),
      };

      const ics = generateICSFile(event);

      expect(ics).toContain('SUMMARY:Simple Event');
      // DESCRIPTION appears in VALARM, so we check for event description specifically
      const lines = ics.split('\n');
      const eventDescriptionLine = lines.find(line => 
        line.startsWith('DESCRIPTION:') && !line.includes('یادآوری')
      );
      expect(eventDescriptionLine).toBeUndefined();
      expect(ics).not.toContain('LOCATION:');
      expect(ics).not.toContain('URL:');
    });

    it('should escape special characters in text fields', () => {
      const event = {
        title: 'Event, with; special\\characters',
        description: 'Line 1\nLine 2',
        startDate: new Date('2025-01-15T10:00:00Z'),
        endDate: new Date('2025-01-15T11:00:00Z'),
      };

      const ics = generateICSFile(event);

      expect(ics).toContain('\\n');
    });

    it('should include alarm reminders', () => {
      const event = {
        title: 'Event with Reminders',
        startDate: new Date('2025-01-15T10:00:00Z'),
        endDate: new Date('2025-01-15T11:00:00Z'),
      };

      const ics = generateICSFile(event);

      expect(ics).toContain('BEGIN:VALARM');
      expect(ics).toContain('TRIGGER:-PT1H');
      expect(ics).toContain('TRIGGER:-PT15M');
    });
  });

  describe('generateGoogleCalendarUrl', () => {
    it('should generate valid Google Calendar URL', () => {
      const event = {
        title: 'Test Event',
        description: 'Test Description',
        location: 'Test Location',
        startDate: new Date('2025-01-15T10:00:00Z'),
        endDate: new Date('2025-01-15T11:00:00Z'),
      };

      const url = generateGoogleCalendarUrl(event);

      expect(url).toContain('https://calendar.google.com/calendar/render');
      expect(url).toContain('action=TEMPLATE');
      expect(url).toContain('text=Test+Event');
      expect(url).toContain('details=Test+Description');
      expect(url).toContain('location=Test+Location');
    });

    it('should handle events without optional fields', () => {
      const event = {
        title: 'Simple Event',
        startDate: new Date('2025-01-15T10:00:00Z'),
        endDate: new Date('2025-01-15T11:00:00Z'),
      };

      const url = generateGoogleCalendarUrl(event);

      expect(url).toContain('text=Simple+Event');
      expect(url).toContain('details=');
      expect(url).toContain('location=');
    });

    it('should format dates correctly', () => {
      const event = {
        title: 'Date Test',
        startDate: new Date('2025-01-15T10:00:00Z'),
        endDate: new Date('2025-01-15T11:00:00Z'),
      };

      const url = generateGoogleCalendarUrl(event);

      expect(url).toContain('dates=20250115T100000Z%2F20250115T110000Z');
    });
  });
});
