// Email templates for Marina By-The-Sea onboarding system

export interface SlipOfferData {
  boaterName: string
  slipNumber: string
  boatLength: number
  boatBeam: number
  pricePerFoot: number
  monthlyTaxes: number
  totalMonthlyCost: number
  offerPassword: string
  offerExpiresAt: Date
  secureFormUrl: string
  adminName: string
  termsAndConditions?: string
}

export interface ApplicationReminderData {
  boaterName: string
  slipNumber: string
  daysRemaining: number
  secureFormUrl: string
  offerPassword: string
  adminName: string
}

export interface ApplicationApprovalData {
  boaterName: string
  slipNumber: string
  startingDate: Date
  totalMonthlyCost: number
  adminName: string
  adminPhone: string
  adminEmail: string
}

export interface WelcomeData {
  boaterName: string
  slipNumber: string
  startingDate: Date
  totalMonthlyCost: number
  adminName: string
  marinaAddress: string
  marinaPhone: string
  marinaEmail: string
}

// Slip Offer Email Template
export function generateSlipOfferEmail(data: SlipOfferData) {
  const formattedExpiryDate = data.offerExpiresAt.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const textContent = `Dear ${data.boaterName},

🎉 EXCITING NEWS! We have a slip available for you at Marina By-The-Sea!

We're pleased to offer you Slip ${data.slipNumber} for your ${data.boatLength}' boat. This premium slip is perfectly suited for your vessel and comes with all our world-class amenities.

📋 SLIP OFFER DETAILS:
• Slip Number: ${data.slipNumber}
• Boat Dimensions: ${data.boatLength}' L × ${data.boatBeam}' W
• Price Per Foot: $${data.pricePerFoot.toFixed(2)}
• Monthly Taxes (7%): $${data.monthlyTaxes.toFixed(2)}
• Total Monthly Cost: $${data.totalMonthlyCost.toFixed(2)}

🔐 SECURE APPLICATION FORM:
To accept this offer and complete your application, please visit:
${data.secureFormUrl}

Password: ${data.offerPassword}

⏰ OFFER EXPIRES: ${formattedExpiryDate}

📝 WHAT YOU'LL NEED TO PROVIDE:
• Proof of boat insurance
• Boat registration
• Copy of driver's license
• ACH or credit card information for recurring payments
• Complete boater information form

💬 QUESTIONS?
If you have any questions about this offer or need assistance with the application process, please don't hesitate to contact us.

We're excited to welcome you to Marina By-The-Sea!

Best regards,
${data.adminName}
Marina By-The-Sea Administration Team

---
Marina By-The-Sea
230 Basin Drive
Lauderdale By-The-Sea, FL 33308
Phone: (954) 123-4567
Email: dylan@dreamsdev.co

This offer expires on ${formattedExpiryDate}. Please complete your application before this date to secure your slip.`

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
      <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 30px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 28px; font-weight: bold;">🎉 Slip Available!</h1>
        <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">Marina By-The-Sea has a slip for you</p>
      </div>
      
      <div style="padding: 30px;">
        <h2 style="color: #1f2937; margin-bottom: 20px;">Dear ${data.boaterName},</h2>
        
        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #22c55e;">
          <p style="margin: 0; color: #166534; font-weight: 500; font-size: 16px;">
            We're pleased to offer you <strong>Slip ${data.slipNumber}</strong> for your ${data.boatLength}' boat. This premium slip is perfectly suited for your vessel and comes with all our world-class amenities.
          </p>
        </div>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">📋 SLIP OFFER DETAILS</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Slip Number:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${data.slipNumber}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Boat Dimensions:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${data.boatLength}' L × ${data.boatBeam}' W</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Price Per Foot:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">$${data.pricePerFoot.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Monthly Taxes (7%):</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">$${data.monthlyTaxes.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Total Monthly Cost:</strong></td>
              <td style="padding: 8px 0; font-weight: bold; color: #1e3a8a;">$${data.totalMonthlyCost.toFixed(2)}</td>
            </tr>
          </table>
        </div>
        
        <div style="background: #e0e7ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
          <h3 style="color: #374151; margin-top: 0;">🔐 SECURE APPLICATION FORM</h3>
          <p style="margin-bottom: 15px;">To accept this offer and complete your application, please visit:</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${data.secureFormUrl}" 
               style="background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 500; display: inline-block;">
              Complete Application Form
            </a>
          </div>
          <p style="margin: 15px 0 0 0; text-align: center; font-weight: 500;">
            Password: <span style="background: #f3f4f6; padding: 5px 10px; border-radius: 4px; font-family: monospace;">${data.offerPassword}</span>
          </p>
        </div>
        
        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <h3 style="color: #374151; margin-top: 0;">⏰ OFFER EXPIRES: ${formattedExpiryDate}</h3>
          <p style="margin: 0; color: #92400e;">Please complete your application before this date to secure your slip.</p>
        </div>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">📝 WHAT YOU'LL NEED TO PROVIDE</h3>
          <ul style="margin: 0; padding-left: 20px; color: #374151;">
            <li>Proof of boat insurance</li>
            <li>Boat registration</li>
            <li>Copy of driver's license</li>
            <li>ACH or credit card information for recurring payments</li>
            <li>Complete boater information form</li>
          </ul>
        </div>
        
        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #22c55e;">
          <h3 style="color: #374151; margin-top: 0;">💬 QUESTIONS?</h3>
          <p style="margin: 0; color: #166534;">
            If you have any questions about this offer or need assistance with the application process, please don't hesitate to contact us.
          </p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <p style="color: #374151; font-weight: 500; margin-bottom: 5px;">We're excited to welcome you to Marina By-The-Sea!</p>
          <p style="color: #6b7280; margin: 0;">Best regards,</p>
          <p style="color: #1e3a8a; font-weight: 500; margin: 5px 0;">${data.adminName}</p>
          <p style="color: #6b7280; margin: 0;">Marina By-The-Sea Administration Team</p>
        </div>
      </div>
      
      <div style="background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
        <p style="margin: 5px 0; color: #6b7280; font-size: 14px;"><strong>Marina By-The-Sea</strong></p>
        <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">230 Basin Drive</p>
        <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">Lauderdale By-The-Sea, FL 33308</p>
        <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">Phone: (954) 123-4567 | Email: dylan@dreamsdev.co</p>
        <p style="margin: 15px 0 0 0; color: #9ca3af; font-size: 12px;">
          This offer expires on ${formattedExpiryDate}. Please complete your application before this date to secure your slip.
        </p>
      </div>
    </div>`

  return { textContent, htmlContent }
}

// Application Reminder Email Template
export function generateApplicationReminderEmail(data: ApplicationReminderData) {
  const textContent = `Dear ${data.boaterName},

⏰ REMINDER: Your slip offer is expiring soon!

We sent you an offer for Slip ${data.slipNumber} at Marina By-The-Sea, and we haven't received your application yet. 

You have ${data.daysRemaining} day${data.daysRemaining === 1 ? '' : 's'} remaining to complete your application and secure your slip.

🔐 SECURE APPLICATION FORM:
${data.secureFormUrl}

Password: ${data.offerPassword}

Don't miss out on this opportunity! Complete your application today to secure your premium slip at Marina By-The-Sea.

If you need assistance or have questions, please contact us immediately.

Best regards,
${data.adminName}
Marina By-The-Sea Administration Team

---
Marina By-The-Sea
230 Basin Drive
Lauderdale By-The-Sea, FL 33308
Phone: (954) 123-4567
Email: dylan@dreamsdev.co`

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
      <div style="background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); padding: 30px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 28px; font-weight: bold;">⏰ Offer Expiring Soon!</h1>
        <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">Complete your application today</p>
      </div>
      
      <div style="padding: 30px;">
        <h2 style="color: #1f2937; margin-bottom: 20px;">Dear ${data.boaterName},</h2>
        
        <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
          <p style="margin: 0; color: #991b1b; font-weight: 500; font-size: 16px;">
            We sent you an offer for <strong>Slip ${data.slipNumber}</strong> at Marina By-The-Sea, and we haven't received your application yet.
          </p>
        </div>
        
        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <h3 style="color: #374151; margin-top: 0;">⏰ TIME REMAINING</h3>
          <p style="margin: 0; color: #92400e; font-size: 18px; font-weight: 500;">
            You have <strong>${data.daysRemaining} day${data.daysRemaining === 1 ? '' : 's'}</strong> remaining to complete your application and secure your slip.
          </p>
        </div>
        
        <div style="background: #e0e7ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
          <h3 style="color: #374151; margin-top: 0;">🔐 SECURE APPLICATION FORM</h3>
          <p style="margin-bottom: 15px;">Complete your application today:</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${data.secureFormUrl}" 
               style="background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 500; display: inline-block;">
              Complete Application Now
            </a>
          </div>
          <p style="margin: 15px 0 0 0; text-align: center; font-weight: 500;">
            Password: <span style="background: #f3f4f6; padding: 5px 10px; border-radius: 4px; font-family: monospace;">${data.offerPassword}</span>
          </p>
        </div>
        
        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #22c55e;">
          <p style="margin: 0; color: #166534; font-weight: 500; text-align: center;">
            Don't miss out on this opportunity! Complete your application today to secure your premium slip at Marina By-The-Sea.
          </p>
        </div>
        
        <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
          <p style="margin: 0; color: #991b1b; text-align: center;">
            If you need assistance or have questions, please contact us immediately.
          </p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <p style="color: #6b7280; margin: 0;">Best regards,</p>
          <p style="color: #1e3a8a; font-weight: 500; margin: 5px 0;">${data.adminName}</p>
          <p style="color: #6b7280; margin: 0;">Marina By-The-Sea Administration Team</p>
        </div>
      </div>
      
      <div style="background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
        <p style="margin: 5px 0; color: #6b7280; font-size: 14px;"><strong>Marina By-The-Sea</strong></p>
        <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">230 Basin Drive</p>
        <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">Lauderdale By-The-Sea, FL 33308</p>
        <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">Phone: (954) 123-4567 | Email: dylan@dreamsdev.co</p>
      </div>
    </div>`

  return { textContent, htmlContent }
}

// Application Approval Email Template
export function generateApplicationApprovalEmail(data: ApplicationApprovalData) {
  const formattedStartDate = data.startingDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const textContent = `Dear ${data.boaterName},

🎉 CONGRATULATIONS! Your application has been approved!

Welcome to Marina By-The-Sea! We're excited to have you as part of our community.

📋 APPROVAL DETAILS:
• Slip Number: ${data.slipNumber}
• Starting Date: ${formattedStartDate}
• Monthly Cost: $${data.totalMonthlyCost.toFixed(2)}

Your slip is now reserved and ready for you. Please review the important information below and contact us if you have any questions.

📅 NEXT STEPS:
1. Review your slip assignment and starting date
2. Ensure your payment method is set up for recurring charges
3. Contact us to schedule your arrival and slip orientation
4. Familiarize yourself with marina rules and amenities

📞 CONTACT INFORMATION:
• Phone: ${data.adminPhone}
• Email: ${data.adminEmail}
• Office Hours: Monday-Friday 8:00 AM - 6:00 PM

We look forward to welcoming you to Marina By-The-Sea!

Best regards,
${data.adminName}
Marina By-The-Sea Administration Team

---
Marina By-The-Sea
230 Basin Drive
Lauderdale By-The-Sea, FL 33308
Phone: (954) 123-4567
Email: dylan@dreamsdev.co`

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
      <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 30px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 28px; font-weight: bold;">🎉 Application Approved!</h1>
        <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">Welcome to Marina By-The-Sea</p>
      </div>
      
      <div style="padding: 30px;">
        <h2 style="color: #1f2937; margin-bottom: 20px;">Dear ${data.boaterName},</h2>
        
        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #22c55e;">
          <p style="margin: 0; color: #166534; font-weight: 500; font-size: 16px;">
            Welcome to Marina By-The-Sea! We're excited to have you as part of our community.
          </p>
        </div>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">📋 APPROVAL DETAILS</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Slip Number:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${data.slipNumber}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Starting Date:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${formattedStartDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Monthly Cost:</strong></td>
              <td style="padding: 8px 0; font-weight: bold; color: #059669;">$${data.totalMonthlyCost.toFixed(2)}</td>
            </tr>
          </table>
        </div>
        
        <div style="background: #e0e7ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
          <h3 style="color: #374151; margin-top: 0;">📅 NEXT STEPS</h3>
          <ol style="margin: 0; padding-left: 20px; color: #374151;">
            <li>Review your slip assignment and starting date</li>
            <li>Ensure your payment method is set up for recurring charges</li>
            <li>Contact us to schedule your arrival and slip orientation</li>
            <li>Familiarize yourself with marina rules and amenities</li>
          </ol>
        </div>
        
        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <h3 style="color: #374151; margin-top: 0;">📞 CONTACT INFORMATION</h3>
          <p style="margin: 5px 0; color: #92400e;"><strong>Phone:</strong> ${data.adminPhone}</p>
          <p style="margin: 5px 0; color: #92400e;"><strong>Email:</strong> ${data.adminEmail}</p>
          <p style="margin: 5px 0; color: #92400e;"><strong>Office Hours:</strong> Monday-Friday 8:00 AM - 6:00 PM</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <p style="color: #374151; font-weight: 500; margin-bottom: 5px;">We look forward to welcoming you to Marina By-The-Sea!</p>
          <p style="color: #6b7280; margin: 0;">Best regards,</p>
          <p style="color: #059669; font-weight: 500; margin: 5px 0;">${data.adminName}</p>
          <p style="color: #6b7280; margin: 0;">Marina By-The-Sea Administration Team</p>
        </div>
      </div>
      
      <div style="background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
        <p style="margin: 5px 0; color: #6b7280; font-size: 14px;"><strong>Marina By-The-Sea</strong></p>
        <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">230 Basin Drive</p>
        <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">Lauderdale By-The-Sea, FL 33308</p>
        <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">Phone: (954) 123-4567 | Email: dylan@dreamsdev.co</p>
      </div>
    </div>`

  return { textContent, htmlContent }
}

// Welcome Email Template
export function generateWelcomeEmail(data: WelcomeData) {
  const formattedStartDate = data.startingDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const textContent = `Dear ${data.boaterName},

🚤 WELCOME TO MARINA BY-THE-SEA!

We're thrilled to officially welcome you to our marina community! Your onboarding is complete and you're all set to enjoy your premium slip.

📋 YOUR SLIP DETAILS:
• Slip Number: ${data.slipNumber}
• Starting Date: ${formattedStartDate}
• Monthly Cost: $${data.totalMonthlyCost.toFixed(2)}

🏖️ MARINA AMENITIES:
• 24/7 Security and Access Control
• Fresh Water and Electric Hookups
• WiFi and Cable TV
• Pump-out Services
• Valet Parking
• Fuel Dock
• Ship's Store
• Professional Maintenance Services

📅 IMPORTANT DATES:
• Your first monthly payment will be processed on ${formattedStartDate}
• Future payments will be automatically processed monthly
• Please ensure your payment method remains current

📞 CONTACT INFORMATION:
• Office: ${data.marinaPhone}
• Email: ${data.marinaEmail}
• Address: ${data.marinaAddress}
• Emergency: 24/7 Security Line

🎯 MARINA RULES & GUIDELINES:
• Please review our marina rules and regulations
• Respect quiet hours from 10:00 PM to 7:00 AM
• Keep your slip area clean and organized
• Report any maintenance issues immediately

We're here to ensure you have an exceptional boating experience. Don't hesitate to reach out if you need anything!

Welcome aboard!

Best regards,
${data.adminName}
Marina By-The-Sea Administration Team

---
Marina By-The-Sea
${data.marinaAddress}
Phone: ${data.marinaPhone}
Email: ${data.marinaEmail}`

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
      <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 30px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 28px; font-weight: bold;">🚤 Welcome to Marina By-The-Sea!</h1>
        <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">Your onboarding is complete</p>
      </div>
      
      <div style="padding: 30px;">
        <h2 style="color: #1f2937; margin-bottom: 20px;">Dear ${data.boaterName},</h2>
        
        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #22c55e;">
          <p style="margin: 0; color: #166534; font-weight: 500; font-size: 16px;">
            We're thrilled to officially welcome you to our marina community! Your onboarding is complete and you're all set to enjoy your premium slip.
          </p>
        </div>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">📋 YOUR SLIP DETAILS</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Slip Number:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${data.slipNumber}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Starting Date:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${formattedStartDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Monthly Cost:</strong></td>
              <td style="padding: 8px 0; font-weight: bold; color: #1e3a8a;">$${data.totalMonthlyCost.toFixed(2)}</td>
            </tr>
          </table>
        </div>
        
        <div style="background: #e0e7ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
          <h3 style="color: #374151; margin-top: 0;">🏖️ MARINA AMENITIES</h3>
          <ul style="margin: 0; padding-left: 20px; color: #374151;">
            <li>24/7 Security and Access Control</li>
            <li>Fresh Water and Electric Hookups</li>
            <li>WiFi and Cable TV</li>
            <li>Pump-out Services</li>
            <li>Valet Parking</li>
            <li>Fuel Dock</li>
            <li>Ship's Store</li>
            <li>Professional Maintenance Services</li>
          </ul>
        </div>
        
        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <h3 style="color: #374151; margin-top: 0;">📅 IMPORTANT DATES</h3>
          <p style="margin: 5px 0; color: #92400e;"><strong>First Payment:</strong> ${formattedStartDate}</p>
          <p style="margin: 5px 0; color: #92400e;"><strong>Future Payments:</strong> Automatically processed monthly</p>
          <p style="margin: 0; color: #92400e;"><strong>Note:</strong> Please ensure your payment method remains current</p>
        </div>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">📞 CONTACT INFORMATION</h3>
          <p style="margin: 5px 0; color: #374151;"><strong>Office:</strong> ${data.marinaPhone}</p>
          <p style="margin: 5px 0; color: #374151;"><strong>Email:</strong> ${data.marinaEmail}</p>
          <p style="margin: 5px 0; color: #374151;"><strong>Address:</strong> ${data.marinaAddress}</p>
          <p style="margin: 0; color: #374151;"><strong>Emergency:</strong> 24/7 Security Line</p>
        </div>
        
        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #22c55e;">
          <h3 style="color: #374151; margin-top: 0;">🎯 MARINA RULES & GUIDELINES</h3>
          <ul style="margin: 0; padding-left: 20px; color: #166534;">
            <li>Please review our marina rules and regulations</li>
            <li>Respect quiet hours from 10:00 PM to 7:00 AM</li>
            <li>Keep your slip area clean and organized</li>
            <li>Report any maintenance issues immediately</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <p style="color: #374151; font-weight: 500; margin-bottom: 5px;">We're here to ensure you have an exceptional boating experience.</p>
          <p style="color: #6b7280; margin: 0;">Don't hesitate to reach out if you need anything!</p>
          <p style="color: #1e3a8a; font-weight: 500; margin: 15px 0;">Welcome aboard!</p>
          <p style="color: #6b7280; margin: 0;">Best regards,</p>
          <p style="color: #1e3a8a; font-weight: 500; margin: 5px 0;">${data.adminName}</p>
          <p style="color: #6b7280; margin: 0;">Marina By-The-Sea Administration Team</p>
        </div>
      </div>
      
      <div style="background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
        <p style="margin: 5px 0; color: #6b7280; font-size: 14px;"><strong>Marina By-The-Sea</strong></p>
        <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">${data.marinaAddress}</p>
        <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">Phone: ${data.marinaPhone} | Email: ${data.marinaEmail}</p>
      </div>
    </div>`

  return { textContent, htmlContent }
}
