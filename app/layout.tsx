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
  title: "Bay Town Marina - Premium Dock Slips & Marine Services",
  description:
    "Experience luxury on the water at Bay Town Marina. Premium dock slips, full-service marina with 24/7 security, fuel dock, and concierge services. Book your slip today.",
  keywords: [
    "marina",
    "dock slips",
    "boat storage",
    "marine services",
    "Bay Town",
    "luxury marina",
    "boat rental",
    "harbor",
    "yacht club",
  ],
  authors: [{ name: "Bay Town Marina" }],
  creator: "Bay Town Marina",
  publisher: "Bay Town Marina",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://baytownmarina.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Bay Town Marina - Premium Dock Slips & Marine Services",
    description: "Experience luxury on the water with premium dock slips and world-class amenities.",
    url: "https://baytownmarina.com",
    siteName: "Bay Town Marina",
    images: [
      {
        url: "/placeholder.svg?height=630&width=1200",
        width: 1200,
        height: 630,
        alt: "Bay Town Marina - Luxury dock slips and harbor view",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bay Town Marina - Premium Dock Slips & Marine Services",
    description: "Experience luxury on the water with premium dock slips and world-class amenities.",
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
              name: "Bay Town Marina",
              description: "Premium dock slips and marine services with 24/7 security and concierge services",
              url: "https://baytownmarina.com",
              telephone: "(555) 123-4567",
              email: "info@baytownmarina.com",
              address: {
                "@type": "PostalAddress",
                streetAddress: "123 Harbor Drive",
                addressLocality: "Bay Town",
                addressRegion: "FL",
                postalCode: "33101",
                addressCountry: "US",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: "25.7617",
                longitude: "-80.1918",
              },
              openingHours: "Mo-Su 00:00-23:59",
              priceRange: "$225-$950",
              amenityFeature: [
                {
                  "@type": "LocationFeatureSpecification",
                  name: "24/7 Security",
                },
                {
                  "@type": "LocationFeatureSpecification",
                  name: "Fuel Dock",
                },
                {
                  "@type": "LocationFeatureSpecification",
                  name: "Concierge Services",
                },
                {
                  "@type": "LocationFeatureSpecification",
                  name: "Maintenance Services",
                },
              ],
            }),
          }}
        />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  )
}
