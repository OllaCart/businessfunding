# 📧 Gmail Setup for Marina Website

## Quick Setup Guide

### 1. Enable 2-Factor Authentication
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Click on "2-Step Verification"
3. Follow the setup process if not already enabled

### 2. Generate App Password
1. In Google Account Security, click on "App passwords"
2. Select "Mail" as the app
3. Select "Other" as the device
4. Enter "Marina Website" as the name
5. Click "Generate"
6. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

### 3. Set Environment Variables
Create a `.env.local` file in your project root with:

```bash
# Gmail Configuration
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_16_character_app_password

# Other required variables
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Test Configuration
Run the test script to verify Gmail is working:

```bash
node test-gmail.js
```

## Troubleshooting

### Common Issues:
- **"Invalid credentials"**: Check that 2FA is enabled and app password is correct
- **"Less secure app access"**: Use app passwords instead of regular passwords
- **"Rate limit exceeded"**: Gmail has daily sending limits (500-2000 emails/day)

### For Production (Vercel):
1. Add the environment variables in your Vercel project settings
2. Redeploy the application
3. Test admin account creation

## Security Notes
- App passwords are more secure than regular passwords
- Never commit `.env.local` to version control
- Each app password is unique and can be revoked individually
- 2FA must remain enabled for app passwords to work
