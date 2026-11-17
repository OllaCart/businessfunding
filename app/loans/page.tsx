import Link from "next/link"
import { EditorialPage } from "@/components/editorial-page"
import { pageMetadata } from "@/lib/site"

export const metadata = pageMetadata(
  "Business funding options",
  "Plain-language map of working capital, equipment purchases, term funding, and property loans, and where to go next for each one.",
  "/loans",
)

export default function FundingOptionsPage() {
  return (
    <EditorialPage
      eyebrow="Funding options"
      title="Business funding options, without a rate sheet"
      lede="Most funding pages open with a teaser rate. This one opens with the job the money has to do. Pick the situation, read the matching guide, and use the next step named there."
    >
      <section className="space-y-3">
        <h2 className="font-serif font-bold text-2xl text-foreground">Working capital</h2>
        <p className="text-muted-foreground">
          Working capital covers a timing gap: payroll, rent, or inventory that has to be paid before customer money
          lands. It can be a line you draw and repay, or a lump sum. It is a poor fit for buying a building, because the
          asset and the term do not match.
        </p>
        <p className="text-muted-foreground">
          If the gap exists because US clients pay slowly, look at getting paid before you look at borrowing. The{" "}
          <Link href="/guides/working-capital" className="text-primary font-medium hover:underline">
            working-capital guide
          </Link>{" "}
          separates those two moves and links to Swiftfi only for the getting-paid case.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif font-bold text-2xl text-foreground">Term funding</h2>
        <p className="text-muted-foreground">
          A term deal is a set amount, repaid on a schedule. Lenders look at time in business, revenue, existing debt,
          and whether you will personally guarantee the loan. Some products are loans. Others buy a slice of future card
          sales. Those are not the same obligation, even when the website calls both of them funding.
        </p>
        <p className="text-muted-foreground">
          This site does not place term loans. Use{" "}
          <Link href="/guides/how-funding-works" className="text-primary font-medium hover:underline">
            how to compare an offer
          </Link>{" "}
          before you sign, and{" "}
          <Link href="/contact" className="text-primary font-medium hover:underline">
            ask which path fits
          </Link>{" "}
          if you want a pointer rather than a product pitch.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif font-bold text-2xl text-foreground">Equipment and inventory</h2>
        <p className="text-muted-foreground">
          Equipment financing and leases use the equipment as part of the deal. Inventory funding pays for goods you
          expect to sell. Either way, the first useful step is knowing the real price of the thing you are buying, from
          more than one seller.
        </p>
        <p className="text-muted-foreground">
          The{" "}
          <Link href="/guides/equipment-and-inventory" className="text-primary font-medium hover:underline">
            equipment and inventory guide
          </Link>{" "}
          covers that choice and links to OllaCart as a place to save products from any store before you decide how to
          pay.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif font-bold text-2xl text-foreground">Commercial and investment property</h2>
        <p className="text-muted-foreground">
          Property has its own products: commercial mortgages, bridge loans, DSCR loans for rentals, and fix-and-flip
          loans. A home purchase is in this family too. These are mortgage products, arranged by a licensed broker, not
          a paragraph on a general business-funding form.
        </p>
        <p className="text-muted-foreground">
          The{" "}
          <Link href="/guides/commercial-property" className="text-primary font-medium hover:underline">
            property guide
          </Link>{" "}
          names what each product is for and links to Unbeatable Loans, where those rates are published.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif font-bold text-2xl text-foreground">What to have ready</h2>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
          <li>What the money will buy or cover, in one sentence.</li>
          <li>Roughly how much, and when you can pay it back from the business.</li>
          <li>How long the business has been operating and how revenue arrives (invoices, cards, contracts).</li>
          <li>Whether you can pledge equipment, receivables, or property, and whether you will sign personally.</li>
        </ul>
        <p className="text-muted-foreground">
          A fuller checklist is in{" "}
          <Link href="/guides/how-funding-works" className="text-primary font-medium hover:underline">
            how funding works
          </Link>
          .
        </p>
      </section>
    </EditorialPage>
  )
}
