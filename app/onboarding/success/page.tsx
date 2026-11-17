import { BusinessHeader } from "@/components/business-header"
import { BusinessFooter } from "@/components/business-footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowRight } from "lucide-react"
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
                  This page is not an approval
                </h1>
                <p className="text-lg text-muted-foreground mb-8">
                  The form you just left does not create a loan offer, a rate, or a funding date. It is not sent to a
                  lender from this screen. Use a guide, or the contact form, if you still want a pointer.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild className="glass-button">
                    <Link href="/guides">
                      Read the guides
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/contact">Ask which path fits</Link>
                  </Button>
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