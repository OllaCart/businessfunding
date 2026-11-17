import Link from "next/link"
import { EditorialPage } from "@/components/editorial-page"
import { NextStep } from "@/components/next-step"
import { pageMetadata, unbeatableLoans } from "@/lib/site"

export const metadata = pageMetadata(
  "Commercial and investment property loans",
  "What commercial, bridge, DSCR, and fix-and-flip loans are for. Unbeatable Loans, NMLS 1827883, publishes those rates and arranges the loan.",
  "/guides/commercial-property",
)

export default function CommercialPropertyGuidePage() {
  return (
    <EditorialPage
      eyebrow="Guide"
      title="Commercial and investment property"
      lede="If the money buys or carries real estate, you are in mortgage products. The useful next step is a licensed broker that publishes the rate, not a generic business-funding form."
      breadcrumb={{ href: "/guides", label: "Guides" }}
      image={{
        src: "/images/commercial-property.jpg",
        alt: "A two-story brick commercial building with a ground-floor storefront.",
      }}
    >
      <section className="space-y-3">
        <h2 className="font-serif font-bold text-2xl text-foreground">Match the product to the property</h2>
        <p className="text-muted-foreground">
          A commercial mortgage finances a property the business will hold, such as a shop, warehouse, or mixed-use
          building. Repayment is expected from the business or from rents over a longer term.
        </p>
        <p className="text-muted-foreground">
          A bridge loan is short. It covers the gap until you sell, refinance, or finish a renovation. A fix-and-flip
          loan is a form of that idea aimed at buying, repairing, and selling. A DSCR loan looks at the property’s
          rental income compared with the payment, which is why investors use it on rentals. None of these is a working
          line for payroll. Payroll belongs on the{" "}
          <Link href="/guides/working-capital" className="text-primary font-medium hover:underline">
            working-capital guide
          </Link>
          .
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif font-bold text-2xl text-foreground">A home is this path too</h2>
        <p className="text-muted-foreground">
          Buying a home to live in is not a business loan, even if you found this site while looking for funding.
          Conventional, FHA, VA, and USDA mortgages are consumer mortgage products. They should be quoted by a mortgage
          broker with a license, with the cash to close shown for the specific home.
        </p>
        <p className="text-muted-foreground">
          Sure Thing Lending does not take mortgage applications and does not publish a rate. The broker linked below
          does both, and it says clearly that it arranges loans with other lenders rather than funding them itself.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif font-bold text-2xl text-foreground">What you still have to check</h2>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
          <li>Whether the quote is for the program you think it is (commercial, DSCR, bridge, or a home loan).</li>
          <li>Cash to close, not just the rate.</li>
          <li>Whether the payment is interest-only for a period, and what happens when that period ends.</li>
          <li>Who the lender will be. A broker arranging a loan is not the same party as the lender funding it.</li>
        </ul>
        <p className="text-muted-foreground">
          For non-property offers, use{" "}
          <Link href="/guides/how-funding-works" className="text-primary font-medium hover:underline">
            how to compare a funding offer
          </Link>
          . Machine and inventory purchases stay on the{" "}
          <Link href="/guides/equipment-and-inventory" className="text-primary font-medium hover:underline">
            equipment guide
          </Link>
          .
        </p>
      </section>

      <NextStep
        siteName={unbeatableLoans.name}
        href={unbeatableLoans.url}
        title="See live rates and start with a mortgage broker"
        linkLabel="Open Unbeatable Loans"
        note={unbeatableLoans.note}
      >
        <p>
          Unbeatable Loans is a licensed mortgage broker, NMLS #{unbeatableLoans.nmls}. It publishes rates for
          conventional, FHA, VA, and USDA loans, and for investor products including DSCR, fix and flip, bridge, and
          commercial. You can add a home, see a rate and cash to close, and send one application to its lender network.
          Homebuyer use is free. Investor loan products are on its $99/month Investor plan. That fee is their published
          plan price, not a loan rate from Sure Thing Lending.
        </p>
      </NextStep>
    </EditorialPage>
  )
}
