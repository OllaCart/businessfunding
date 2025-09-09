# 🚀 Deployment Guide: Sure Thing Lending

This guide will walk you through deploying your business funding platform to Vercel and setting up Supabase.

## 📋 Prerequisites

- [ ] GitHub account
- [ ] Vercel account (free tier available)
- [ ] Supabase account (free tier available)
- [ ] Domain name (optional, for custom domain)

## 🗄️ Step 1: Set Up Supabase Database

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `sure-thing-lending`
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for the project to be created (2-3 minutes)

### 1.2 Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy and paste the entire contents of `scripts/setup-database.sql`
4. Click "Run" to execute the script
5. Verify all tables were created successfully

### 1.3 Create Admin User

1. Go to **Authentication** → **Users** in your Supabase dashboard
2. Click "Add user"
3. Enter your admin email and password
4. Click "Create user"
5. Go back to **SQL Editor**
6. Copy and paste the contents of `scripts/create-admin-user.sql`
7. **IMPORTANT**: Replace `admin@surethinglending.com` with your actual admin email
8. Click "Run" to create the admin profile

### 1.4 Get Supabase Credentials

1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **anon public** key
   - **service_role** key (keep this secret!)

## 🌐 Step 2: Deploy to Vercel

### 2.1 Prepare Your Repository

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Initial business funding platform setup"
   git push origin main
   ```

### 2.2 Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (default)
   - **Build Command**: `pnpm build` (or `npm run build`)
   - **Output Directory**: `.next` (default)
5. Click "Deploy"

### 2.3 Configure Environment Variables

In your Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add the following variables:

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
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-gmail-app-password

# Admin Configuration
ADMIN_EMAIL=admin@surethinglending.com
ADMIN_PHONE=(800) SURE-LOAN

# Business Information
BUSINESS_NAME=Sure Thing Lending
BUSINESS_ADDRESS=123 Business Plaza, Miami, FL 33101
BUSINESS_PHONE=(800) SURE-LOAN
BUSINESS_EMAIL=info@surethinglending.com
```

3. Click "Save" for each variable
4. Redeploy your application

## 📧 Step 3: Configure Email (Gmail SMTP)

### 3.1 Set Up Gmail App Password

1. Go to your Google Account settings
2. Navigate to **Security** → **2-Step Verification**
3. Enable 2-Step Verification if not already enabled
4. Go to **Security** → **App passwords**
5. Generate a new app password for "Mail"
6. Use this password in your `SMTP_PASS` environment variable

### 3.2 Test Email Configuration

1. Deploy your application
2. Try submitting a loan application
3. Check if confirmation emails are sent

## 🔧 Step 4: Post-Deployment Setup

### 4.1 Test Core Functionality

- [ ] Homepage loads correctly
- [ ] Loan programs display
- [ ] Application form works
- [ ] Admin dashboard accessible
- [ ] Email notifications work

### 4.2 Configure Custom Domain (Optional)

1. In Vercel dashboard, go to **Settings** → **Domains**
2. Add your custom domain: `surethinglending.com`
3. Follow DNS configuration instructions
4. Update `NEXT_PUBLIC_SITE_URL` environment variable

### 4.3 Set Up SSL Certificate

Vercel automatically provides SSL certificates for custom domains.

## 🧪 Step 5: Testing Checklist

### 5.1 User Experience Testing

- [ ] **Homepage**: Loads with correct branding and content
- [ ] **Loan Programs**: All programs display with correct information
- [ ] **Application Form**: Multi-step form works correctly
- [ ] **Success Page**: Application submission shows success message
- [ ] **Contact Form**: Contact submissions work
- [ ] **Waitlist**: Waitlist signup functions properly

### 5.2 Admin Functionality Testing

- [ ] **Admin Login**: Can access admin dashboard
- [ ] **View Applications**: Can see submitted applications
- [ ] **Manage Programs**: Can create/edit loan programs
- [ ] **View Contacts**: Can see contact submissions
- [ ] **Manage Waitlist**: Can view and manage waitlist

### 5.3 Email Testing

- [ ] **Application Confirmation**: Users receive confirmation emails
- [ ] **Admin Notifications**: Admins receive new application alerts
- [ ] **Contact Confirmations**: Contact form submissions send emails

## 🚨 Troubleshooting

### Common Issues

**Database Connection Errors**
- Verify Supabase URL and keys are correct
- Check if RLS policies are properly configured
- Ensure service role key is used for server-side operations

**Email Not Sending**
- Verify Gmail app password is correct
- Check SMTP settings in environment variables
- Ensure 2-Step Verification is enabled on Gmail

**Build Failures**
- Check for TypeScript errors
- Verify all dependencies are installed
- Check environment variables are set correctly

**Admin Access Issues**
- Verify admin user was created in database
- Check if user email matches in admin_profiles table
- Ensure RLS policies allow admin access

### Getting Help

1. Check Vercel deployment logs
2. Check Supabase logs in dashboard
3. Review browser console for client-side errors
4. Check email delivery logs

## 📊 Monitoring & Maintenance

### Regular Tasks

- [ ] Monitor application performance
- [ ] Review loan applications regularly
- [ ] Update loan programs as needed
- [ ] Backup database regularly
- [ ] Monitor email delivery rates

### Security Considerations

- [ ] Regularly update dependencies
- [ ] Monitor for security vulnerabilities
- [ ] Review admin access logs
- [ ] Keep Supabase credentials secure
- [ ] Regular database backups

## 🎉 Success!

Your business funding platform is now live! 

**Next Steps:**
1. Share your application with potential borrowers
2. Monitor application submissions
3. Process loan applications through the admin dashboard
4. Continuously improve based on user feedback

**Important URLs:**
- **Public Site**: `https://your-domain.com`
- **Admin Dashboard**: `https://your-domain.com/admin`
- **Supabase Dashboard**: `https://supabase.com/dashboard/project/your-project-id`

---

**Need Help?** Check the troubleshooting section above or review the application logs for specific error messages.
