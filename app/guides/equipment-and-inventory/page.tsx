import Link from "next/link"
import { EditorialPage } from "@/components/editorial-page"
import { NextStep } from "@/components/next-step"
import { ollaCart, pageMetadata } from "@/lib/site"

export const metadata = pageMetadata(
  "Equipment and inventory funding",
  "How to think about financing equipment or inventory, and how to compare the actual products in OllaCart before you borrow.",
  "/guides/equipment-and-inventory",
)

export default function EquipmentGuidePage() {
  return (
    <EditorialPage
      eyebrow="Guide"
      title="Equipment and inventory"
      lede="Financing a purchase only makes sense after you know what you are buying and what it costs from more than one seller. The loan, the lease, and the cash price are three different deals."
      breadcrumb={{ href: "/guides", label: "Guides" }}
      image={{
        src: "/images/equipment-inventory.jpg",
        alt: "A commercial mixer beside shelves of plain boxes in a workshop.",
      }}
    >
      <section className="space-y-3">
        <h2 className="font-serif font-bold text-2xl text-foreground">Equipment is not the same as a cash gap</h2>
        <p className="text-muted-foreground">
          Equipment financing, and many equipment leases, are tied to a specific asset: a machine, a vehicle, a kitchen
          line, computers. The equipment is often the collateral. That is a different conversation from{" "}
          <Link href="/guides/working-capital" className="text-primary font-medium hover:underline">
            working capital
          </Link>
          , which is unsecured or tied to receivables and is meant to turn over quickly.
        </p>
        <p className="text-muted-foreground">
          Inventory funding pays for goods you expect to resell. The risk is that the goods do not sell on the schedule
          you used to size the loan. A shorter term and a clear sell-through plan matter more than a low advertised
          rate you cannot verify.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif font-bold text-2xl text-foreground">Price the purchase first</h2>
        <p className="text-muted-foreground">
          Sellers quote different prices for the same model, and a financed price can hide margin inside the payment.
          Before you ask anyone for equipment funding, save the candidate products in one list, including the merchant,
          the cash price, and the warranty. Then decide whether cash, a lease, or a loan is the cheaper way to own or
          use the item.
        </p>
        <p className="text-muted-foreground">
          If the “equipment” is actually a building, stop here. Real property belongs on the{" "}
          <Link href="/guides/commercial-property" className="text-primary font-medium hover:underline">
            commercial and investment property guide
          </Link>
          , where the next step is a mortgage broker rather than a shopping cart.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif font-bold text-2xl text-foreground">Questions to ask a funder</h2>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
          <li>Is this a loan or a lease, and who owns the equipment at the end?</li>
          <li>Is the amount based on the invoice, and what down payment is required?</li>
          <li>What happens if you pay it off early, or if the equipment is sold?</li>
          <li>Are you signing personally, or is the business the only obligor?</li>
        </ul>
        <p className="text-muted-foreground">
          Bring those answers to{" "}
          <Link href="/guides/how-funding-works" className="text-primary font-medium hover:underline">
            how to compare an offer
          </Link>
          . This guide does not publish rates or terms.
        </p>
      </section>

      <NextStep
        siteName={ollaCart.name}
        href={ollaCart.url}
        title="Save the equipment and supplies in one cart"
        linkLabel="Open OllaCart"
        note={ollaCart.note}
      >
        <p>
          OllaCart is a universal shopping cart. Save products from any store with the Chrome extension or the iOS app,
          keep them in one list, and check out on each store’s own site when you are ready. That is a useful step when
          you are comparing equipment, inventory, or supplies before you decide how to pay. Some product links on
          OllaCart are affiliate links. A commission may be paid to OllaCart or the person who shared the item, at no
          extra cost to the buyer. OllaCart does not lend money and does not finance the purchase.
        </p>
      </NextStep>
    </EditorialPage>
  )
}
