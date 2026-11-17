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
  title: {
    default: "Sure Thing Lending | Business funding, explained",
    template: "%s | Sure Thing Lending",
  },
  description:
    "Sure Thing Lending explains working capital, equipment purchases, and property loans in plain language, then refers you to a next step that fits. No rates and no approval promises.",
  keywords: [
    "business funding",
    "working capital",
    "equipment financing",
    "commercial property loans",
    "business funding guide",
    "sure thing lending",
  ],
  authors: [{ name: "Sure Thing Lending" }],
  creator: "Sure Thing Lending",
  publisher: "Sure Thing Lending",
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
    title: "Sure Thing Lending | Business funding, explained",
    description:
      "Plain-language guides to business funding, with a referral to the next step that matches the use of funds.",
    url: "https://surethinglending.com",
    siteName: "Sure Thing Lending",
    images: [
      {
        url: "/images/business-logo.svg",
        width: 400,
        height: 400,
        alt: "Sure Thing Lending",
      },
      {
        url: "/images/business-hero.jpg",
        width: 1200,
        height: 630,
        alt: "Sure Thing Lending, a business funding referral guide",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sure Thing Lending | Business funding, explained",
    description:
      "Plain-language guides to business funding, with a referral to the next step that matches the use of funds.",
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
              "@type": "WebSite",
              name: "Sure Thing Lending",
              url: "https://surethinglending.com",
              description:
                "Plain-language guides to business funding. The site explains working capital, equipment purchases, and property loans, then refers readers to a fitting next step.",
              publisher: {
                "@type": "Organization",
                name: "Sure Thing Lending",
                url: "https://surethinglending.com",
              },
            }),
          }}
        />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  )
}
