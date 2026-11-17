import { BusinessHeader } from "@/components/business-header"
import { BusinessFooter } from "@/components/business-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { pageMetadata } from "@/lib/site"

export const metadata = pageMetadata(
  "Terms",
  "Terms for using Sure Thing Lending, an informational business-funding referral site. Guides are not loan offers.",
  "/terms",
)

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <BusinessHeader />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-3xl font-bold">Terms of Service</CardTitle>
                <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
              </CardHeader>
              <CardContent className="prose prose-lg max-w-none">
                <h2>1. Acceptance of Terms</h2>
                <p>By accessing and using Sure Thing Lending services, you accept and agree to be bound by the terms and provision of this agreement.</p>
                
                <h2>2. Use License</h2>
                <p>Permission is granted to temporarily download one copy of the materials on Sure Thing Lending's website for personal, non-commercial transitory viewing only.</p>
                
                <h2>3. Disclaimer</h2>
                <p>The materials on Sure Thing Lending's website are provided on an 'as is' basis. Sure Thing Lending makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
                
                <h2>4. Limitations</h2>
                <p>In no event shall Sure Thing Lending or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Sure Thing Lending's website, even if Sure Thing Lending or a Sure Thing Lending authorized representative has been notified orally or in writing of the possibility of such damage.</p>
                
                <h2>5. Accuracy of Materials</h2>
                <p>The materials appearing on Sure Thing Lending's website could include technical, typographical, or photographic errors. Sure Thing Lending does not warrant that any of the materials on its website are accurate, complete, or current.</p>
                
                <h2>6. Links and referrals</h2>
                <p>Pages on this site link to related properties when that property is a relevant next step for the reader. Those links are intentional referrals, and the common ownership is disclosed on the Disclosures page. Sure Thing Lending does not control those sites and is not responsible for their content, rates, or product terms. A link is not a loan offer and not a promise that you will be approved.</p>
                
                <h2>7. Modifications</h2>
                <p>Sure Thing Lending may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.</p>
                
                <h2>8. Governing Law</h2>
                <p>These terms and conditions are governed by and construed in accordance with the laws of Florida and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <BusinessFooter />
    </div>
  )
}
