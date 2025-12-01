import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import smsService from '../services/smsService';

// ذخیره موقت کدهای تایید (در production از Redis استفاده کنید)
const verificationCodes = new Map<string, { code: string; expiresAt: number }>();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * ارسال کد تایید به شماره موبایل
 */
export const sendVerificationCode = async (req: Request, res: Response) => {
  try {
    const { phoneNumber } = req.body;

    // Validate phone number
    if (!phoneNumber || !/^09\d{9}$/.test(phoneNumber)) {
      return res.status(400).json({
        success: false,
        error: 'شماره موبایل معتبر نیست',
        message: 'شماره موبایل معتبر نیست',
      });
    }

    // Generate verification code
    const code = smsService.generateVerificationCode();
    
    // Store code with 2 minutes expiration
    const expiresAt = Date.now() + 2 * 60 * 1000; // 2 minutes
    verificationCodes.set(phoneNumber, { code, expiresAt });

    // Send SMS
    const sent = await smsService.sendOTP(phoneNumber, code);

    if (!sent) {
      return res.status(500).json({
        success: false,
        error: 'خطا در ارسال پیامک. لطفا دوباره تلاش کنید',
        message: 'خطا در ارسال پیامک. لطفا دوباره تلاش کنید',
      });
    }

    // For development, log the code
    console.log(`📱 Verification code for ${phoneNumber}: ${code}`);

    res.json({
      success: true,
      message: 'کد تایید با موفقیت ارسال شد',
      data: {
        phoneNumber,
        expiresIn: 120, // seconds
      },
    });
  } catch (error: any) {
    console.error('❌ Send verification code error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      error: error.message || 'خطا در ارسال کد تایید',
      message: error.message || 'خطا در ارسال کد تایید',
    });
  }
};

/**
 * تایید کد و ورود/ثبت‌نام کاربر
 */
export const verifyCode = async (req: Request, res: Response) => {
  try {
    const { phoneNumber, otp, code } = req.body;
    const verificationCode = otp || code; // Support both 'otp' and 'code' field names

    // Validate input
    if (!phoneNumber || !verificationCode) {
      return res.status(400).json({
        success: false,
        error: 'شماره موبایل و کد تایید الزامی است',
        message: 'شماره موبایل و کد تایید الزامی است',
      });
    }

    // Check if code exists
    const storedData = verificationCodes.get(phoneNumber);
    
    if (!storedData) {
      return res.status(400).json({
        success: false,
        error: 'کد تایید یافت نشد. لطفا دوباره درخواست دهید',
        message: 'کد تایید یافت نشد. لطفا دوباره درخواست دهید',
      });
    }

    // Check if code is expired
    if (Date.now() > storedData.expiresAt) {
      verificationCodes.delete(phoneNumber);
      return res.status(400).json({
        success: false,
        error: 'کد تایید منقضی شده است',
        message: 'کد تایید منقضی شده است',
      });
    }

    // Verify code
    if (storedData.code !== verificationCode) {
      return res.status(400).json({
        success: false,
        error: 'کد تایید نادرست است',
        message: 'کد تایید نادرست است',
      });
    }

    // Delete used code
    verificationCodes.delete(phoneNumber);

    // Find user by phone number OR email
    let user = await User.findOne({
      $or: [
        { phoneNumber },
        { email: `${phoneNumber}@temp.noafarin.com` }
      ]
    });

    if (!user) {
      // Create new user
      user = await User.create({
        phoneNumber,
        phoneVerified: true,
        hasPassword: false, // User hasn't set a real password yet
        role: ['applicant'], // Default role as array
        // Generate a temporary email if needed
        email: `${phoneNumber}@temp.noafarin.com`,
        password: Math.random().toString(36).slice(-8), // Random password (won't be used)
        firstName: 'کاربر', // Default first name
        lastName: 'جدید', // Default last name
      });
    } else {
      // Update phone verification status and phone number if needed
      user.phoneVerified = true;
      if (!user.phoneNumber) {
        user.phoneNumber = phoneNumber;
      }
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role[0] || 'applicant', // Use first role for JWT
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'ورود موفقیت‌آمیز',
      data: {
        token,
        user: {
          id: user._id,
          phoneNumber: user.phoneNumber,
          email: user.email,
          role: user.role[0] || 'applicant', // Return first role
          firstName: user.firstName,
          lastName: user.lastName,
          phoneVerified: user.phoneVerified,
          hasPassword: user.hasPassword,
        },
      },
    });
  } catch (error: any) {
    console.error('❌ Verify code error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      error: error.message || 'خطا در تایید کد',
      message: error.message || 'خطا در تایید کد',
    });
  }
};

/**
 * پاک کردن کدهای منقضی شده (باید به صورت دوره‌ای اجرا شود)
 */
export const cleanupExpiredCodes = () => {
  const now = Date.now();
  for (const [phoneNumber, data] of verificationCodes.entries()) {
    if (now > data.expiresAt) {
      verificationCodes.delete(phoneNumber);
    }
  }
};

// Run cleanup every 5 minutes
setInterval(cleanupExpiredCodes, 5 * 60 * 1000);

/**
 * ثبت‌نام با اطلاعات کامل
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, phoneNumber } = req.body;

    if (!firstName || !lastName || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'نام، نام خانوادگی و شماره موبایل الزامی است'
      });
    }

    // بررسی فرمت شماره موبایل
    if (!/^09\d{9}$/.test(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: 'شماره موبایل باید 11 رقم و با 09 شروع شود'
      });
    }

    // بررسی وجود کاربر
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'این شماره موبایل قبلاً ثبت شده است'
      });
    }

    // تولید کد تایید
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 2 * 60 * 1000; // 2 دقیقه

    // ذخیره کد تایید با اطلاعات کاربر
    verificationCodes.set(phoneNumber, {
      code,
      expiresAt,
      userData: { firstName, lastName, phoneNumber }
    } as any);

    console.log(`📱 Registration verification code for ${phoneNumber}: ${code}`);

    // ارسال SMS
    const smsResult = await smsService.sendOTP(phoneNumber, code);
    if (!smsResult) {
      return res.status(500).json({
        success: false,
        message: 'خطا در ارسال پیامک'
      });
    }

    res.json({
      success: true,
      message: 'کد تایید با موفقیت ارسال شد',
      data: {
        phoneNumber,
        expiresIn: 120 // seconds
      }
    });

  } catch (error: any) {
    console.error('❌ Register error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      error: error.message || 'خطای سرور',
      message: error.message || 'خطای سرور'
    });
  }
};

/**
 * تایید کد ثبت‌نام
 */
export const verifyRegister = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, phoneNumber, code } = req.body;

    if (!firstName || !lastName || !phoneNumber || !code) {
      return res.status(400).json({
        success: false,
        message: 'تمام فیلدها الزامی است'
      });
    }

    // بررسی کد تایید
    const storedData = verificationCodes.get(phoneNumber) as any;
    if (!storedData) {
      return res.status(400).json({
        success: false,
        message: 'کد تایید منقضی شده یا نامعتبر است'
      });
    }

    if (storedData.code !== code) {
      return res.status(400).json({
        success: false,
        message: 'کد تایید نادرست است'
      });
    }

    if (Date.now() > storedData.expiresAt) {
      verificationCodes.delete(phoneNumber);
      return res.status(400).json({
        success: false,
        message: 'کد تایید منقضی شده است'
      });
    }

    // حذف کد استفاده شده
    verificationCodes.delete(phoneNumber);

    // بررسی مجدد وجود کاربر
    let user = await User.findOne({
      $or: [
        { phoneNumber },
        { email: `${phoneNumber}@temp.noafarin.com` }
      ]
    });
    
    if (user) {
      // اگر کاربر وجود داره، اطلاعاتش رو آپدیت کن
      user.firstName = firstName;
      user.lastName = lastName;
      user.phoneNumber = phoneNumber;
      user.phoneVerified = true;
      await user.save();
    } else {
      // ایجاد کاربر جدید
      user = await User.create({
        firstName,
        lastName,
        phoneNumber,
        phoneVerified: true,
        hasPassword: false, // User hasn't set a real password yet
        role: ['applicant'], // Role as array
        email: `${phoneNumber}@temp.noafarin.com`,
        password: Math.random().toString(36).slice(-8), // Random password
      });
    }

    // تولید JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        phoneNumber: user.phoneNumber,
        role: user.role[0] || 'applicant' // Use first role for JWT
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'ثبت‌نام با موفقیت انجام شد',
      data: {
        token,
        user: {
          id: user._id,
          phoneNumber: user.phoneNumber,
          email: user.email,
          role: user.role[0] || 'applicant', // Return first role
          firstName: user.firstName,
          lastName: user.lastName,
          phoneVerified: user.phoneVerified,
          hasPassword: user.hasPassword,
        }
      }
    });

  } catch (error: any) {
    console.error('❌ Verify register error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      error: error.message || 'خطای سرور',
      message: error.message || 'خطای سرور'
    });
  }
};
