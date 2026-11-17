import Link from "next/link"
import { EditorialPage } from "@/components/editorial-page"
import { fundingProgramCount, fundingPrograms } from "@/lib/funding-programs"
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
      lede="Most funding pages open with a teaser rate. This one opens with the job the money has to do. The number below is the count of paths on this page, not a database row that happens to be empty."
    >
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4" aria-label="Funding path count">
        <div className="rounded-xl border border-border bg-card p-6 text-center">
          <div className="text-4xl font-bold text-primary">{fundingProgramCount}</div>
          <div className="text-muted-foreground mt-1">Funding paths</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 text-center">
          <div className="text-4xl font-bold text-primary">{fundingProgramCount}</div>
          <div className="text-muted-foreground mt-1">Explained on this page</div>
        </div>
      </section>

      {fundingPrograms.map((program) => (
        <section key={program.id} id={program.id} className="space-y-4">
          <img src={program.image} alt={program.imageAlt} className="w-full h-56 sm:h-72 object-cover rounded-xl" />
          <h2 className="font-serif font-bold text-2xl text-foreground">{program.name}</h2>
          <p className="text-muted-foreground">{program.summary}</p>
          <p className="text-muted-foreground">{program.detail}</p>
          <p>
            <Link href={program.guideHref} className="text-primary font-medium hover:underline">
              {program.guideLabel}
            </Link>
          </p>
        </section>
      ))}

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
