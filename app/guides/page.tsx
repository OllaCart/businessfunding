import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { EditorialPage } from "@/components/editorial-page"
import { pageMetadata } from "@/lib/site"

export const metadata = pageMetadata(
  "Business funding guides",
  "Short guides on working capital, equipment and inventory, property loans, and how to read a funding offer before you sign.",
  "/guides",
)

const guides = [
  {
    href: "/guides/working-capital",
    title: "Working capital and getting paid",
    summary:
      "When a cash gap is a borrowing problem, and when it is a slow-payment problem that Swiftfi can settle instead.",
  },
  {
    href: "/guides/equipment-and-inventory",
    title: "Equipment and inventory",
    summary:
      "How financing a purchase differs from paying cash, and how to compare the actual products in OllaCart first.",
  },
  {
    href: "/guides/commercial-property",
    title: "Commercial and investment property",
    summary:
      "What commercial, bridge, DSCR, and fix-and-flip loans are for, and why the next step is Unbeatable Loans.",
  },
  {
    href: "/guides/how-funding-works",
    title: "How to compare a funding offer",
    summary:
      "The questions that matter on any offer: total cost, term, guarantee, and whether it is a loan or a sale of future sales.",
  },
]

export default function GuidesPage() {
  return (
    <EditorialPage
      eyebrow="Guides"
      title="Short guides before you apply anywhere"
      lede="Each guide answers one decision. None of them quotes a rate or asks you to create an account. Follow the single next step at the bottom only when it matches the decision on that page."
    >
      <div className="space-y-4">
        {guides.map((guide) => (
          <Card key={guide.href} className="glass-card">
            <CardContent className="p-6">
              <h2 className="font-serif font-semibold text-xl mb-2">
                <Link href={guide.href} className="hover:text-primary transition-colors">
                  {guide.title}
                </Link>
              </h2>
              <p className="text-muted-foreground mb-4">{guide.summary}</p>
              <Link href={guide.href} className="inline-flex items-center font-medium text-primary hover:underline">
                Read guide
                <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="text-muted-foreground">
        Prefer a map of the options first? Start at{" "}
        <Link href="/loans" className="text-primary font-medium hover:underline">
          funding options
        </Link>
        . If you already know the situation and want a person to point, use{" "}
        <Link href="/contact" className="text-primary font-medium hover:underline">
          contact
        </Link>
        .
      </p>
    </EditorialPage>
  )
}
