import Link from "next/link"
import { Button } from "@/components/ui/button"

export function BusinessFooter() {
  return (
    <footer className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border-t border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">ST</span>
              </div>
              <span className="font-serif font-bold text-lg">Sure Thing Lending</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              A plain-language guide to business funding. We explain the options and refer you onward. We do not quote
              rates or promise an approval.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-semibold text-foreground">On this site</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/loans" className="text-muted-foreground hover:text-primary transition-colors">
                  Funding options
                </Link>
              </li>
              <li>
                <Link href="/guides" className="text-muted-foreground hover:text-primary transition-colors">
                  Guides
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="font-semibold text-foreground">Guides</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/guides/working-capital"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Working capital
                </Link>
              </li>
              <li>
                <Link
                  href="/guides/equipment-and-inventory"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Equipment and inventory
                </Link>
              </li>
              <li>
                <Link
                  href="/guides/commercial-property"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Property loans
                </Link>
              </li>
              <li>
                <Link
                  href="/guides/how-funding-works"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Compare an offer
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="font-semibold text-foreground">Ask a question</h2>
            <Button asChild className="w-full glass-button">
              <Link href="/contact">Ask which path fits</Link>
            </Button>
            <p className="text-sm text-muted-foreground">
              Use the form. This site does not publish a phone number or a street address.
            </p>
          </div>
        </div>

        <div className="border-t border-border/50 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Sure Thing Lending. A funding referral guide.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                Terms
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
