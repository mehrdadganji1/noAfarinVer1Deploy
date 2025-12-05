import nodemailer from 'nodemailer';
import crypto from 'crypto';
import dotenv from 'dotenv';
import path from 'path';

// Load .env file
const envPath = path.resolve(__dirname, '../../.env');
const envResult = dotenv.config({ path: envPath });

if (envResult.error) {
  console.error('⚠️  Failed to load .env in emailService:', envResult.error.message);
}

/**
 * Email Service with multiple provider support
 */
class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private emailEnabled: boolean;
  private silentFail: boolean;
  private provider: 'smtp' | 'resend';

  constructor() {
    this.emailEnabled = process.env.EMAIL_ENABLED !== 'false';
    this.silentFail = process.env.EMAIL_SILENT_FAIL === 'true';
    this.provider = (process.env.EMAIL_PROVIDER as any) || 'smtp';

    if (!this.emailEnabled) {
      console.log('📧 Email service disabled by configuration');
      return;
    }

    this.initializeProvider();
  }

  /**
   * Initialize email provider
   */
  private initializeProvider(): void {
    if (this.provider === 'resend') {
      this.initializeResend();
    } else {
      this.initializeSMTP();
    }
  }

  /**
   * Initialize Resend provider
   */
  private initializeResend(): void {
    const apiKey = process.env.RESEND_API_KEY;
    
    if (!apiKey || apiKey.includes('REPLACE')) {
      console.log('⚠️  Resend API key not configured, falling back to SMTP');
      this.provider = 'smtp';
      this.initializeSMTP();
      return;
    }

    console.log('✅ Email service ready (Resend)');
    console.log('📧 Provider: Resend API');
  }

  /**
   * Initialize SMTP provider
   */
  private initializeSMTP(): void {
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpUser || !smtpPass || smtpPass.includes('REPLACE')) {
      console.error('❌ SMTP credentials are missing or invalid!');
      console.error(`   SMTP_USER: ${smtpUser ? '✅ Set' : '❌ Missing'}`);
      console.error(`   SMTP_PASS: ${smtpPass && !smtpPass.includes('REPLACE') ? '✅ Set' : '❌ Missing/Invalid'}`);
      
      if (this.silentFail) {
        console.log('⚠️  Email service will fail silently');
        return;
      } else {
        throw new Error('SMTP credentials must be configured in .env file');
      }
    }

    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    this.verifyConnection();
  }

  /**
   * Verify SMTP connection
   */
  private async verifyConnection(): Promise<void> {
    if (!this.transporter) return;

    // Skip verification in silent fail mode to prevent crashes
    if (this.silentFail) {
      console.log('⚠️  SMTP verification skipped (silent fail mode)');
      return;
    }

    try {
      await this.transporter.verify();
      console.log('✅ Email service ready (SMTP)');
      console.log(`📧 SMTP: ${process.env.SMTP_HOST}:${process.env.SMTP_PORT}`);
      console.log(`👤 User: ${process.env.SMTP_USER}`);
    } catch (error: any) {
      console.error('❌ SMTP verification failed:', error.message);
      
      if (error.responseCode === 535) {
        console.error('\n🔧 GMAIL AUTHENTICATION FAILED - Follow these steps:');
        console.error('   1. Go to: https://myaccount.google.com/apppasswords');
        console.error('   2. Sign in with your Gmail account');
        console.error('   3. Create new App Password named "Noafarin Platform"');
        console.error('   4. Copy the 16-digit password (remove spaces)');
        console.error('   5. Update SMTP_PASS in .env file');
        console.error('   6. Restart the service\n');
      }
      
      if (!this.silentFail) {
        throw error;
      }
    }
  }

  /**
   * Generate verification token
   */
  generateVerificationToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Send email using Resend API
   */
  private async sendWithResend(options: {
    to: string;
    subject: string;
    html: string;
  }): Promise<boolean> {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `${process.env.APP_NAME} <${process.env.SMTP_FROM}>`,
          to: options.to,
          subject: options.subject,
          html: options.html,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Resend API error: ${JSON.stringify(error)}`);
      }

      const data = await response.json() as { id: string };
      console.log('✅ Email sent via Resend:', data.id);
      return true;
    } catch (error: any) {
      console.error('❌ Resend failed:', error.message);
      
      // Fallback to SMTP
      if (this.transporter) {
        console.log('🔄 Falling back to SMTP...');
        return this.sendWithSMTP(options);
      }
      
      throw error;
    }
  }

  /**
   * Send email using SMTP
   */
  private async sendWithSMTP(options: {
    to: string;
    subject: string;
    html: string;
  }): Promise<boolean> {
    if (!this.transporter) {
      throw new Error('SMTP transporter not initialized');
    }

    const mailOptions = {
      from: `"${process.env.APP_NAME || 'Noafarin'}" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    const info = await this.transporter.sendMail(mailOptions);
    console.log('✅ Email sent via SMTP:', info.messageId);
    return true;
  }

  /**
   * Send verification email
   */
  async sendVerificationEmail(
    email: string,
    name: string,
    token: string
  ): Promise<boolean> {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 VERIFICATION EMAIL');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('To:', email);
    console.log('Name:', name);
    console.log('Verification URL:', verificationUrl);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    if (!this.emailEnabled) {
      console.log('⚠️  Email service disabled');
      return this.silentFail;
    }

    try {
      const emailOptions = {
        to: email,
        subject: 'تایید ایمیل - پلتفرم نوآفرین',
        html: this.getVerificationEmailTemplate(name, verificationUrl),
      };

      if (this.provider === 'resend') {
        return await this.sendWithResend(emailOptions);
      } else {
        return await this.sendWithSMTP(emailOptions);
      }
    } catch (error: any) {
      console.error('❌ Failed to send verification email:', error.message);
      
      if (this.silentFail) {
        console.log('⚠️  Continuing despite email failure (silent mode)');
        return true;
      }
      
      throw error;
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(
    email: string,
    name: string,
    token: string
  ): Promise<boolean> {
    if (!this.emailEnabled) {
      console.log('📧 Email disabled - skipping password reset email');
      return this.silentFail;
    }

    try {
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

      const emailOptions = {
        to: email,
        subject: 'بازیابی رمز عبور - پلتفرم نوآفرین',
        html: this.getPasswordResetEmailTemplate(name, resetUrl),
      };

      if (this.provider === 'resend') {
        return await this.sendWithResend(emailOptions);
      } else {
        return await this.sendWithSMTP(emailOptions);
      }
    } catch (error: any) {
      console.error('❌ Failed to send password reset email:', error.message);
      
      if (this.silentFail) {
        return true;
      }
      
      throw error;
    }
  }

  /**
   * Send generic email
   */
  async sendEmail(options: {
    to: string;
    subject: string;
    html: string;
  }): Promise<boolean> {
    if (!this.emailEnabled) {
      console.log('📧 Email disabled - skipping email to:', options.to);
      return this.silentFail;
    }

    try {
      if (this.provider === 'resend') {
        return await this.sendWithResend(options);
      } else {
        return await this.sendWithSMTP(options);
      }
    } catch (error: any) {
      console.error('❌ Failed to send email:', error.message);
      
      if (this.silentFail) {
        return true;
      }
      
      return false;
    }
  }

  /**
   * Send welcome email
   */
  async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    if (!this.emailEnabled) {
      console.log('📧 Email disabled - skipping welcome email');
      return this.silentFail;
    }

    try {
      const emailOptions = {
        to: email,
        subject: 'خوش آمدید به پلتفرم نوآفرین',
        html: this.getWelcomeEmailTemplate(name),
      };

      if (this.provider === 'resend') {
        return await this.sendWithResend(emailOptions);
      } else {
        return await this.sendWithSMTP(emailOptions);
      }
    } catch (error: any) {
      console.error('❌ Failed to send welcome email:', error.message);
      
      if (this.silentFail) {
        return true;
      }
      
      return false;
    }
  }

  /**
   * Verification email template
   */
  private getVerificationEmailTemplate(name: string, verificationUrl: string): string {
    return `
      <!DOCTYPE html>
      <html dir="rtl" lang="fa">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 20px;
            text-align: center;
            color: white;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
          }
          .content {
            padding: 40px 30px;
            text-align: right;
          }
          .content p {
            line-height: 1.8;
            color: #333;
            margin: 15px 0;
          }
          .button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 40px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
          }
          .button:hover {
            opacity: 0.9;
          }
          .footer {
            background: #f9f9f9;
            padding: 20px;
            text-align: center;
            color: #666;
            font-size: 14px;
          }
          .divider {
            height: 1px;
            background: #e0e0e0;
            margin: 30px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎓 پلتفرم نوآفرین</h1>
          </div>
          <div class="content">
            <p><strong>سلام ${name} عزیز،</strong></p>
            
            <p>از اینکه به پلتفرم نوآفرین پیوستید، خوشحالیم! 🎉</p>
            
            <p>برای تکمیل فرآیند ثبت‌نام و فعال‌سازی حساب کاربری خود، لطفاً ایمیل خود را تایید کنید.</p>
            
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">تایید ایمیل</a>
            </div>
            
            <div class="divider"></div>
            
            <p><strong>📌 نکات مهم:</strong></p>
            <ul style="line-height: 1.8; color: #666;">
              <li>این لینک تنها برای 24 ساعت معتبر است</li>
              <li>در صورت عدم دریافت ایمیل، پوشه اسپم را بررسی کنید</li>
              <li>اگر شما این حساب را ایجاد نکرده‌اید، این ایمیل را نادیده بگیرید</li>
            </ul>
            
            <p>اگر دکمه کار نمی‌کند، این لینک را در مرورگر خود کپی کنید:</p>
            <p style="background: #f9f9f9; padding: 10px; border-radius: 5px; word-break: break-all; font-size: 12px;">
              ${verificationUrl}
            </p>
          </div>
          <div class="footer">
            <p>© 2025 پلتفرم نوآفرین. تمامی حقوق محفوظ است.</p>
            <p>این ایمیل به صورت خودکار ارسال شده است، لطفاً پاسخ ندهید.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Password reset email template
   */
  private getPasswordResetEmailTemplate(name: string, resetUrl: string): string {
    return `
      <!DOCTYPE html>
      <html dir="rtl" lang="fa">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 40px 20px; text-align: center; color: white; }
          .content { padding: 40px 30px; text-align: right; }
          .button { display: inline-block; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
          .footer { background: #f9f9f9; padding: 20px; text-align: center; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔒 بازیابی رمز عبور</h1>
          </div>
          <div class="content">
            <p><strong>سلام ${name}،</strong></p>
            <p>درخواست بازیابی رمز عبور برای حساب کاربری شما دریافت شد.</p>
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">بازیابی رمز عبور</a>
            </div>
            <p><strong>⚠️ توجه:</strong> این لینک تنها برای 1 ساعت معتبر است.</p>
            <p>اگر شما این درخواست را نداده‌اید، این ایمیل را نادیده بگیرید.</p>
          </div>
          <div class="footer">
            <p>© 2025 پلتفرم نوآفرین</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Welcome email template
   */
  private getWelcomeEmailTemplate(name: string): string {
    return `
      <!DOCTYPE html>
      <html dir="rtl" lang="fa">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 40px 20px; text-align: center; color: white; }
          .content { padding: 40px 30px; text-align: right; line-height: 1.8; }
          .footer { background: #f9f9f9; padding: 20px; text-align: center; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 خوش آمدید!</h1>
          </div>
          <div class="content">
            <p><strong>سلام ${name} عزیز،</strong></p>
            <p>ایمیل شما با موفقیت تایید شد و اکنون می‌توانید از تمام امکانات پلتفرم استفاده کنید.</p>
            <p><strong>گام‌های بعدی:</strong></p>
            <ol>
              <li>تکمیل پروفایل شخصی</li>
              <li>ثبت فرم درخواست</li>
              <li>آپلود مدارک مورد نیاز</li>
            </ol>
            <p>موفق باشید! 🚀</p>
          </div>
          <div class="footer">
            <p>© 2025 پلتفرم نوآفرین</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

export default new EmailService();
