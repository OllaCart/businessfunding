# Environment Variables Setup Guide

## 🔧 **Vercel Environment Variables Configuration**

### **Step 1: Access Vercel Dashboard**
1. Go to [vercel.com](https://vercel.com) and sign in
2. Select your `businessFunding` project
3. Go to **Settings** → **Environment Variables**
4. Click **Add New** for each variable

### **Step 2: Required Environment Variables**

Add these environment variables to your Vercel project:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-vercel-app.vercel.app

# Email Configuration (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=support@unbeatableloans.com
SMTP_PASS=your-gmail-app-password

# Admin Configuration
ADMIN_EMAIL=support@unbeatableloans.com
ADMIN_PHONE=(800) SURE-LOAN

# Business Information
BUSINESS_NAME=Sure Thing Lending
BUSINESS_ADDRESS=123 Business Plaza, Miami, FL 33101
BUSINESS_PHONE=(800) SURE-LOAN
BUSINESS_EMAIL=support@unbeatableloans.com

# Security
NEXTAUTH_SECRET=your-random-secret-key-here
NEXTAUTH_URL=https://your-vercel-app.vercel.app
```

### **Step 3: How to Get Each Value**

#### **Supabase Variables:**
1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy the following:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

#### **Gmail App Password Setup:**
1. **Set up Gmail account** for `support@unbeatableloans.com`
2. **Enable 2-Step Verification** on the Gmail account
3. **Generate App Password:**
   - Go to Google Account Settings → Security
   - Under "2-Step Verification" → App passwords
   - Generate a new app password for "Mail"
   - Use this password in `SMTP_PASS`

#### **Security Keys:**
- **NEXTAUTH_SECRET**: Generate a random string (use: `openssl rand -base64 32`)
- **NEXTAUTH_URL**: Your Vercel app URL (e.g., `https://businessfunding.vercel.app`)

### **Step 4: Adding Variables in Vercel**

For each variable:
1. **Name**: Enter the variable name (e.g., `NEXT_PUBLIC_SUPABASE_URL`)
2. **Value**: Enter the actual value
3. **Environment**: Select **Production**, **Preview**, and **Development**
4. Click **Save**

### **Step 5: After Adding Variables**

1. **Redeploy** your application (Vercel will automatically redeploy)
2. **Test** the email functionality by submitting a loan application
3. **Verify** that emails are being sent to `support@unbeatableloans.com`

### **Step 6: Testing Email Configuration**

After setting up the environment variables:

1. Go to your live site
2. Navigate to `/onboarding/apply`
3. Submit a test loan application
4. Check if confirmation emails are sent
5. Verify admin notifications work

### **Step 7: Troubleshooting**

#### **Common Issues:**

**Email not sending:**
- Verify Gmail app password is correct
- Check that 2-Step Verification is enabled
- Ensure `SMTP_USER` matches the Gmail account

**Database connection issues:**
- Verify Supabase URL and keys are correct
- Check that RLS policies are properly configured
- Ensure service role key has proper permissions

**Environment variables not loading:**
- Make sure variables are added to the correct environment (Production/Preview/Development)
- Redeploy the application after adding variables
- Check variable names match exactly (case-sensitive)

### **Step 8: Security Best Practices**

- Never commit environment variables to git
- Use different values for development and production
- Regularly rotate sensitive keys
- Monitor access logs for suspicious activity

## 📧 **Email Template Configuration**

The application uses the following email templates:
- **Application confirmation** (sent to applicant)
- **Admin notification** (sent to support@unbeatableloans.com)
- **Welcome email** (sent after successful application)

All emails are configured to use `support@unbeatableloans.com` as the sender and admin contact.

## 🔐 **Database Security**

The application uses Supabase with Row Level Security (RLS) policies to ensure:
- Only authenticated users can access their own data
- Admin users have appropriate access levels
- Sensitive information is protected

## 📱 **Mobile Responsiveness**

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🚀 **Deployment Checklist**

Before going live, ensure:
- [ ] All environment variables are set
- [ ] Email configuration is working
- [ ] Database is properly configured
- [ ] Application is responsive on all devices
- [ ] All forms are working correctly
- [ ] Admin dashboard is accessible
- [ ] SSL certificate is active (Vercel handles this automatically)

## 📞 **Support**

For technical support or questions:
- Email: support@unbeatableloans.com
- Phone: (800) SURE-LOAN
- Business Hours: Monday-Friday, 9 AM - 6 PM EST
