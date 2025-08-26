# 📧 Email Notification Setup

## Overview
The Marina By-The-Sea website now includes comprehensive email notifications for waitlist submissions. When someone joins the waitlist, emails are sent to:
1. **All admin users** - Notification of new submission
2. **The submitter** - Confirmation and welcome message

## Setup Requirements

### 1. Resend Account
- Sign up at [resend.com](https://resend.com)
- Get your API key from the dashboard

### 2. Environment Variables
Add these to your `.env.local` file:

```bash
# Email Configuration (Resend)
RESEND_API_KEY=your_resend_api_key_here

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://marinabts.vercel.app
```

### 3. Domain Verification
- Verify your domain with Resend
- Update the `from` email in `lib/email.ts` to use your verified domain

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
- **Provider**: Resend (reliable, developer-friendly)
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
1. **Emails not sending**: Check RESEND_API_KEY
2. **Admin emails empty**: Verify admin_profiles table has emails
3. **Domain issues**: Ensure domain is verified with Resend
4. **Rate limits**: Resend has generous limits for most use cases

### Debug Steps
1. Check console logs for error messages
2. Verify environment variables are set
3. Test Resend API key separately
4. Check admin_profiles table structure

## Support
For technical issues with the email system, check:
- Resend documentation: [docs.resend.com](https://docs.resend.com)
- Console logs for detailed error messages
- Database structure in `scripts/001_create_marina_tables.sql`
