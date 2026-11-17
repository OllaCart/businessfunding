export type FundingProgram = {
  id: string
  name: string
  image: string
  imageAlt: string
  guideHref: string
  guideLabel: string
  summary: string
  detail: string
}

export const fundingPrograms: FundingProgram[] = [
  {
    id: "working-capital",
    name: "Working capital",
    image: "/images/working-capital.jpg",
    imageAlt: "Envelopes and a calculator on a small-business desk, standing in for a cash-flow gap.",
    guideHref: "/guides/working-capital",
    guideLabel: "Working-capital guide",
    summary:
      "Working capital covers a timing gap: payroll, rent, or a supplier bill that has to be paid before customer money lands. It can be a line you draw and repay, or a lump sum. It is a poor fit for buying a building.",
    detail:
      "If the gap exists because US clients pay slowly, getting paid can matter more than borrowing. The guide separates those two moves and links to Swiftfi only for the getting-paid case. Swiftfi is not a loan.",
  },
  {
    id: "term-funding",
    name: "Term funding",
    image: "/images/compare-offers.jpg",
    imageAlt: "Two stacks of blank paper and a pen, the materials for comparing a funding offer.",
    guideHref: "/guides/how-funding-works",
    guideLabel: "How to compare an offer",
    summary:
      "A term deal is a set amount, repaid on a schedule. Lenders look at time in business, revenue, existing debt, and whether you will personally guarantee it.",
    detail:
      "Some products are loans. Others buy a slice of future card sales. Those are not the same obligation. This site does not place term loans and does not quote a price for them.",
  },
  {
    id: "equipment-and-inventory",
    name: "Equipment and inventory",
    image: "/images/equipment-inventory.jpg",
    imageAlt: "A commercial mixer beside shelves of plain boxes in a workshop.",
    guideHref: "/guides/equipment-and-inventory",
    guideLabel: "Equipment and inventory guide",
    summary:
      "Equipment financing and leases use the equipment as part of the deal. Inventory funding pays for goods you expect to resell. The first useful step is the real price from more than one seller.",
    detail:
      "The guide links to OllaCart as a place to save products from any store before you decide how to pay. OllaCart does not lend. A building is not equipment; that path is property.",
  },
  {
    id: "commercial-property",
    name: "Commercial and investment property",
    image: "/images/commercial-property.jpg",
    imageAlt: "A two-story brick commercial building with a ground-floor storefront.",
    guideHref: "/guides/commercial-property",
    guideLabel: "Property guide",
    summary:
      "Property has its own products: commercial mortgages, bridge loans, DSCR loans for rentals, and fix-and-flip loans. A home purchase is in this family too.",
    detail:
      "These are mortgage products arranged by a licensed broker. The guide links to Unbeatable Loans, NMLS 1827883, where those rates are published. That license is not this site’s.",
  },
]

export const fundingProgramCount = fundingPrograms.length
