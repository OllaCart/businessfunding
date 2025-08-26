# 📧 Email Notification Setup (Google Workspace)

## Overview
The Marina By-The-Sea website now includes comprehensive email notifications for waitlist submissions using Google Workspace (Gmail). When someone joins the waitlist, emails are sent to:
1. **All admin users** - Notification of new submission
2. **The submitter** - Confirmation and welcome message

## Setup Requirements

### 1. Google Workspace Account
- Ensure you have a Google Workspace account (or Gmail account)
- Enable 2-Factor Authentication (required for app passwords)

### 2. Generate App Password
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification if not already enabled
3. Go to "App passwords" (under 2-Step Verification)
4. Generate a new app password for "Mail"
5. Copy the 16-character password

### 3. Environment Variables
Add these to your `.env.local` file:

```bash
# Email Configuration (Google Workspace)
GMAIL_USER=info@marinabts.com
GMAIL_APP_PASSWORD=hanb xvhh nygl fbcm


# Site Configuration
NEXT_PUBLIC_SITE_URL=https://marinabts.vercel.app
```

## Features

### Admin Notifications
- **Subject**: 🚤 New Waitlist Submission - Marina By-The-Sea
- **Content**: Complete submission details including:
  - Personal information (name, email, phone, boat length)
  - Selected slips with dimensions and availability status
  - User message
  - Direct link to admin dashboard
  - Professional HTML formatting

### User Confirmations
- **Subject**: ✅ Welcome to Marina By-The-Sea Waitlist
- **Content**: 
  - Welcome message
  - Submission summary
  - Contact information
  - Professional branding

## Technical Details

### Email Service
- **Provider**: Google Workspace (Gmail) via SMTP
- **Authentication**: App-specific passwords for security
- **Fallback**: System continues working even if emails fail
- **Logging**: All email attempts are logged for debugging

### Database Integration
- Fetches admin emails from `admin_profiles` table
- Retrieves slip details for selected slips
- Handles missing data gracefully

### Error Handling
- Email failures don't break the waitlist submission
- Comprehensive logging for troubleshooting
- Graceful degradation if email service is unavailable

## Testing

### Local Development
1. Set up environment variables
2. Submit a test waitlist entry
3. Check console logs for email status
4. Verify emails are received

### Production
1. Deploy with proper environment variables
2. Test with real submissions
3. Monitor email delivery rates
4. Check admin notifications

## Customization

### Email Templates
- Templates are in `lib/email.ts`
- HTML and text versions available
- Easy to modify styling and content
- Brand colors and fonts can be updated

### Admin Recipients
- Automatically includes all users in `admin_profiles` table
- No manual email list management required
- New admins automatically receive notifications

## Troubleshooting

### Common Issues
1. **Emails not sending**: Check GMAIL_USER and GMAIL_APP_PASSWORD
2. **Authentication errors**: Verify app password is correct and 2FA is enabled
3. **Admin emails empty**: Verify admin_profiles table has emails
4. **Rate limits**: Gmail has daily sending limits (500-2000 emails/day)

### Debug Steps
1. Check console logs for error messages
2. Verify environment variables are set correctly
3. Test Gmail credentials separately
4. Ensure 2-Factor Authentication is enabled
5. Check admin_profiles table structure

## Support
For technical issues with the email system, check:
- Google Workspace documentation: [support.google.com](https://support.google.com)
- Gmail SMTP settings: [support.google.com/mail/answer/7126229](https://support.google.com/mail/answer/7126229)
- Console logs for detailed error messages
- Database structure in `scripts/001_create_marina_tables.sql`
