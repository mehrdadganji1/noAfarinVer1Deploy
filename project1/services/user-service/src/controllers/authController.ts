import { Request, Response } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import User, { IUser, UserRole } from '../models/User';
import emailService from '../services/emailService';

const generateToken = (userId: string, email: string, role: UserRole[]): string => {
  const secret = (process.env.JWT_SECRET || 'default-secret') as Secret;
  const token = jwt.sign(
    { id: userId, email, role },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' as any }
  );
  return token;
};

const generateRefreshToken = (userId: string): string => {
  const secret = (process.env.JWT_SECRET || 'default-secret') as Secret;
  const token = jwt.sign(
    { id: userId },
    secret,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d' as any }
  );
  return token;
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, firstName, lastName, role, phoneNumber, university, major, studentId } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        success: false,
        error: 'User with this email already exists',
      });
      return;
    }

    // Check if email is enabled
    const emailEnabled = process.env.EMAIL_ENABLED !== 'false';
    
    // Generate email verification token
    const verificationToken = emailService.generateVerificationToken();
    // 7 days for development, 24 hours for production
    const expiryHours = process.env.NODE_ENV === 'production' ? 24 : 24 * 7;
    const verificationExpires = new Date(Date.now() + expiryHours * 60 * 60 * 1000);

    // Create new user
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      role: role ? [role] : ['applicant'],
      phoneNumber,
      university,
      major,
      studentId,
      hasPassword: true, // User registered with password
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires,
      // Auto-verify if email is disabled
      isEmailVerified: !emailEnabled,
    });

    // Send verification email only if email is enabled
    if (emailEnabled) {
      emailService.sendVerificationEmail(email, firstName, verificationToken).catch(err => {
        console.error('Failed to send verification email:', err);
      });
    } else {
      console.log('📧 Email disabled - User auto-verified:', email);
    }

    // Generate tokens
    const token = generateToken(String(user._id), user.email, user.role);
    const refreshToken = generateRefreshToken(String(user._id));

    // Remove password from response
    const userResponse: any = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: emailEnabled 
        ? 'User registered successfully. Please check your email to verify your account.'
        : 'User registered successfully. You can now login.',
      data: {
        user: userResponse,
        token,
        refreshToken,
        emailVerificationRequired: emailEnabled,
      },
    });
  } catch (error: any) {
    console.error('Register error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors,
      });
      return;
    }
    
    res.status(500).json({
      success: false,
      error: 'Error registering user',
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: 'Email and password are required',
      });
      return;
    }

    // Find user with password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
      return;
    }

    // Check if user is active
    if (!user.isActive) {
      res.status(401).json({
        success: false,
        error: 'Account is deactivated',
      });
      return;
    }

    // Compare password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
      return;
    }

    // Generate tokens
    const token = generateToken(String(user._id), user.email, user.role);
    const refreshToken = generateRefreshToken(String(user._id));

    // Auto check-in for streak (non-blocking)
    try {
      const axios = require('axios');
      const XP_SERVICE_URL = process.env.XP_SERVICE_URL || 'http://localhost:3011';
      
      // Check if user already checked in today
      const streakResponse = await axios.get(`${XP_SERVICE_URL}/api/streaks/my-streak`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 3000,
      });
      
      if (streakResponse.data?.data?.canCheckInToday) {
        // Auto check-in
        await axios.post(`${XP_SERVICE_URL}/api/streaks/check-in`, {}, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 3000,
        });
        console.log('✅ Auto check-in successful for user:', user._id);
      }
    } catch (xpError: any) {
      // Don't fail login if XP service is down
      console.log('⚠️ Auto check-in failed (non-critical):', xpError.message);
    }

    // Award daily login XP (non-blocking)
    try {
      const axios = require('axios');
      await axios.post(
        `${process.env.XP_SERVICE_URL || 'http://localhost:3011'}/api/challenges/progress`,
        {
          userId: String(user._id),
          action: 'daily_login',
          count: 1,
        },
        { timeout: 3000 }
      );
      console.log('✅ Daily login XP tracked for user:', user._id);
    } catch (xpError: any) {
      console.log('⚠️ Failed to track daily login XP (non-critical):', xpError.message);
    }

    // Remove password from response
    const userResponse: any = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        token,
        refreshToken,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Error logging in',
    });
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({
        success: false,
        error: 'Refresh token is required',
      });
      return;
    }

    // Verify refresh token
    const secret: Secret = process.env.JWT_SECRET || 'default-secret';
    const decoded = jwt.verify(refreshToken, secret) as any;
    
    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Invalid refresh token',
      });
      return;
    }

    // Generate new tokens
    const newToken = generateToken(String(user._id), user.email, user.role);
    const newRefreshToken = generateRefreshToken(String(user._id));

    res.status(200).json({
      success: true,
      data: {
        token: newToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error: any) {
    console.error('Refresh token error:', error);
    res.status(401).json({
      success: false,
      error: 'Invalid or expired refresh token',
    });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching user',
    });
  }
};

// Seed admin user - for development only
/**
 * Verify email with token
 */
export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.query;

    console.log('📧 Email verification attempt:');
    console.log(`   Token received: ${token}`);
    console.log(`   Token length: ${token ? String(token).length : 0}`);
    console.log(`   Token type: ${typeof token}`);

    if (!token) {
      res.status(400).json({
        success: false,
        error: 'Verification token is required',
      });
      return;
    }

    // Find user with this token
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() }, // Token not expired
    }).select('+emailVerificationToken +emailVerificationExpires');

    if (!user) {
      // Debug: Check if token exists but expired
      const expiredUser = await User.findOne({
        emailVerificationToken: token,
      }).select('+emailVerificationToken +emailVerificationExpires');

      if (expiredUser) {
        console.log('❌ Token found but expired');
        console.log(`   Expires: ${expiredUser.emailVerificationExpires}`);
        console.log(`   Now: ${new Date()}`);
        
        res.status(400).json({
          success: false,
          error: 'Verification token has expired',
          expired: true,
        });
        return;
      }

      console.log('❌ Token not found in database');
      res.status(400).json({
        success: false,
        error: 'Invalid or expired verification token',
      });
      return;
    }

    console.log('✅ User found, verifying...');
    console.log(`   Email: ${user.email}`);
    console.log(`   Already verified: ${user.isVerified}`);

    // Update user
    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    // Send welcome email
    emailService.sendWelcomeEmail(user.email, user.firstName).catch(err => {
      console.error('Failed to send welcome email:', err);
    });

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
    });
  } catch (error: any) {
    console.error('Verify email error:', error);
    res.status(500).json({
      success: false,
      error: 'Error verifying email',
    });
  }
};

/**
 * Resend verification email
 */
/**
 * Check email verification status (Debug endpoint)
 */
export const checkVerificationStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, debug } = req.query;

    if (!email) {
      res.status(400).json({
        success: false,
        error: 'Email is required',
      });
      return;
    }

    const user = await User.findOne({ email }).select('+emailVerificationToken +emailVerificationExpires');
    
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    const now = new Date();
    const isExpired = user.emailVerificationExpires ? user.emailVerificationExpires < now : false;

    const responseData: any = {
      email: user.email,
      isVerified: user.isVerified,
      hasToken: !!user.emailVerificationToken,
      tokenExpires: user.emailVerificationExpires,
      isExpired,
      timeLeft: user.emailVerificationExpires 
        ? Math.max(0, user.emailVerificationExpires.getTime() - now.getTime()) / 1000 / 60 / 60 // hours
        : 0,
    };

    // Show actual token in debug mode (ONLY for development!)
    if (debug === 'true' && process.env.NODE_ENV !== 'production') {
      responseData.token = user.emailVerificationToken;
      responseData.tokenLength = user.emailVerificationToken?.length || 0;
    }

    res.status(200).json({
      success: true,
      data: responseData
    });
  } catch (error: any) {
    console.error('Check verification status error:', error);
    res.status(500).json({
      success: false,
      error: 'Error checking verification status',
    });
  }
};

export const resendVerificationEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    console.log('🔄 Resend verification email request for:', email);

    if (!email) {
      res.status(400).json({
        success: false,
        error: 'Email is required',
      });
      return;
    }

    // Find user
    const user = await User.findOne({ email }).select('+emailVerificationToken +emailVerificationExpires');
    
    if (!user) {
      console.log('❌ User not found:', email);
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    // Check if already verified
    if (user.isVerified) {
      console.log('⚠️  Email already verified:', email);
      res.status(400).json({
        success: false,
        error: 'Email is already verified',
      });
      return;
    }

    // Generate new token
    const verificationToken = emailService.generateVerificationToken();
    // 7 days for development, 24 hours for production
    const expiryHours = process.env.NODE_ENV === 'production' ? 24 : 24 * 7;
    const verificationExpires = new Date(Date.now() + expiryHours * 60 * 60 * 1000);

    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = verificationExpires;
    await user.save();

    // Send verification email
    const emailSent = await emailService.sendVerificationEmail(
      user.email,
      user.firstName,
      verificationToken
    );

    if (!emailSent) {
      res.status(500).json({
        success: false,
        error: 'Failed to send verification email',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Verification email sent successfully',
    });
  } catch (error: any) {
    console.error('Resend verification email error:', error);
    res.status(500).json({
      success: false,
      error: 'Error resending verification email',
    });
  }
};

/**
 * Request password reset
 */
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        success: false,
        error: 'Email is required',
      });
      return;
    }

    // Find user
    const user = await User.findOne({ email });
    
    if (!user) {
      // Don't reveal that user doesn't exist
      res.status(200).json({
        success: true,
        message: 'If an account exists with this email, a password reset link will be sent',
      });
      return;
    }

    // Generate reset token
    const resetToken = emailService.generateVerificationToken();
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    user.passwordResetToken = resetToken;
    user.passwordResetExpires = resetExpires;
    await user.save();

    // Send password reset email
    await emailService.sendPasswordResetEmail(user.email, user.firstName, resetToken);

    res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email',
    });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      error: 'Error processing password reset request',
    });
  }
};

/**
 * Reset password with token
 */
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      res.status(400).json({
        success: false,
        error: 'Token and new password are required',
      });
      return;
    }

    // Find user with this token
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() }, // Token not expired
    }).select('+passwordResetToken +passwordResetExpires +password');

    if (!user) {
      res.status(400).json({
        success: false,
        error: 'Invalid or expired reset token',
      });
      return;
    }

    // Update password
    user.password = password; // Will be hashed by pre-save hook
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error: any) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      error: 'Error resetting password',
    });
  }
};

/**
 * Change user email
 */
export const changeEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { newEmail, password } = req.body;

    if (!newEmail || !password) {
      res.status(400).json({
        success: false,
        error: 'ایمیل جدید و رمز عبور الزامی است',
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      res.status(400).json({
        success: false,
        error: 'فرمت ایمیل نامعتبر است',
      });
      return;
    }

    // Find user with password
    const user = await User.findById(userId).select('+password');
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'کاربر یافت نشد',
      });
      return;
    }

    // Verify current password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      res.status(400).json({
        success: false,
        error: 'رمز عبور اشتباه است',
      });
      return;
    }

    // Check if new email is same as current
    if (newEmail.toLowerCase() === user.email.toLowerCase()) {
      res.status(400).json({
        success: false,
        error: 'ایمیل جدید باید متفاوت از ایمیل فعلی باشد',
      });
      return;
    }

    // Check if new email already exists
    const existingUser = await User.findOne({ email: newEmail.toLowerCase() });
    if (existingUser) {
      res.status(400).json({
        success: false,
        error: 'این ایمیل قبلاً استفاده شده است',
      });
      return;
    }

    // Update email
    user.email = newEmail.toLowerCase();
    await user.save();

    // Generate new token with updated email
    const token = generateToken(String(user._id), user.email, user.role);

    res.status(200).json({
      success: true,
      message: 'ایمیل با موفقیت تغییر کرد',
      data: {
        email: user.email,
        token,
      },
    });
  } catch (error: any) {
    console.error('Change email error:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در تغییر ایمیل',
    });
  }
};

/**
 * Change user password
 */
export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({
        success: false,
        error: 'رمز عبور فعلی و جدید الزامی است',
      });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({
        success: false,
        error: 'رمز عبور جدید باید حداقل ۶ کاراکتر باشد',
      });
      return;
    }

    // Find user with password
    const user = await User.findById(userId).select('+password');
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'کاربر یافت نشد',
      });
      return;
    }

    // Verify current password
    const isPasswordCorrect = await user.comparePassword(currentPassword);
    if (!isPasswordCorrect) {
      res.status(400).json({
        success: false,
        error: 'رمز عبور فعلی اشتباه است',
      });
      return;
    }

    // Check if new password is same as current
    const isSamePassword = await user.comparePassword(newPassword);
    if (isSamePassword) {
      res.status(400).json({
        success: false,
        error: 'رمز عبور جدید باید متفاوت از رمز عبور فعلی باشد',
      });
      return;
    }

    // Update password (will be hashed by pre-save hook)
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'رمز عبور با موفقیت تغییر کرد',
    });
  } catch (error: any) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در تغییر رمز عبور',
    });
  }
};

export const seedAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const adminEmail = 'admin@noafarin.com';
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      // Update existing user to admin
      existingAdmin.role = [UserRole.ADMIN];
      await existingAdmin.save();
      
      const token = generateToken(String(existingAdmin._id), existingAdmin.email, existingAdmin.role);
      
      res.json({
        success: true,
        message: 'Admin user updated successfully',
        data: {
          user: {
            _id: existingAdmin._id,
            email: existingAdmin.email,
            firstName: existingAdmin.firstName,
            lastName: existingAdmin.lastName,
            role: existingAdmin.role,
          },
          token,
        },
      });
      return;
    }
    
    // Create new admin user
    const adminUser = await User.create({
      email: adminEmail,
      password: 'Admin123!',
      firstName: 'Admin',
      lastName: 'Noafarin',
      role: [UserRole.ADMIN],
    });
    
    const token = generateToken(String(adminUser._id), adminUser.email, adminUser.role);
    
    res.status(201).json({
      success: true,
      message: 'Admin user created successfully',
      data: {
        user: {
          _id: adminUser._id,
          email: adminUser.email,
          firstName: adminUser.firstName,
          lastName: adminUser.lastName,
          role: adminUser.role,
        },
        token,
        credentials: {
          email: adminEmail,
          password: 'Admin123!',
        },
      },
    });
  } catch (error: any) {
    console.error('Seed admin error:', error);
    res.status(500).json({
      success: false,
      error: 'Error creating admin user',
      details: error.message,
    });
  }
};


// ذخیره موقت کدهای تایید برای تنظیم پسورد
const passwordSetupCodes = new Map<string, { code: string; expiresAt: number; userId: string }>();

/**
 * Request OTP for setting password (first time)
 */
export const requestPasswordSetupOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    
    // Find user
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'کاربر یافت نشد',
      });
      return;
    }

    // Check if user has verified phone number
    if (!user.phoneNumber) {
      res.status(400).json({
        success: false,
        error: 'شماره موبایل ثبت نشده است',
      });
      return;
    }

    // Validate phone number format
    if (!/^09\d{9}$/.test(user.phoneNumber)) {
      res.status(400).json({
        success: false,
        error: 'فرمت شماره موبایل نامعتبر است',
      });
      return;
    }

    // Import SMS service
    const smsService = require('../services/smsService').default;

    // Generate verification code
    const code = smsService.generateVerificationCode();
    
    // Store code with 2 minutes expiration
    const expiresAt = Date.now() + 2 * 60 * 1000; // 2 minutes
    passwordSetupCodes.set(user.phoneNumber, { code, expiresAt, userId: String(user._id) });

    // Send SMS
    const sent = await smsService.sendOTP(user.phoneNumber, code);

    if (!sent) {
      res.status(500).json({
        success: false,
        error: 'خطا در ارسال پیامک. لطفا دوباره تلاش کنید',
      });
      return;
    }

    // For development, log the code
    console.log(`📱 Password setup OTP for ${user.phoneNumber}: ${code}`);

    res.json({
      success: true,
      message: 'کد تایید با موفقیت ارسال شد',
      data: {
        phoneNumber: user.phoneNumber.replace(/(\d{4})(\d{3})(\d{4})/, '$1***$3'), // Mask middle digits
        expiresIn: 120, // seconds
      },
    });
  } catch (error: any) {
    console.error('❌ Request password setup OTP error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'خطا در ارسال کد تایید',
    });
  }
};

/**
 * Set password for the first time with OTP verification
 */
export const setPasswordWithOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { code, newPassword, confirmPassword } = req.body;

    // Validate input
    if (!code || !newPassword || !confirmPassword) {
      res.status(400).json({
        success: false,
        error: 'کد تایید و رمز عبور الزامی است',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      res.status(400).json({
        success: false,
        error: 'تکرار رمز عبور مطابقت ندارد',
      });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({
        success: false,
        error: 'رمز عبور باید حداقل ۶ کاراکتر باشد',
      });
      return;
    }

    // Find user
    const user = await User.findById(userId).select('+password');
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'کاربر یافت نشد',
      });
      return;
    }

    if (!user.phoneNumber) {
      res.status(400).json({
        success: false,
        error: 'شماره موبایل ثبت نشده است',
      });
      return;
    }

    // Check if code exists
    const storedData = passwordSetupCodes.get(user.phoneNumber);
    
    if (!storedData) {
      res.status(400).json({
        success: false,
        error: 'کد تایید یافت نشد. لطفا دوباره درخواست دهید',
      });
      return;
    }

    // Check if code is expired
    if (Date.now() > storedData.expiresAt) {
      passwordSetupCodes.delete(user.phoneNumber);
      res.status(400).json({
        success: false,
        error: 'کد تایید منقضی شده است',
      });
      return;
    }

    // Verify code
    if (storedData.code !== code) {
      res.status(400).json({
        success: false,
        error: 'کد تایید نادرست است',
      });
      return;
    }

    // Verify user ID matches
    if (storedData.userId !== String(user._id)) {
      res.status(400).json({
        success: false,
        error: 'کد تایید نامعتبر است',
      });
      return;
    }

    // Delete used code
    passwordSetupCodes.delete(user.phoneNumber);

    // Set password
    user.password = newPassword; // Will be hashed by pre-save hook
    user.hasPassword = true;
    user.phoneVerified = true; // Mark phone as verified since OTP was successful
    await user.save();

    res.status(200).json({
      success: true,
      message: 'رمز عبور با موفقیت تنظیم شد',
    });
  } catch (error: any) {
    console.error('❌ Set password with OTP error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'خطا در تنظیم رمز عبور',
    });
  }
};

// Cleanup expired password setup codes every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [phoneNumber, data] of passwordSetupCodes.entries()) {
    if (now > data.expiresAt) {
      passwordSetupCodes.delete(phoneNumber);
    }
  }
}, 5 * 60 * 1000);
