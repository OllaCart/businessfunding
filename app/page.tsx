import { BusinessHeader } from "@/components/business-header"
import { BusinessFooter } from "@/components/business-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, Building2, ShoppingBag, Wallet } from "lucide-react"
import { fundingProgramCount } from "@/lib/funding-programs"
import { ollaCart, swiftfi, unbeatableLoans } from "@/lib/site"

function HeroBackground() {
  return (
    <div className="absolute inset-0">
      <img
        src="/images/business-hero.jpg"
        alt="A neighborhood bakery and a workshop on the same block, the kind of businesses this guide is written for."
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 glass-hero" />
    </div>
  )
}

const paths = [
  {
    icon: Wallet,
    title: "Cash is slow to arrive",
    body: "A funding conversation often starts because clients pay late. Borrowing covers the gap. Getting paid on a faster rail can remove the gap.",
    externalHref: swiftfi.url,
    externalLabel: "See how Swiftfi pays freelancers",
    externalNote: "Swiftfi gives US clients a US bank account and settles you in stablecoin. It is not a loan.",
    guideHref: "/guides/working-capital",
    guideLabel: "Read the working-capital guide",
    image: "/images/working-capital.jpg",
    imageAlt: "Envelopes and a calculator on a small-business desk, standing in for a cash-flow gap.",
  },
  {
    icon: ShoppingBag,
    title: "You need equipment or inventory",
    body: "Price the purchase before you finance it. A loan, a lease, and paying cash are different deals, and the right one depends on what you are buying.",
    externalHref: ollaCart.url,
    externalLabel: "Compare purchases in OllaCart",
    externalNote: "OllaCart is a universal cart: save products from any store, then check out on that store's site.",
    guideHref: "/guides/equipment-and-inventory",
    guideLabel: "Read the equipment and inventory guide",
    image: "/images/equipment-inventory.jpg",
    imageAlt: "A commercial mixer beside shelves of plain boxes in a workshop.",
  },
  {
    icon: Building2,
    title: "The asset is property",
    body: "A shop, a rental, a flip, or a home is a mortgage conversation, not a generic business-loan form. Rates for those products are published elsewhere.",
    externalHref: unbeatableLoans.url,
    externalLabel: "Open Unbeatable Loans",
    externalNote: `Unbeatable Loans is a licensed mortgage broker (NMLS #${unbeatableLoans.nmls}) and arranges loans with other lenders.`,
    guideHref: "/guides/commercial-property",
    guideLabel: "Read the property guide",
    image: "/images/commercial-property.jpg",
    imageAlt: "A two-story brick commercial building with a ground-floor storefront.",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <BusinessHeader />

      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <HeroBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/40" />

        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl py-28">
          <p className="text-sm font-semibold uppercase tracking-wide text-white/80 mb-4">Business funding referral guide</p>
          <h1 className="font-serif font-black text-4xl sm:text-5xl lg:text-6xl mb-6 leading-tight">
            Find the funding path
            <br />
            <span className="gradient-text">that matches the problem</span>
          </h1>
          <p className="text-lg sm:text-xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
            Sure Thing Lending explains working capital, equipment purchases, and property loans in plain language, then
            sends you to a next step that actually does that job. This site does not quote rates or promise an approval.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="glass-button text-primary-foreground hover:text-primary-foreground text-lg px-8 py-4"
            >
              <Link href="/loans">
                See funding options
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 text-lg px-8 py-4 backdrop-blur-sm"
            >
              <Link href="/guides">Read the guides</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background" id="paths">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground mb-4">
              Start with the use of funds
            </h2>
            <p className="text-xl text-muted-foreground">
              The useful question is what the money is for.{" "}
              <Link href="/loans" className="text-primary font-medium hover:underline">
                {fundingProgramCount} funding paths
              </Link>{" "}
              are explained on this site. Three of them have a related site that can take the next action.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {paths.map((path) => {
              const Icon = path.icon
              return (
                <Card key={path.title} className="glass-card hover:shadow-xl transition-shadow overflow-hidden">
                  <img src={path.image} alt={path.imageAlt} className="h-44 w-full object-cover" />
                  <CardContent className="p-8 flex flex-col h-full">
                    <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-5">
                      <Icon className="h-7 w-7 text-primary" aria-hidden="true" />
                    </div>
                    <h3 className="font-serif font-semibold text-2xl mb-3">{path.title}</h3>
                    <p className="text-muted-foreground mb-4">{path.body}</p>
                    <p className="text-sm text-muted-foreground mb-6">{path.externalNote}</p>
                    <div className="mt-auto space-y-3">
                      <a
                        href={path.externalHref}
                        target="_blank"
                        rel="noopener"
                        className="inline-flex items-center font-semibold text-primary hover:underline"
                      >
                        {path.externalLabel}
                        <ArrowUpRight className="ml-1 h-4 w-4" aria-hidden="true" />
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                      <div>
                        <Link href={path.guideHref} className="inline-flex items-center text-foreground hover:text-primary">
                          {path.guideLabel}
                          <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-foreground mb-4 text-center">
              What this site will not tell you
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
              <Card className="glass-card">
                <CardContent className="p-6">
                  <h3 className="font-serif font-semibold text-lg mb-2">A rate</h3>
                  <p className="text-muted-foreground text-sm">
                    Price depends on the lender, the product, and your file. A number printed here would be a guess.
                  </p>
                </CardContent>
              </Card>
              <Card className="glass-card">
                <CardContent className="p-6">
                  <h3 className="font-serif font-semibold text-lg mb-2">An approval</h3>
                  <p className="text-muted-foreground text-sm">
                    Reading a guide does not apply for credit. Nobody on this site can promise a yes or a funding date.
                  </p>
                </CardContent>
              </Card>
              <Card className="glass-card">
                <CardContent className="p-6">
                  <h3 className="font-serif font-semibold text-lg mb-2">Our own license</h3>
                  <p className="text-muted-foreground text-sm">
                    Mortgage licensing sits with Unbeatable Loans, NMLS #{unbeatableLoans.nmls}. This guide is not that license.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif font-bold text-3xl sm:text-4xl mb-4">Not sure which path fits?</h2>
          <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
            Describe the business and what the money is for. We will point you at the guide, or at the related site, that
            matches. That reply is a referral, not a loan offer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="bg-white hover:bg-white/90 text-primary">
              <Link href="/contact">Ask which path fits</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 bg-transparent"
            >
              <Link href="/guides/how-funding-works">How to compare an offer</Link>
            </Button>
          </div>
        </div>
      </section>

      <BusinessFooter />
    </div>
  )
}
