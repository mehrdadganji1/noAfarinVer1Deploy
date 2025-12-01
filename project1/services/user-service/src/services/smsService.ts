import axios from 'axios';

const SMS_IR_API_KEY = process.env.SMS_IR_API_KEY || 'mCRnbLcYV1QLnYejy13WymVBlcX4dbiViHMO7PklFZM08KXhUBD4BWYy7fmH0rUA';
const SMS_IR_BASE_URL = 'https://api.sms.ir';
const SMS_IR_LINE_NUMBER = process.env.SMS_IR_LINE_NUMBER || ''; // شماره خط شما

interface SmsResponse {
  status: number;
  message: string;
  data: any;
}

class SmsService {
  private apiKey: string;
  private baseUrl: string;
  private lineNumber: string;

  constructor() {
    this.apiKey = SMS_IR_API_KEY;
    this.baseUrl = SMS_IR_BASE_URL;
    this.lineNumber = SMS_IR_LINE_NUMBER;
  }

  /**
   * ارسال کد تایید با الگوی از پیش تعریف شده
   */
  async sendVerificationCode(
    phoneNumber: string,
    templateId: number,
    parameters: Array<{ name: string; value: string }>
  ): Promise<SmsResponse> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/v1/send/verify`,
        {
          mobile: phoneNumber,
          templateId: templateId,
          parameters: parameters,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-API-KEY': this.apiKey,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('SMS.ir Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'خطا در ارسال پیامک');
    }
  }

  /**
   * ارسال پیام ساده
   */
  async sendSms(
    phoneNumber: string,
    message: string
  ): Promise<SmsResponse> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/v1/send/bulk`,
        {
          lineNumber: this.lineNumber,
          messageText: message,
          mobiles: [phoneNumber],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-API-KEY': this.apiKey,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('SMS.ir Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'خطا در ارسال پیامک');
    }
  }

  /**
   * تولید کد تایید 6 رقمی
   */
  generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * ارسال کد تایید (با استفاده از الگو یا پیام ساده)
   */
  async sendOTP(phoneNumber: string, code: string): Promise<boolean> {
    try {
      // روش 1: استفاده از Template API (بهترین روش - بدون نیاز به lineNumber)
      const templateId = parseInt(process.env.SMS_IR_TEMPLATE_ID || '0');
      if (templateId > 0) {
        console.log('📱 Sending SMS via Template API...');
        await this.sendVerificationCode(phoneNumber, templateId, [
          { name: 'CODE', value: code }
        ]);
        console.log('✅ SMS sent successfully via Template');
        return true;
      }

      // روش 2: استفاده از Fast Send API (نیاز به lineNumber ندارد)
      console.log('📱 Sending SMS via Fast Send API...');
      const response = await axios.post(
        `${this.baseUrl}/v1/send`,
        {
          mobile: phoneNumber,
          templateId: 100000, // Template ID پیش‌فرض برای OTP
          parameters: [
            { name: 'Code', value: code }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-API-KEY': this.apiKey,
          },
        }
      );
      
      console.log('✅ SMS sent successfully:', response.data);
      return true;

    } catch (error: any) {
      console.error('❌ Error sending OTP:', error.response?.data || error.message);
      
      // اگر Template کار نکرد، از Ultra Fast Send استفاده کن
      try {
        console.log('📱 Trying Ultra Fast Send...');
        const response = await axios.post(
          `${this.baseUrl}/v1/send/verify`,
          {
            mobile: phoneNumber,
            templateId: 100000,
            parameters: [
              { name: 'Code', value: code }
            ]
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'X-API-KEY': this.apiKey,
            },
          }
        );
        
        console.log('✅ SMS sent via Ultra Fast Send:', response.data);
        return true;
      } catch (fallbackError: any) {
        console.error('❌ Ultra Fast Send also failed:', fallbackError.response?.data || fallbackError.message);
        throw new Error('خطا در ارسال پیامک. لطفا بعداً تلاش کنید');
      }
    }
  }

  /**
   * دریافت اعتبار حساب
   */
  async getCredit(): Promise<number> {
    try {
      const response = await axios.get(`${this.baseUrl}/v1/credit`, {
        headers: {
          'Accept': 'application/json',
          'X-API-KEY': this.apiKey,
        },
      });

      return response.data.data;
    } catch (error: any) {
      console.error('SMS.ir Error:', error.response?.data || error.message);
      throw new Error('خطا در دریافت اعتبار');
    }
  }
}

export default new SmsService();
