import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    { path: "", priority: 1, changeFrequency: "weekly" as const },
    { path: "/loans", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/guides", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/guides/working-capital", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/guides/equipment-and-inventory", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/guides/commercial-property", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/guides/how-funding-works", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/about", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/contact", priority: 0.6, changeFrequency: "yearly" as const },
    { path: "/disclosures", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/terms", priority: 0.3, changeFrequency: "yearly" as const },
  ]

  return paths.map((page) => ({
    url: `${SITE_URL}${page.path}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }))
}
