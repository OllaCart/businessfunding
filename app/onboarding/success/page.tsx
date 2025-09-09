import { BusinessHeader } from "@/components/business-header"
import { BusinessFooter } from "@/components/business-footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, Mail, Phone, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function ApplicationSuccessPage() {
  return (
    <div className="min-h-screen bg-background">
      <BusinessHeader />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="glass-card">
              <CardContent className="p-12">
                {/* Success Icon */}
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>

                {/* Success Message */}
                <h1 className="text-3xl font-bold text-foreground mb-4">
                  Application Submitted Successfully!
                </h1>
                <p className="text-lg text-muted-foreground mb-8">
                  Thank you for choosing Sure Thing Lending. Your business loan application has been received and is being processed.
                </p>

                {/* Next Steps */}
                <div className="bg-muted/50 rounded-lg p-6 mb-8">
                  <h2 className="text-xl font-semibold mb-4">What Happens Next?</h2>
                  <div className="space-y-4 text-left">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">1</span>
                      </div>
                      <div>
                        <h3 className="font-medium">Initial Review</h3>
                        <p className="text-sm text-muted-foreground">We'll review your application within 24 hours</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">2</span>
                      </div>
                      <div>
                        <h3 className="font-medium">Document Collection</h3>
                        <p className="text-sm text-muted-foreground">We may request additional business documents</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">3</span>
                      </div>
                      <div>
                        <h3 className="font-medium">Credit Check</h3>
                        <p className="text-sm text-muted-foreground">We'll perform a credit check and verification</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">4</span>
                      </div>
                      <div>
                        <h3 className="font-medium">Decision & Funding</h3>
                        <p className="text-sm text-muted-foreground">Receive approval and get funded quickly</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center justify-center space-x-3 p-4 bg-muted/30 rounded-lg">
                    <Mail className="h-5 w-5 text-primary" />
                    <div className="text-left">
                      <p className="text-sm font-medium">Email Updates</p>
                      <p className="text-xs text-muted-foreground">info@surethinglending.com</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center space-x-3 p-4 bg-muted/30 rounded-lg">
                    <Phone className="h-5 w-5 text-primary" />
                    <div className="text-left">
                      <p className="text-sm font-medium">Phone Support</p>
                      <p className="text-xs text-muted-foreground">(800) SURE-LOAN</p>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="flex items-center justify-center space-x-2 mb-8">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">Typical processing time: 2-5 business days</span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild className="glass-button">
                    <Link href="/loans">
                      View Other Programs
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/contact">Contact Support</Link>
                  </Button>
                </div>

                {/* Additional Information */}
                <div className="mt-8 pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    You will receive an email confirmation shortly with your application reference number. 
                    Keep this number for your records and reference it in any future communications.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <BusinessFooter />
    </div>
  )
}