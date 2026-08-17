import { BusinessHeader } from "@/components/business-header"
import { BusinessFooter } from "@/components/business-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <BusinessHeader />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-3xl font-bold">Privacy Policy</CardTitle>
                <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
              </CardHeader>
              <CardContent className="prose prose-lg max-w-none">
                <h2>1. Information We Collect</h2>
                <p>We collect information you provide directly to us, such as when you create an account, apply for a loan, or contact us for support.</p>
                
                <h2>2. How We Use Your Information</h2>
                <p>We use the information we collect to provide, maintain, and improve our services, process loan applications, and communicate with you.</p>
                
                <h2>3. Information Sharing</h2>
                <p>We may share your information with third parties in certain circumstances, including with service providers, business partners, and as required by law.</p>
                
                <h2>4. Data Security</h2>
                <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
                
                <h2>5. Your Rights</h2>
                <p>You have the right to access, update, or delete your personal information. You may also opt out of certain communications from us.</p>
                
                <h2>6. Cookies and Tracking</h2>
                <p>We use cookies and similar tracking technologies to enhance your experience on our website and analyze usage patterns.</p>
                
                <h2>7. Third-Party Services</h2>
                <p>Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites.</p>
                
                <h2>8. Changes to This Policy</h2>
                <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>
                
                <h2>9. Contact Us</h2>
                <p>If you have any questions about this privacy policy, please contact us at support@unbeatableloans.com</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <BusinessFooter />
    </div>
  )
}
