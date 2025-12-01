const nodemailer = require('nodemailer');
require('dotenv').config();

async function testEmail() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║         Email Service Diagnostic Test                     ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');
  
  // Check configuration
  console.log('📋 Configuration Check:');
  const checks = {
    'EMAIL_ENABLED': process.env.EMAIL_ENABLED,
    'EMAIL_PROVIDER': process.env.EMAIL_PROVIDER || 'smtp',
    'SMTP_HOST': process.env.SMTP_HOST,
    'SMTP_PORT': process.env.SMTP_PORT,
    'SMTP_USER': process.env.SMTP_USER,
    'SMTP_PASS': process.env.SMTP_PASS,
    'SMTP_FROM': process.env.SMTP_FROM,
    'FRONTEND_URL': process.env.FRONTEND_URL,
  };

  let hasErrors = false;
  for (const [key, value] of Object.entries(checks)) {
    const status = value && !value.includes('REPLACE') ? '✅' : '❌';
    if (status === '❌') hasErrors = true;
    
    let displayValue = value;
    if (key === 'SMTP_PASS' && value) {
      displayValue = value.includes('REPLACE') ? '❌ Not configured' : `✅ Set (${value.length} chars)`;
    }
    
    console.log(`   ${status} ${key}: ${displayValue || '❌ Missing'}`);
  }
  console.log('');

  if (hasErrors) {
    console.error('❌ Configuration errors detected!');
    console.error('\n🔧 To fix:');
    console.error('   1. Run: node setup-gmail.js');
    console.error('   2. Or manually update .env file');
    console.error('   3. See EMAIL_SETUP_GUIDE.md for details\n');
    process.exit(1);
  }

  if (process.env.EMAIL_ENABLED === 'false') {
    console.log('⚠️  Email service is disabled (EMAIL_ENABLED=false)');
    console.log('   Enable it in .env to test email functionality\n');
    process.exit(0);
  }

  // Test SMTP connection
  console.log('🔌 Testing SMTP Connection...');
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    debug: false,
  });

  try {
    await transporter.verify();
    console.log('✅ SMTP connection successful!\n');
  } catch (error) {
    console.error('❌ SMTP connection failed!');
    console.error(`   Error: ${error.message}\n`);
    
    if (error.responseCode === 535) {
      console.error('🔧 AUTHENTICATION ERROR - Gmail App Password is invalid!');
      console.error('\n   Follow these steps:');
      console.error('   1. Go to: https://myaccount.google.com/apppasswords');
      console.error('   2. Sign in with: ' + process.env.SMTP_USER);
      console.error('   3. Create new App Password named "Noafarin Platform"');
      console.error('   4. Run: node setup-gmail.js');
      console.error('   5. Enter the new 16-digit password\n');
    } else if (error.code === 'ECONNECTION' || error.code === 'ETIMEDOUT') {
      console.error('🔧 CONNECTION ERROR - Cannot reach Gmail servers!');
      console.error('\n   Possible causes:');
      console.error('   1. No internet connection');
      console.error('   2. Firewall blocking port 587');
      console.error('   3. VPN interfering with connection');
      console.error('   4. Gmail servers temporarily down\n');
    }
    
    process.exit(1);
  }

  // Send test email
  console.log('📧 Sending test email...');
  try {
    const testEmail = process.env.SMTP_USER;
    const info = await transporter.sendMail({
      from: `"${process.env.APP_NAME}" <${process.env.SMTP_FROM}>`,
      to: testEmail,
      subject: '✅ تست موفق - سیستم ایمیل نوآفرین',
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="fa">
        <head>
          <meta charset="UTF-8">
          <style>
            body { 
              font-family: Tahoma, sans-serif; 
              padding: 20px; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              margin: 0;
            }
            .container { 
              max-width: 600px; 
              margin: 40px auto; 
              background: white; 
              padding: 40px; 
              border-radius: 15px;
              box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            }
            h1 { 
              color: #667eea; 
              margin-top: 0;
              font-size: 32px;
            }
            .success { 
              background: #d4edda; 
              border: 2px solid #28a745; 
              padding: 15px; 
              border-radius: 8px;
              margin: 20px 0;
            }
            .info { 
              background: #f8f9fa; 
              padding: 15px; 
              border-radius: 8px;
              margin: 10px 0;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 2px solid #e0e0e0;
              color: #666;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🎉 تست موفق!</h1>
            
            <div class="success">
              <strong>✅ سیستم ارسال ایمیل با موفقیت پیکربندی شده است.</strong>
            </div>
            
            <div class="info">
              <p><strong>📅 زمان ارسال:</strong> ${new Date().toLocaleString('fa-IR')}</p>
              <p><strong>🌐 سرویس:</strong> ${process.env.SMTP_HOST}</p>
              <p><strong>👤 فرستنده:</strong> ${process.env.SMTP_FROM}</p>
              <p><strong>📬 گیرنده:</strong> ${testEmail}</p>
            </div>
            
            <p>اکنون می‌توانید از سیستم ایمیل برای:</p>
            <ul>
              <li>✉️ تایید ایمیل کاربران</li>
              <li>🔒 بازیابی رمز عبور</li>
              <li>🎊 ایمیل‌های خوش‌آمدگویی</li>
              <li>📢 اطلاع‌رسانی‌ها</li>
            </ul>
            
            <div class="footer">
              <p>© 2025 پلتفرم نوآفرین</p>
              <p>این یک ایمیل تست خودکار است.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log('✅ Test email sent successfully!\n');
    console.log('📊 Email Details:');
    console.log(`   Message ID: ${info.messageId}`);
    console.log(`   Response: ${info.response}`);
    console.log(`   Recipient: ${testEmail}`);
    
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║              🎉 ALL TESTS PASSED! 🎉                      ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log('\n✅ Email service is fully operational!');
    console.log(`📬 Check your inbox at: ${testEmail}`);
    console.log('🚀 You can now restart your service to use email features.\n');
    
  } catch (error) {
    console.error('\n❌ Failed to send test email!');
    console.error(`   Error: ${error.message}`);
    
    if (error.responseCode === 550) {
      console.error('\n🔧 RECIPIENT ERROR - Email address rejected!');
      console.error('   Check that SMTP_FROM is a valid email address.\n');
    }
    
    process.exit(1);
  }
}

testEmail();
