const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║         Gmail SMTP Configuration Setup                    ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

console.log('📋 Follow these steps to configure Gmail SMTP:\n');
console.log('1️⃣  Open: https://myaccount.google.com/apppasswords');
console.log('2️⃣  Sign in with: noafarinevent@gmail.com');
console.log('3️⃣  Click "Create" and name it: Noafarin Platform');
console.log('4️⃣  Copy the 16-digit App Password (remove spaces)');
console.log('5️⃣  Paste it below\n');

console.log('⚠️  IMPORTANT: Make sure 2-Step Verification is enabled first!');
console.log('   Enable at: https://myaccount.google.com/security\n');

rl.question('Enter your Gmail App Password (16 digits, no spaces): ', (appPassword) => {
  appPassword = appPassword.trim().replace(/\s/g, '');
  
  if (appPassword.length !== 16) {
    console.error('\n❌ Invalid App Password! It should be exactly 16 characters.');
    console.error('   You entered:', appPassword.length, 'characters');
    rl.close();
    process.exit(1);
  }

  console.log('\n✅ App Password format is valid!');
  console.log('📝 Updating .env file...\n');

  const envPath = path.join(__dirname, '.env');
  let envContent = fs.readFileSync(envPath, 'utf8');

  // Update SMTP_PASS
  envContent = envContent.replace(
    /SMTP_PASS=.*/,
    `SMTP_PASS=${appPassword}`
  );

  // Enable email
  envContent = envContent.replace(
    /EMAIL_ENABLED=.*/,
    'EMAIL_ENABLED=true'
  );

  // Set provider to SMTP
  envContent = envContent.replace(
    /EMAIL_PROVIDER=.*/,
    'EMAIL_PROVIDER=smtp'
  );

  fs.writeFileSync(envPath, envContent);

  console.log('✅ Configuration updated successfully!\n');
  console.log('📧 Email settings:');
  console.log('   Provider: Gmail SMTP');
  console.log('   Host: smtp.gmail.com');
  console.log('   Port: 587');
  console.log('   User: noafarinevent@gmail.com');
  console.log('   Pass: ****************\n');

  console.log('🧪 Testing email configuration...\n');

  rl.close();

  // Test email
  const { exec } = require('child_process');
  exec('node test-email.js', (error, stdout, stderr) => {
    console.log(stdout);
    if (stderr) console.error(stderr);
    
    if (error) {
      console.error('\n❌ Email test failed!');
      console.error('   Please check the error above and try again.');
      process.exit(1);
    } else {
      console.log('\n🎉 SUCCESS! Email service is now configured and working!');
      console.log('   You can now restart your service to apply changes.\n');
    }
  });
});
