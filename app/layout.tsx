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
  title: "Marina By-The-Sea - Premium Dock Slips in Lauderdale-By-The-Sea",
  description:
    "Experience luxury on the water at Marina By-The-Sea. Premium floating dock slips with 24/7, fuel refuellings, and detailing services. Book your slip today.",
  keywords: [
    "marina",
    "dock slips",
    "boat storage",
    "marine services",
    "Lauderdale By-The-Sea",
    "luxury marina",
    "boat rental",
    "harbor",
    "yacht club",
  ],
  authors: [{ name: "Marina By-The-Sea" }],
  creator: "MarinaBTS",
  publisher: "MarinaBTS",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://marinabts.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Marina By-The-Sea - Premium Dock Slips in Lauderdale-By-The-Sea",
    description: "Experience convenience and luxury on the water in Lauderdale-By-The-Sea with premium floating dock slips.",
    url: "https://marinabts.com",
    siteName: "MarinaBTS",
    images: [
      {
        url: "/placeholder.svg?height=630&width=1200",
        width: 1200,
        height: 630,
        alt: "Marina By-The-Sea - Floating dock slips in Lauderdale-By-The-Sea",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Marina By-The-Sea - Premium Dock Slips & Marine Services",
    description: "Experience luxury on the water with premium dock slips in Lauderdale-By-The-Sea.",
    images: ["/placeholder.svg?height=630&width=1200"],
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
  generator: "v0.app",
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
              "@type": "Marina",
              name: "Marina By-The-Sea",
              description: "Premium dock slips and marine services with 24/7 security and concierge services",
              url: "https://marinabts.com",
              telephone: "+1-954-790-1588",
              email: "dylan@dreamsdev.co",
              address: {
                "@type": "PostalAddress",
                streetAddress: "230 Basin Drive",
                addressLocality: "Lauderdale-By-The-Sea",
                addressRegion: "FL",
                postalCode: "33308",
                addressCountry: "US",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 25.26189223,
                longitude: -80.099866,
              },
              openingHours: "Mo-Su 00:00-23:59",
              priceRange: "$$$",
              amenityFeature: [
                {
                  "@type": "LocationFeatureSpecification",
                  name: "24/7 Security",
                },
                {
                  "@type": "LocationFeatureSpecification",
                  name: "Fuel Refuelling",
                },
                {
                  "@type": "LocationFeatureSpecification",
                  name: "Detailing Service",
                },
                {
                  "@type": "LocationFeatureSpecification",
                  name: "Maintenance Referrals",
                },
              ],
              hasMap: "https://maps.google.com/?q=25.26189223,-80.099866",
              sameAs: [
                "https://www.facebook.com/marinabts",
                "https://www.instagram.com/marinabts"
              ],
              areaServed: {
                "@type": "City",
                name: "Lauderdale-By-The-Sea"
              },
            }),
          }}
        />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  )
}
