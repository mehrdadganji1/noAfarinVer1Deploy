/**
 * @jest-environment jsdom
 */

import { cn, formatDate, formatDateTime } from '../utils';

describe('cn (className utility)', () => {
  it('should merge class names correctly', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('should handle conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
  });

  it('should merge tailwind classes correctly', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
  });

  it('should handle undefined and null', () => {
    expect(cn('foo', undefined, null, 'bar')).toBe('foo bar');
  });

  it('should handle arrays', () => {
    expect(cn(['foo', 'bar'], 'baz')).toBe('foo bar baz');
  });
});

describe('formatDate', () => {
  it('should format Date object correctly', () => {
    const date = new Date('2025-11-19T10:00:00');
    const result = formatDate(date);
    expect(result).toContain('۱۴۰۴');
    expect(result).toContain('آبان');
  });

  it('should format date string correctly', () => {
    const dateString = '2025-11-19';
    const result = formatDate(dateString);
    expect(result).toContain('۱۴۰۴');
  });

  it('should handle ISO date string', () => {
    const isoString = '2025-11-19T10:00:00.000Z';
    const result = formatDate(isoString);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });
});

describe('formatDateTime', () => {
  it('should format Date object with time', () => {
    const date = new Date('2025-11-19T14:30:00');
    const result = formatDateTime(date);
    expect(result).toContain('۱۴۰۴');
    expect(result).toContain(':');
  });

  it('should format date string with time', () => {
    const dateString = '2025-11-19T14:30:00';
    const result = formatDateTime(dateString);
    expect(typeof result).toBe('string');
    expect(result).toContain(':');
  });

  it('should include hours and minutes', () => {
    const date = new Date('2025-11-19T14:30:00');
    const result = formatDateTime(date);
    // Should contain time (Persian or English digits with colon)
    expect(result).toContain(':');
    expect(result).toContain('ساعت');
  });
});
