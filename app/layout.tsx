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
  title: "Marina By-The-Sea - Premium Floating Dock Slips in Lauderdale-By-The-Sea",
  description:
    "Experience luxury on the water at Marina By-The-Sea. Premium floating dock slips with 24/7 access, fuel refueling, and detailing services. Book your slip today in beautiful Lauderdale-By-The-Sea, Florida.",
  keywords: [
    "marina",
    "dock slips",
    "boat storage",
    "marine services",
    "Lauderdale By-The-Sea",
    "Florida marina",
    "luxury marina",
    "boat rental",
    "harbor",
    "yacht club",
    "floating docks",
    "boat fuel",
    "marine detailing"
  ],
  authors: [{ name: "Marina By-The-Sea" }],
  creator: "Marina By-The-Sea",
  publisher: "Marina By-The-Sea",
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
    title: "Marina By-The-Sea - Premium Floating Slips in Lauderdale-By-The-Sea",
    description: "Experience convenience and luxury on the water in Lauderdale-By-The-Sea with premium floating dock slips, 24/7 access, and full marine services.",
    url: "https://marinabts.com",
    siteName: "Marina By-The-Sea",
    images: [
      {
        url: "/images/marina-logo.svg",
        width: 400,
        height: 400,
        alt: "Marina By-The-Sea Logo - Premium marina services in Lauderdale-By-The-Sea",
      },
      {
        url: "/images/marina-overview.jpg",
        width: 1200,
        height: 630,
        alt: "Marina By-The-Sea - Beautiful marina overview with floating dock slips",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Marina By-The-Sea - Premium Dock Slips & Marine Services",
    description: "Experience luxury on the water with premium dock slips in Lauderdale-By-The-Sea, Florida. 24/7 access, fuel, and full marine services.",
    images: ["/images/marina-overview.jpg"],
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
      { url: "/images/marina-logo.svg", type: "image/svg+xml" }
    ],
    apple: "/images/marina-logo.svg",
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
