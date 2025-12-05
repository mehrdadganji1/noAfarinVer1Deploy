/**
 * Tests for validation utilities
 */

import {
  isValidEmail,
  isValidPhone,
  isValidDegree,
  isValidTeamSize,
  validateFormData,
  VALID_DEGREES,
  VALID_TEAM_SIZES
} from '../validation';
import { AACOFormData } from '../../types/form.types';

describe('Validation Utilities', () => {
  describe('isValidEmail', () => {
    it('should validate correct email formats', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.ir')).toBe(true);
    });

    it('should reject invalid email formats', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
    });
  });

  describe('isValidPhone', () => {
    it('should validate correct Iranian phone numbers', () => {
      expect(isValidPhone('09123456789')).toBe(true);
      expect(isValidPhone('09 12 345 6789')).toBe(true); // with spaces
    });

    it('should reject invalid phone numbers', () => {
      expect(isValidPhone('9123456789')).toBe(false); // missing 0
      expect(isValidPhone('091234567')).toBe(false); // too short
      expect(isValidPhone('08123456789')).toBe(false); // doesn't start with 09
    });
  });

  describe('isValidDegree', () => {
    it('should validate correct degree values', () => {
      VALID_DEGREES.forEach(degree => {
        expect(isValidDegree(degree)).toBe(true);
      });
    });

    it('should reject invalid degree values', () => {
      expect(isValidDegree('کارشناسی')).toBe(false); // Persian
      expect(isValidDegree('undergraduate')).toBe(false);
      expect(isValidDegree('')).toBe(false);
    });
  });

  describe('isValidTeamSize', () => {
    it('should validate correct team size values', () => {
      VALID_TEAM_SIZES.forEach(size => {
        expect(isValidTeamSize(size)).toBe(true);
      });
    });

    it('should reject invalid team size values', () => {
      expect(isValidTeamSize('3')).toBe(false);
      expect(isValidTeamSize('10')).toBe(false);
      expect(isValidTeamSize('')).toBe(false);
    });
  });

  describe('validateFormData', () => {
    const validFormData: AACOFormData = {
      firstName: 'علی',
      lastName: 'محمدی',
      email: 'ali@example.com',
      phone: '09123456789',
      city: 'تهران',
      university: 'دانشگاه تهران',
      major: 'مهندسی کامپیوتر',
      degree: 'bachelor',
      graduationYear: '1402',
      startupIdea: 'یک ایده استارتاپی',
      businessModel: 'مدل کسب و کار',
      targetMarket: 'بازار هدف',
      teamSize: '2-3',
      teamMembers: 'اعضای تیم',
      skills: ['JavaScript', 'React'],
      motivation: 'انگیزه من',
      goals: 'اهداف من',
      experience: 'تجربه من',
      expectations: 'انتظارات من'
    };

    it('should validate correct form data', () => {
      const result = validateFormData(validFormData);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });

    it('should detect invalid degree', () => {
      const invalidData = { ...validFormData, degree: 'کارشناسی' };
      const result = validateFormData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors.degree).toBeDefined();
    });

    it('should detect invalid team size', () => {
      const invalidData = { ...validFormData, teamSize: '3' };
      const result = validateFormData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors.teamSize).toBeDefined();
    });

    it('should detect invalid email', () => {
      const invalidData = { ...validFormData, email: 'invalid-email' };
      const result = validateFormData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBeDefined();
    });

    it('should detect invalid phone', () => {
      const invalidData = { ...validFormData, phone: '123456789' };
      const result = validateFormData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors.phone).toBeDefined();
    });

    it('should detect missing required fields', () => {
      const invalidData = { ...validFormData, firstName: '', lastName: '' };
      const result = validateFormData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors.firstName).toBeDefined();
      expect(result.errors.lastName).toBeDefined();
    });
  });
});
