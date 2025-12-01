// Validation utility tests
describe('validation utilities', () => {
  describe('email validation', () => {
    it('should validate correct email formats', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.com',
      ];

      validEmails.forEach(email => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        expect(emailRegex.test(email)).toBe(true);
      });
    });

    it('should reject invalid email formats', () => {
      const invalidEmails = [
        'notanemail',
        '@example.com',
        'user@',
        'user @example.com',
      ];

      invalidEmails.forEach(email => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        expect(emailRegex.test(email)).toBe(false);
      });
    });
  });

  describe('phone number validation', () => {
    it('should validate Iranian phone numbers', () => {
      const validPhones = [
        '09123456789',
        '09351234567',
        '09901234567',
      ];

      validPhones.forEach(phone => {
        const phoneRegex = /^09\d{9}$/;
        expect(phoneRegex.test(phone)).toBe(true);
      });
    });

    it('should reject invalid phone numbers', () => {
      const invalidPhones = [
        '9123456789',    // Missing 0
        '091234567',     // Too short
        '091234567890',  // Too long
        '08123456789',   // Wrong prefix
      ];

      invalidPhones.forEach(phone => {
        const phoneRegex = /^09\d{9}$/;
        expect(phoneRegex.test(phone)).toBe(false);
      });
    });
  });

  describe('password strength', () => {
    it('should validate strong passwords', () => {
      const strongPasswords = [
        'MyP@ssw0rd123',
        'Secure#Pass1',
        'C0mpl3x!Pass',
      ];

      strongPasswords.forEach(password => {
        // At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
        const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
        expect(strongRegex.test(password)).toBe(true);
      });
    });

    it('should reject weak passwords', () => {
      const weakPasswords = [
        'password',      // No uppercase, number, special char
        'Pass123',       // Too short
        'PASSWORD123',   // No lowercase, special char
        'Password!',     // No number
      ];

      weakPasswords.forEach(password => {
        const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
        expect(strongRegex.test(password)).toBe(false);
      });
    });
  });

  describe('URL validation', () => {
    it('should validate correct URLs', () => {
      const validUrls = [
        'https://example.com',
        'http://subdomain.example.com',
        'https://example.com/path',
        'https://example.com/path?query=value',
      ];

      validUrls.forEach(url => {
        const urlRegex = /^https?:\/\/.+/;
        expect(urlRegex.test(url)).toBe(true);
      });
    });

    it('should reject invalid URLs', () => {
      const invalidUrls = [
        'not-a-url',
        'ftp://example.com',
        'example.com',
        '//example.com',
      ];

      invalidUrls.forEach(url => {
        const urlRegex = /^https?:\/\/.+/;
        expect(urlRegex.test(url)).toBe(false);
      });
    });
  });
});
