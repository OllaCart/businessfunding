import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { EditorialPage } from "@/components/editorial-page"
import { johnPastre, ollaCart, pageMetadata, swiftfi, unbeatableLoans } from "@/lib/site"

export const metadata = pageMetadata(
  "About Sure Thing Lending",
  "Sure Thing Lending is a plain-language referral guide to business funding. It explains options and points readers to Swiftfi, Unbeatable Loans, or OllaCart only when that site is the right next step.",
  "/about",
)

const related = [
  {
    name: swiftfi.name,
    url: swiftfi.url,
    role: "Getting paid",
    body: "Swiftfi gives freelancers and individuals US bank details so US clients can pay by ACH or wire. The payout settles in stablecoin. Use it when the problem is slow payment, not when you need to borrow.",
  },
  {
    name: unbeatableLoans.name,
    url: unbeatableLoans.url,
    role: "Mortgages and property",
    body: `Unbeatable Loans publishes rates for home loans and for investor products such as DSCR, fix and flip, bridge, and commercial, and it arranges those loans with other lenders. NMLS #${johnPastre.nmls} is ${johnPastre.name}’s.`,
  },
  {
    name: ollaCart.name,
    url: ollaCart.url,
    role: "Comparing purchases",
    body: "OllaCart is a universal shopping cart. Save equipment, inventory, or supplies from any store, then check out on the store’s own site. Use it to price a purchase before you decide how to pay for it. It does not lend.",
  },
]

export default function AboutPage() {
  return (
    <EditorialPage
      eyebrow="About"
      title="A referral guide, not a rate advertisement"
      lede="Sure Thing Lending exists to explain business funding in plain language and to send you onward when a specific next step is actually useful. It does not quote rates, promise approval, or lend under its own license."
      image={{
        src: "/images/about-desk.jpg",
        alt: "A closed notebook, a blank sheet, a pencil, and a cup on a wooden desk.",
      }}
    >
      <section className="space-y-3">
        <h2 className="font-serif font-bold text-2xl text-foreground">What we do</h2>
        <p className="text-muted-foreground">
          Readers arrive with a cash gap, a purchase, or a property. Those are different products. The{" "}
          <Link href="/loans" className="text-primary font-medium hover:underline">
            funding options
          </Link>{" "}
          page and the{" "}
          <Link href="/guides" className="text-primary font-medium hover:underline">
            guides
          </Link>{" "}
          sort them. If you want a person to point at the right one, the{" "}
          <Link href="/contact" className="text-primary font-medium hover:underline">
            contact form
          </Link>{" "}
          is a referral question, not an application.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif font-bold text-2xl text-foreground">What we do not do</h2>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
          <li>We do not publish interest rates, approval times, or loan amounts.</li>
          <li>We do not claim a lending license or an NMLS number for this website.</li>
          <li>We do not present customer counts or testimonials we cannot source.</li>
          <li>We do not put the same outbound links on every page.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif font-bold text-2xl text-foreground">Related sites, and the job each one does</h2>
        <p className="text-muted-foreground">
          Swiftfi, Unbeatable Loans, and OllaCart are in the same ownership group as this site. Each one is linked from
          the guide that matches its job, and from this page so the relationship is visible. Details are also in the{" "}
          <Link href="/disclosures" className="text-primary font-medium hover:underline">
            disclosures
          </Link>
          .
        </p>
        <div className="space-y-4">
          {related.map((site) => (
            <Card key={site.url} className="glass-card">
              <CardContent className="p-6">
                <p className="text-sm font-semibold text-primary mb-1">{site.role}</p>
                <h3 className="font-serif font-semibold text-xl mb-2">{site.name}</h3>
                <p className="text-muted-foreground mb-4">{site.body}</p>
                <a href={site.url} target="_blank" rel="noopener" className="font-medium text-primary hover:underline">
                  Visit {site.name}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <div>
        <Button asChild className="glass-button text-primary-foreground">
          <Link href="/guides">Start with the guides</Link>
        </Button>
      </div>
    </EditorialPage>
  )
}
