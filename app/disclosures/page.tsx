import Link from "next/link"
import { BusinessHeader } from "@/components/business-header"
import { BusinessFooter } from "@/components/business-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { pageMetadata, unbeatableLoans, swiftfi, ollaCart } from "@/lib/site"

export const metadata = pageMetadata(
  "Disclosures",
  "Sure Thing Lending is an informational referral guide. It does not quote rates, promise approval, or lend under its own license. Related sites are disclosed here.",
  "/disclosures",
)

export default function DisclosuresPage() {
  return (
    <div className="min-h-screen bg-background">
      <BusinessHeader />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-3xl font-serif">Disclosures</CardTitle>
                <p className="text-muted-foreground">How this site relates to funding, and to the sites it links to.</p>
              </CardHeader>
              <CardContent className="space-y-8 text-muted-foreground leading-relaxed">
                <section className="space-y-3">
                  <h2 className="font-serif text-2xl text-foreground">This site is a guide</h2>
                  <p>
                    Sure Thing Lending publishes explanations of business funding and refers readers to a next step.
                    Nothing on this website is a loan offer, a commitment to lend, or a rate quote. Reading a page does
                    not start an application and does not pull credit.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-serif text-2xl text-foreground">No rate, approval, or license claimed here</h2>
                  <p>
                    This site does not publish interest rates, annual percentage rates, funding amounts, credit-score
                    minimums, or approval times. Those figures depend on a lender and a file. Sure Thing Lending does
                    not claim a lending license or an NMLS number of its own.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-serif text-2xl text-foreground">Related sites</h2>
                  <p>
                    The following sites are in the same ownership group. Links to them appear only on pages where that
                    site is a relevant next step, plus the{" "}
                    <Link href="/about" className="text-primary hover:underline">
                      About
                    </Link>{" "}
                    page, which explains the relationship.
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <a href={swiftfi.url} className="text-primary hover:underline" target="_blank" rel="noopener">
                        Swiftfi
                      </a>{" "}
                      lets freelancers and individuals give US clients US bank details and get paid in stablecoin. It is
                      not a lender.
                    </li>
                    <li>
                      <a
                        href={unbeatableLoans.url}
                        className="text-primary hover:underline"
                        target="_blank"
                        rel="noopener"
                      >
                        Unbeatable Loans
                      </a>{" "}
                      is a licensed mortgage broker, NMLS #{unbeatableLoans.nmls}. It arranges home and investor
                      property loans with other lenders and publishes those rates. That license is theirs. It is not a
                      license for Sure Thing Lending.
                    </li>
                    <li>
                      <a href={ollaCart.url} className="text-primary hover:underline" target="_blank" rel="noopener">
                        OllaCart
                      </a>{" "}
                      is a universal shopping cart for saving products from any store. Some of its product links are
                      affiliate links. A commission may be paid to OllaCart or the person who shared the item, at no
                      extra cost to the buyer. OllaCart does not lend.
                    </li>
                  </ul>
                </section>

                <section className="space-y-3">
                  <h2 className="font-serif text-2xl text-foreground">Inquiries</h2>
                  <p>
                    The contact form asks for a description of the funding need so we can point you at a guide or a
                    related site. Do not send Social Security numbers or full account numbers through that form. An old
                    multi-step page under /onboarding is not an offer and is not indexed. Submitting it does not by
                    itself create a loan file with a lender.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="font-serif text-2xl text-foreground">Questions</h2>
                  <p>
                    Use the{" "}
                    <Link href="/contact" className="text-primary hover:underline">
                      contact form
                    </Link>
                    . This site does not publish a phone number or a street address. Operational email already used for
                    this project is support@unbeatableloans.com.
                  </p>
                </section>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <BusinessFooter />
    </div>
  )
}
