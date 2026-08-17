import { BusinessHeader } from "@/components/business-header"
import { BusinessFooter } from "@/components/business-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DisclosuresPage() {
  return (
    <div className="min-h-screen bg-background">
      <BusinessHeader />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-3xl font-bold">Important Disclosures</CardTitle>
                <p className="text-muted-foreground">Please read these disclosures carefully</p>
              </CardHeader>
              <CardContent className="prose prose-lg max-w-none">
                <h2>Equal Housing Lender</h2>
                <p>Sure Thing Lending is an equal housing lender. We do not discriminate on the basis of race, color, religion, national origin, sex, familial status, or disability.</p>
                
                <h2>Licensing Information</h2>
                <p>Sure Thing Lending is licensed under Unbeatable Loans. All lending activities are conducted in accordance with applicable state and federal regulations.</p>
                
                <h2>Interest Rates and Terms</h2>
                <p>Interest rates and loan terms are subject to credit approval and may vary based on individual circumstances. Rates and terms are not guaranteed until final approval.</p>
                
                <h2>Credit Check Authorization</h2>
                <p>By submitting a loan application, you authorize Sure Thing Lending to obtain credit reports and verify information with third parties as necessary for loan processing.</p>
                
                <h2>Data Collection and Use</h2>
                <p>We collect and use personal and business information solely for the purpose of processing loan applications and providing related services. Your information is protected according to our Privacy Policy.</p>
                
                <h2>Third-Party Services</h2>
                <p>We may use third-party services for credit reporting, identity verification, and other loan processing activities. These services are bound by strict confidentiality agreements.</p>
                
                <h2>Regulatory Compliance</h2>
                <p>All lending activities comply with applicable federal and state regulations, including the Truth in Lending Act and Equal Credit Opportunity Act.</p>
                
                <h2>Contact Information</h2>
                <p>For questions about these disclosures or our lending practices, contact us at support@unbeatableloans.com or (800) SURE-LOAN.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <BusinessFooter />
    </div>
  )
}
