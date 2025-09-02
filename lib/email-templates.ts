// Email template functions for Marina By-The-Sea

export interface ApplicationApprovalEmailData {
  boaterName: string
  slipNumber: string
  startingDate: Date
  totalMonthlyCost: number
  adminName: string
  adminPhone: string
  adminEmail: string
}

export interface WelcomeEmailData {
  boaterName: string
  slipNumber: string
  startingDate: Date
  totalMonthlyCost: number
  adminName: string
  marinaAddress: string
  marinaPhone: string
  marinaEmail: string
}

export interface SlipOfferEmailData {
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

export function generateApplicationApprovalEmail(data: ApplicationApprovalEmailData) {
  const textContent = `🎉 Congratulations! Your Application Has Been Approved - Marina By-The-Sea

Dear ${data.boaterName},

We are thrilled to inform you that your application for Slip ${data.slipNumber} at Marina By-The-Sea has been approved!

📋 APPROVAL DETAILS:
• Slip Number: ${data.slipNumber}
• Starting Date: ${data.startingDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}
• Monthly Cost: $${data.totalMonthlyCost.toFixed(2)}

🚤 NEXT STEPS:
1. Complete your onboarding process
2. Submit required documentation
3. Set up payment method
4. Schedule your move-in date

📧 CONTACT INFORMATION:
If you have any questions or need assistance, please contact:
• Phone: ${data.adminPhone}
• Email: ${data.adminEmail}
• Admin: ${data.adminName}

We look forward to welcoming you to Marina By-The-Sea!

Best regards,
${data.adminName}
Marina By-The-Sea Administration Team

---
Marina By-The-Sea
Premium Floating Dock Slips in Lauderdale-By-The-Sea, Florida`

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
      <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 28px; font-weight: bold;">🎉 Application Approved!</h1>
        <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">Marina By-The-Sea</p>
      </div>
      
      <div style="padding: 30px;">
        <h2 style="color: #1f2937; margin-bottom: 20px;">Dear ${data.boaterName},</h2>
        
        <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
          <p style="margin: 0; color: #065f46; font-weight: 500; font-size: 16px;">
            We are thrilled to inform you that your application for Slip ${data.slipNumber} at Marina By-The-Sea has been approved!
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
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${data.startingDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Monthly Cost:</strong></td>
              <td style="padding: 8px 0; font-weight: bold; color: #10b981;">$${data.totalMonthlyCost.toFixed(2)}</td>
            </tr>
          </table>
        </div>
        
        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0ea5e9;">
          <h3 style="color: #374151; margin-top: 0;">🚤 NEXT STEPS</h3>
          <ol style="margin: 0; padding-left: 20px; color: #0c4a6e;">
            <li>Complete your onboarding process</li>
            <li>Submit required documentation</li>
            <li>Set up payment method</li>
            <li>Schedule your move-in date</li>
          </ol>
        </div>
        
        <div style="background: #e0e7ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
          <h3 style="color: #374151; margin-top: 0;">📧 CONTACT INFORMATION</h3>
          <p style="margin-bottom: 15px; color: #374151;">
            If you have any questions or need assistance, please contact:
          </p>
          <div style="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p style="margin: 5px 0; color: #374151;"><strong>Phone:</strong></p>
              <p style="margin: 0; color: #3b82f6; font-weight: 500;">${data.adminPhone}</p>
            </div>
            <div>
              <p style="margin: 5px 0; color: #374151;"><strong>Email:</strong></p>
              <p style="margin: 0; color: #3b82f6; font-weight: 500;">${data.adminEmail}</p>
            </div>
            <div>
              <p style="margin: 5px 0; color: #374151;"><strong>Admin:</strong></p>
              <p style="margin: 0; color: #3b82f6; font-weight: 500;">${data.adminName}</p>
            </div>
          </div>
        </div>
        
        <div style="text-center margin: 30px 0;">
          <p style="color: #374151; font-weight: 500; margin-bottom: 5px;">
            We look forward to welcoming you to Marina By-The-Sea!
          </p>
          <p style="color: #6b7280; margin: 0;">Best regards,</p>
          <p style="color: #10b981; font-weight: 500; margin: 5px 0;">${data.adminName}</p>
          <p style="color: #6b7280; margin: 0;">Marina By-The-Sea Administration Team</p>
        </div>
      </div>
      
      <div style="background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
        <p style="margin: 5px 0; color: #6b7280; font-size: 14px;"><strong>Marina By-The-Sea</strong></p>
        <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">Premium Floating Dock Slips in Lauderdale-By-The-Sea, Florida</p>
      </div>
    </div>`

  return { textContent, htmlContent }
}

export function generateWelcomeEmail(data: WelcomeEmailData) {
  const textContent = `🚤 Welcome to Marina By-The-Sea!

Dear ${data.boaterName},

Welcome to Marina By-The-Sea! We are excited to have you as part of our marina community.

📋 YOUR SLIP DETAILS:
• Slip Number: ${data.slipNumber}
• Starting Date: ${data.startingDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}
• Monthly Cost: $${data.totalMonthlyCost.toFixed(2)}

🏠 MARINA INFORMATION:
• Address: ${data.marinaAddress}
• Phone: ${data.marinaPhone}
• Email: ${data.marinaEmail}

🚤 MARINA AMENITIES:
• 24/7 access to your vessel
• Fuel refueling services
• Marine detailing services
• Professional marina staff
• Secure parking
• Restroom facilities

📧 IMPORTANT CONTACTS:
• Marina Office: ${data.marinaPhone}
• Email: ${data.marinaEmail}
• Your Admin: ${data.adminName}

We're here to help make your marina experience exceptional. Don't hesitate to reach out if you need anything!

Welcome aboard!

Best regards,
${data.adminName}
Marina By-The-Sea Administration Team

---
Marina By-The-Sea
${data.marinaAddress}
Phone: ${data.marinaPhone} | Email: ${data.marinaEmail}`

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
      <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 30px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 28px; font-weight: bold;">🚤 Welcome to Marina By-The-Sea!</h1>
        <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">Your New Home Port</p>
      </div>
      
      <div style="padding: 30px;">
        <h2 style="color: #1f2937; margin-bottom: 20px;">Dear ${data.boaterName},</h2>
        
        <div style="background: #e0e7ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
          <p style="margin: 0; color: #1e40af; font-weight: 500; font-size: 16px;">
            Welcome to Marina By-The-Sea! We are excited to have you as part of our marina community.
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
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${data.startingDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Monthly Cost:</strong></td>
              <td style="padding: 8px 0; font-weight: bold; color: #3b82f6;">$${data.totalMonthlyCost.toFixed(2)}</td>
            </tr>
          </table>
        </div>
        
        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #22c55e;">
          <h3 style="color: #374151; margin-top: 0;">🏠 MARINA INFORMATION</h3>
          <p style="margin: 5px 0; color: #166534;"><strong>Address:</strong> ${data.marinaAddress}</p>
          <p style="margin: 5px 0; color: #166534;"><strong>Phone:</strong> ${data.marinaPhone}</p>
          <p style="margin: 5px 0; color: #166534;"><strong>Email:</strong> ${data.marinaEmail}</p>
        </div>
        
        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <h3 style="color: #374151; margin-top: 0;">🚤 MARINA AMENITIES</h3>
          <ul style="margin: 0; padding-left: 20px; color: #92400e;">
            <li>24/7 access to your vessel</li>
            <li>Fuel refueling services</li>
            <li>Marine detailing services</li>
            <li>Professional marina staff</li>
            <li>Secure parking</li>
            <li>Restroom facilities</li>
          </ul>
        </div>
        
        <div style="background: #e0e7ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
          <h3 style="color: #374151; margin-top: 0;">📧 IMPORTANT CONTACTS</h3>
          <p style="margin: 5px 0; color: #374151;"><strong>Marina Office:</strong> ${data.marinaPhone}</p>
          <p style="margin: 5px 0; color: #374151;"><strong>Email:</strong> ${data.marinaEmail}</p>
          <p style="margin: 5px 0; color: #374151;"><strong>Your Admin:</strong> ${data.adminName}</p>
        </div>
        
        <div style="text-center margin: 30px 0;">
          <p style="color: #374151; font-weight: 500; margin-bottom: 5px;">
            We're here to help make your marina experience exceptional. Don't hesitate to reach out if you need anything!
          </p>
          <p style="color: #1f2937; font-size: 18px; font-weight: bold; margin: 10px 0;">Welcome aboard!</p>
          <p style="color: #6b7280; margin: 0;">Best regards,</p>
          <p style="color: #3b82f6; font-weight: 500; margin: 5px 0;">${data.adminName}</p>
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
}export function generateSlipOfferEmail(data: SlipOfferEmailData) {
  const textContent = `🎉 Slip Available at Marina By-The-Sea - Slip ${data.slipNumber}

Dear ${data.boaterName},

Great news! A slip has become available at Marina By-The-Sea and we'd like to offer it to you!

📋 SLIP OFFER DETAILS:
• Slip Number: ${data.slipNumber}
• Dimensions: ${data.boatLength}' L × ${data.boatBeam}' W
• Price per Foot: $${data.pricePerFoot.toFixed(2)}
• Monthly Cost (before taxes): $${data.totalMonthlyCost.toFixed(2)}
• Monthly Taxes (7%): $${data.monthlyTaxes.toFixed(2)}
• Total Monthly Cost: $${(data.totalMonthlyCost + data.monthlyTaxes).toFixed(2)}

⏰ OFFER EXPIRES: ${data.offerExpiresAt.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}

🔐 SECURE APPLICATION:
To accept this offer, please visit our secure application form:
${data.secureFormUrl}

Password: ${data.offerPassword}

${data.termsAndConditions ? `\n📋 TERMS AND CONDITIONS:\n${data.termsAndConditions}\n` : ''}

🚤 WHAT HAPPENS NEXT:
1. Click the link above and enter the password
2. Complete the application form
3. Submit required documentation
4. We'll review and approve your application
5. Welcome to Marina By-The-Sea!

💬 QUESTIONS?
If you have any questions about this offer, please contact:
• Admin: ${data.adminName}
• Phone: (954) 123-4567
• Email: info@marinabts.com

This offer is time-sensitive, so please respond promptly to secure your slip!

Best regards,
${data.adminName}
Marina By-The-Sea Administration Team

---
Marina By-The-Sea
Premium Floating Dock Slips in Lauderdale-By-The-Sea, Florida`

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
      <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 28px; font-weight: bold;">🎉 Slip Available!</h1>
        <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">Marina By-The-Sea - Slip ${data.slipNumber}</p>
      </div>
      
      <div style="padding: 30px;">
        <h2 style="color: #1f2937; margin-bottom: 20px;">Dear ${data.boaterName},</h2>
        
        <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
          <p style="margin: 0; color: #065f46; font-weight: 500; font-size: 16px;">
            Great news! A slip has become available at Marina By-The-Sea and we'd like to offer it to you!
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
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Dimensions:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${data.boatLength}' L × ${data.boatBeam}' W</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Price per Foot:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">$${data.pricePerFoot.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Monthly Cost (before taxes):</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">$${data.totalMonthlyCost.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Monthly Taxes (7%):</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">$${data.monthlyTaxes.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Total Monthly Cost:</strong></td>
              <td style="padding: 8px 0; font-weight: bold; color: #10b981;">$${(data.totalMonthlyCost + data.monthlyTaxes).toFixed(2)}</td>
            </tr>
          </table>
        </div>
        
        <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
          <h3 style="color: #374151; margin-top: 0;">⏰ OFFER EXPIRES</h3>
          <p style="margin: 0; color: #dc2626; font-weight: 500;">
            ${data.offerExpiresAt.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
        
        <div style="background: #e0e7ff; padding: 25px; border-radius: 8px; margin: 25px 0; text-align: center; border: 2px solid #3b82f6;">
          <h3 style="color: #1e40af; margin-top: 0; font-size: 20px;">🔐 SECURE APPLICATION</h3>
          <p style="color: #1e40af; margin-bottom: 20px; font-size: 16px;">
            To accept this offer, please visit our secure application form:
          </p>
          <a href="${data.secureFormUrl}" style="display: inline-block; background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; margin-bottom: 15px;">
            🚀 Apply for Slip ${data.slipNumber}
          </a>
          <p style="color: #1e40af; margin-top: 15px; font-size: 14px;">
            Password: <strong>${data.offerPassword}</strong>
          </p>
        </div>
        
        ${data.termsAndConditions ? `
        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <h3 style="color: #92400e; margin-top: 0;">📋 TERMS AND CONDITIONS</h3>
          <p style="margin: 0; color: #92400e;">${data.termsAndConditions}</p>
        </div>
        ` : ''}
        
        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0ea5e9;">
          <h3 style="color: #374151; margin-top: 0;">🚤 WHAT HAPPENS NEXT</h3>
          <ol style="margin: 0; padding-left: 20px; color: #0c4a6e;">
            <li>Click the link above and enter the password</li>
            <li>Complete the application form</li>
            <li>Submit required documentation</li>
            <li>We'll review and approve your application</li>
            <li>Welcome to Marina By-The-Sea!</li>
          </ol>
        </div>
        
        <div style="background: #e0e7ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
          <h3 style="color: #374151; margin-top: 0;">💬 QUESTIONS?</h3>
          <p style="margin-bottom: 15px; color: #374151;">
            If you have any questions about this offer, please contact:
          </p>
          <div style="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p style="margin: 5px 0; color: #374151;"><strong>Admin:</strong></p>
              <p style="margin: 0; color: #3b82f6; font-weight: 500;">${data.adminName}</p>
            </div>
            <div>
              <p style="margin: 5px 0; color: #374151;"><strong>Phone:</strong></p>
              <p style="margin: 0; color: #3b82f6; font-weight: 500;">(954) 123-4567</p>
            </div>
            <div>
              <p style="margin: 5px 0; color: #374151;"><strong>Email:</strong></p>
              <p style="margin: 0; color: #3b82f6; font-weight: 500;">info@marinabts.com</p>
            </div>
          </div>
        </div>
        
        <div style="text-center margin: 30px 0;">
          <p style="color: #dc2626; font-weight: 500; margin-bottom: 5px;">
            This offer is time-sensitive, so please respond promptly to secure your slip!
          </p>
          <p style="color: #6b7280; margin: 0;">Best regards,</p>
          <p style="color: #10b981; font-weight: 500; margin: 5px 0;">${data.adminName}</p>
          <p style="color: #6b7280; margin: 0;">Marina By-The-Sea Administration Team</p>
        </div>
      </div>
      
      <div style="background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
        <p style="margin: 5px 0; color: #6b7280; font-size: 14px;"><strong>Marina By-The-Sea</strong></p>
        <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">Premium Floating Dock Slips in Lauderdale-By-The-Sea, Florida</p>
      </div>
    </div>`

  return { textContent, htmlContent }
}
