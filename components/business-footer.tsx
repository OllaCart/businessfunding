import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function BusinessFooter() {
  return (
    <footer className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border-t border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">ST</span>
              </div>
              <span className="font-serif font-bold text-lg">Sure Thing Lending</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your trusted partner for business funding solutions. Fast approval, competitive rates, and flexible terms to help your business grow.
            </p>
            <div className="text-sm text-muted-foreground">
              <p>Licensed under Unbeatable Loans</p>
              <p>NMLS ID: 123456789</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/loans" className="text-muted-foreground hover:text-primary transition-colors">
                  Loan Programs
                </Link>
              </li>
              <li>
                <Link href="/onboarding/apply" className="text-muted-foreground hover:text-primary transition-colors">
                  Apply Now
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Our Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/loans?type=working-capital" className="text-muted-foreground hover:text-primary transition-colors">
                  Working Capital
                </Link>
              </li>
              <li>
                <Link href="/loans?type=equipment" className="text-muted-foreground hover:text-primary transition-colors">
                  Equipment Financing
                </Link>
              </li>
              <li>
                <Link href="/loans?type=commercial" className="text-muted-foreground hover:text-primary transition-colors">
                  Commercial Loans
                </Link>
              </li>
              <li>
                <Link href="/loans?type=sba" className="text-muted-foreground hover:text-primary transition-colors">
                  SBA Loans
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & CTA */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Get Started</h3>
            <div className="space-y-3">
              <Button asChild className="w-full glass-button">
                <Link href="/onboarding/apply">Apply for Funding</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/contact">Speak with an Expert</Link>
              </Button>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>📞 (800) SURE-LOAN</p>
              <p>✉️ info@surethinglending.com</p>
              <p>🕒 Mon-Fri 9AM-6PM EST</p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border/50 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-muted-foreground">
              <p>&copy; 2024 Sure Thing Lending. All rights reserved.</p>
              <p className="mt-1">Licensed under Unbeatable Loans | Equal Housing Lender</p>
            </div>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="/disclosures" className="text-muted-foreground hover:text-primary transition-colors">
                Disclosures
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
