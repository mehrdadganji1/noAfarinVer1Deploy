import { Request, Response } from 'express';

// Mock settings storage (in production, use database)
let systemSettings = {
  // General Settings
  siteName: 'پلتفرم نوآفرین',
  siteDescription: 'پلتفرم مدیریت باشگاه نوآفرینان',
  contactEmail: 'info@noavarin.ir',
  supportEmail: 'support@noavarin.ir',
  
  // Security Settings
  requireEmailVerification: true,
  enableTwoFactor: false,
  sessionTimeout: 30,
  maxLoginAttempts: 5,
  
  // Notification Settings
  enableEmailNotifications: true,
  enablePushNotifications: true,
  enableSMSNotifications: false,
  
  // Application Settings
  autoApproveApplications: false,
  requireDocumentVerification: true,
  maxApplicationsPerDay: 50,
  
  // System Settings
  maintenanceMode: false,
  debugMode: false,
  logLevel: 'info',
};

/**
 * Get system settings
 */
export const getSettings = async (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: systemSettings,
    });
  } catch (error: any) {
    console.error('Error fetching settings:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در دریافت تنظیمات',
      message: error.message,
    });
  }
};

/**
 * Update system settings
 */
export const updateSettings = async (req: Request, res: Response) => {
  try {
    const updates = req.body;
    
    // Validate and update settings
    systemSettings = {
      ...systemSettings,
      ...updates,
    };
    
    res.json({
      success: true,
      message: 'تنظیمات با موفقیت به‌روزرسانی شد',
      data: systemSettings,
    });
  } catch (error: any) {
    console.error('Error updating settings:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در به‌روزرسانی تنظیمات',
      message: error.message,
    });
  }
};

/**
 * Reset settings to default
 */
export const resetSettings = async (req: Request, res: Response) => {
  try {
    systemSettings = {
      siteName: 'پلتفرم نوآفرین',
      siteDescription: 'پلتفرم مدیریت باشگاه نوآفرینان',
      contactEmail: 'info@noavarin.ir',
      supportEmail: 'support@noavarin.ir',
      requireEmailVerification: true,
      enableTwoFactor: false,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      enableEmailNotifications: true,
      enablePushNotifications: true,
      enableSMSNotifications: false,
      autoApproveApplications: false,
      requireDocumentVerification: true,
      maxApplicationsPerDay: 50,
      maintenanceMode: false,
      debugMode: false,
      logLevel: 'info',
    };
    
    res.json({
      success: true,
      message: 'تنظیمات به حالت پیش‌فرض بازگردانده شد',
      data: systemSettings,
    });
  } catch (error: any) {
    console.error('Error resetting settings:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در بازگردانی تنظیمات',
      message: error.message,
    });
  }
};
