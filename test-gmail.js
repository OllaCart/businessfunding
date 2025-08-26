const nodemailer = require('nodemailer');

// Test Gmail credentials
async function testGmail() {
  console.log('🔍 Testing Gmail configuration...');
  console.log('GMAIL_USER:', process.env.GMAIL_USER || 'Not set');
  console.log('GMAIL_APP_PASSWORD:', process.env.GMAIL_APP_PASSWORD ? 'Set (length: ' + process.env.GMAIL_APP_PASSWORD.length + ')' : 'Not set');
  
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.error('❌ Missing Gmail credentials');
    return;
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });

  try {
    // Verify connection
    console.log('🔌 Testing Gmail connection...');
    await transporter.verify();
    console.log('✅ Gmail connection successful!');
    
    // Send test email
    console.log('📧 Sending test email...');
    const info = await transporter.sendMail({
      from: `"Test Email" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER, // Send to yourself
      subject: '🧪 Gmail Test - Marina By-The-Sea',
      text: 'This is a test email to verify Gmail configuration is working.',
      html: '<h2>🧪 Gmail Test Successful!</h2><p>Your Gmail configuration is working correctly.</p>'
    });
    
    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', info.messageId);
    
  } catch (error) {
    console.error('❌ Gmail test failed:', error.message);
    
    if (error.code === 'EAUTH') {
      console.error('🔐 Authentication failed. Check your app password.');
      console.error('Make sure:');
      console.error('1. 2-Factor Authentication is enabled');
      console.error('2. App password is generated for "Mail"');
      console.error('3. App password is 16 characters long');
    } else if (error.code === 'ECONNECTION') {
      console.error('🌐 Connection failed. Check your internet connection.');
    }
  }
}

// Run test
testGmail();
