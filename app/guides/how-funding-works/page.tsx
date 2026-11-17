import Link from "next/link"
import { EditorialPage } from "@/components/editorial-page"
import { pageMetadata } from "@/lib/site"

export const metadata = pageMetadata(
  "How to compare a business funding offer",
  "What to check before you accept business funding: total dollars repaid, term, personal guarantee, and whether the contract is a loan or a sale of future sales.",
  "/guides/how-funding-works",
)

export default function HowFundingWorksPage() {
  return (
    <EditorialPage
      eyebrow="Guide"
      title="How to compare a funding offer"
      lede="A useful offer can be read without a teaser rate. These are the items that change what you will actually pay, and the pages to open once you know which kind of money you need."
      breadcrumb={{ href: "/guides", label: "Guides" }}
      image={{
        src: "/images/compare-offers.jpg",
        alt: "Two stacks of blank paper and a pen, ready for comparing a funding offer.",
      }}
    >
      <section className="space-y-3">
        <h2 className="font-serif font-bold text-2xl text-foreground">Name the job first</h2>
        <p className="text-muted-foreground">
          Write one sentence: what the money will pay for, and what cash will pay it back. Then open the matching page
          on this site.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
          <li>
            Payroll, rent, or a late-paying client:{" "}
            <Link href="/guides/working-capital" className="text-primary font-medium hover:underline">
              working capital and getting paid
            </Link>
            .
          </li>
          <li>
            A machine, a vehicle, or goods you will resell:{" "}
            <Link href="/guides/equipment-and-inventory" className="text-primary font-medium hover:underline">
              equipment and inventory
            </Link>
            .
          </li>
          <li>
            A building, a rental, a flip, or a home:{" "}
            <Link href="/guides/commercial-property" className="text-primary font-medium hover:underline">
              commercial and investment property
            </Link>
            .
          </li>
        </ul>
        <p className="text-muted-foreground">
          The wider map is on{" "}
          <Link href="/loans" className="text-primary font-medium hover:underline">
            funding options
          </Link>
          .
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif font-bold text-2xl text-foreground">Read the contract type</h2>
        <p className="text-muted-foreground">
          A loan creates a debt with a repayment schedule. A lease may leave ownership of equipment with the funder
          until the end. A merchant cash advance or similar product often buys a percentage of future sales. The last
          one can keep collecting when revenue dips, because it is not always capped the way a loan payment is. Ask
          which of the three you are signing before you compare price.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif font-bold text-2xl text-foreground">Five checks on any offer</h2>
        <ol className="list-decimal pl-5 space-y-2 text-muted-foreground">
          <li>Amount you receive, after fees, not the amount they advertise.</li>
          <li>Total dollars you pay back, and on what schedule.</li>
          <li>What it costs to repay early, and what happens if a payment is late.</li>
          <li>Whether you are personally liable, and what collateral is pledged.</li>
          <li>Who is lending or buying the receivables. A website that introduces you is not always the funder.</li>
        </ol>
        <p className="text-muted-foreground">
          Sure Thing Lending will not fill those blanks in for you. If a page on the internet shows a rate with no
          lender and no file behind it, treat it as advertising.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif font-bold text-2xl text-foreground">What a referral from this site is</h2>
        <p className="text-muted-foreground">
          Asking us{" "}
          <Link href="/contact" className="text-primary font-medium hover:underline">
            which path fits
          </Link>{" "}
          gets you a pointer to a guide or a related site. It is not an application, a credit pull, or an approval. Who
          operates the related sites is explained on{" "}
          <Link href="/about" className="text-primary font-medium hover:underline">
            About
          </Link>{" "}
          and in the{" "}
          <Link href="/disclosures" className="text-primary font-medium hover:underline">
            disclosures
          </Link>
          .
        </p>
      </section>
    </EditorialPage>
  )
}
