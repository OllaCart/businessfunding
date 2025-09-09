import type React from "react"
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import { Open_Sans } from "next/font/google"
import "./globals.css"

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["400", "600", "700", "900"],
})

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
  weight: ["400", "500", "600"],
})

export const metadata: Metadata = {
  title: "Sure Thing Lending - Business Funding & Loan Programs | Unbeatable Loans",
  description:
    "Get the business funding you need with Sure Thing Lending. Fast approval, competitive rates, and flexible terms for small to medium businesses. Apply today for your business loan.",
  keywords: [
    "business funding",
    "business loans",
    "small business loans",
    "commercial loans",
    "business financing",
    "working capital",
    "equipment financing",
    "business credit",
    "loan programs",
    "unbeatable loans",
    "sure thing lending",
    "business capital",
    "commercial funding"
  ],
  authors: [{ name: "Unbeatable Loans" }],
  creator: "Unbeatable Loans",
  publisher: "Unbeatable Loans",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://surethinglending.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Sure Thing Lending - Business Funding & Loan Programs",
    description: "Get the business funding you need with competitive rates, fast approval, and flexible terms. Apply today for your business loan with Unbeatable Loans.",
    url: "https://surethinglending.com",
    siteName: "Sure Thing Lending",
    images: [
      {
        url: "/images/business-logo.svg",
        width: 400,
        height: 400,
        alt: "Sure Thing Lending Logo - Business funding and loan programs",
      },
      {
        url: "/images/business-hero.jpg",
        width: 1200,
        height: 630,
        alt: "Sure Thing Lending - Business funding solutions for growth",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sure Thing Lending - Business Funding & Loan Programs",
    description: "Get the business funding you need with competitive rates and fast approval. Apply today for your business loan.",
    images: ["/images/business-hero.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  generator: "Next.js",
  icons: {
    icon: [
      { url: "/images/business-logo.svg", type: "image/svg+xml" }
    ],
    apple: "/images/business-logo.svg",
  },
}
// suggest changes to the schema.org

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${openSans.variable} antialiased scroll-smooth`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FinancialService",
              name: "Sure Thing Lending",
              description: "Business funding and loan programs with competitive rates, fast approval, and flexible terms for small to medium businesses",
              url: "https://surethinglending.com",
              telephone: "+1-800-SURE-LOAN",
              email: "info@surethinglending.com",
              address: {
                "@type": "PostalAddress",
                streetAddress: "123 Business Plaza",
                addressLocality: "Miami",
                addressRegion: "FL",
                postalCode: "33101",
                addressCountry: "US",
              },
              openingHours: "Mo-Fr 09:00-18:00",
              priceRange: "$$",
              serviceType: [
                {
                  "@type": "Service",
                  name: "Business Loans",
                  description: "Small business loans with competitive rates"
                },
                {
                  "@type": "Service", 
                  name: "Working Capital",
                  description: "Working capital financing for business operations"
                },
                {
                  "@type": "Service",
                  name: "Equipment Financing",
                  description: "Equipment financing for business growth"
                },
                {
                  "@type": "Service",
                  name: "Commercial Loans",
                  description: "Commercial real estate and business loans"
                }
              ],
              areaServed: {
                "@type": "Country",
                name: "United States"
              },
              provider: {
                "@type": "Organization",
                name: "Unbeatable Loans"
              }
            }),
          }}
        />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  )
}
