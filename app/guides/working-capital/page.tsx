import Link from "next/link"
import { EditorialPage } from "@/components/editorial-page"
import { NextStep } from "@/components/next-step"
import { pageMetadata, swiftfi } from "@/lib/site"

export const metadata = pageMetadata(
  "Working capital and getting paid",
  "Working capital covers a timing gap in the business. If US clients pay slowly, Swiftfi is a way to get paid in stablecoin instead of borrowing.",
  "/guides/working-capital",
)

export default function WorkingCapitalGuidePage() {
  return (
    <EditorialPage
      eyebrow="Guide"
      title="Working capital and getting paid"
      lede="A cash gap has two different fixes. One is borrowing against the business. The other is changing how client money arrives. Pick the one that matches the cause."
      breadcrumb={{ href: "/guides", label: "Guides" }}
      image={{
        src: "/images/working-capital.jpg",
        alt: "Envelopes and a calculator on a small-business desk, standing in for a cash-flow gap.",
      }}
    >
      <section className="space-y-3">
        <h2 className="font-serif font-bold text-2xl text-foreground">What working capital is for</h2>
        <p className="text-muted-foreground">
          Working capital is money for operations: payroll, rent, a supplier bill, or a job you have to finish before
          you invoice. The repayment is supposed to come from money the business is already earning, not from a hope
          that revenue appears later.
        </p>
        <p className="text-muted-foreground">
          Typical shapes are a line you draw when you need it, or a lump sum with a fixed payoff. Some providers call a
          sale of future card receipts a working-capital advance. Read that paperwork as a sale of sales, not as a loan
          with an interest rate, and compare it using{" "}
          <Link href="/guides/how-funding-works" className="text-primary font-medium hover:underline">
            how to read an offer
          </Link>
          .
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif font-bold text-2xl text-foreground">When borrowing is the wrong first move</h2>
        <p className="text-muted-foreground">
          If the only reason you are short is that a US client or employer pays on a slow rail, the cost of a loan is
          paying interest to wait. Freelancers and remote contractors in that spot can give the client US bank details
          and take the payout in stablecoin instead. That is a payment product, not credit, and it does not require a
          personal guarantee.
        </p>
        <p className="text-muted-foreground">
          Borrowing still fits when the expense is real and the customer has not been billed yet, or when you have
          already been paid and the cash is tied up in the next job. In that case, getting paid faster does not fund
          the purchase. Describe that situation on the{" "}
          <Link href="/contact" className="text-primary font-medium hover:underline">
            contact form
          </Link>{" "}
          and we will say whether it still looks like working capital or like{" "}
          <Link href="/guides/equipment-and-inventory" className="text-primary font-medium hover:underline">
            equipment and inventory
          </Link>
          .
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif font-bold text-2xl text-foreground">What to compare if you do borrow</h2>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
          <li>Whether you can draw, repay, and draw again, or whether it is a one-time amount.</li>
          <li>The total you will pay back, not a headline factor rate with no dollar example.</li>
          <li>Fees for funding, paying off early, or missing a payment.</li>
          <li>Whether you are signing a personal guarantee or pledging receivables.</li>
        </ul>
        <p className="text-muted-foreground">
          This page does not list a rate, a minimum credit score, or an approval time. Those numbers change by lender
          and are not something this guide can honestly publish.
        </p>
      </section>

      <NextStep
        siteName={swiftfi.name}
        href={swiftfi.url}
        title="Get paid by US clients without taking a loan"
        linkLabel="Open Swiftfi"
        note={swiftfi.note}
      >
        <p>
          Swiftfi is for freelancers and individuals who want US clients to pay US bank details. You get a dedicated US
          account, the client pays by ACH or wire, and the payout settles in stablecoin in a Swiftfi wallet or a wallet
          you already have. It is free to open an account and does not require US residency. It will not finance
          inventory or a building.
        </p>
      </NextStep>
    </EditorialPage>
  )
}
