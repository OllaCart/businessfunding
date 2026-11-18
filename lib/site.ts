import type { Metadata } from "next"

export const SITE_NAME = "Sure Thing Lending"
export const SITE_URL = "https://surethinglending.com"

export const swiftfi = {
  name: "Swiftfi",
  url: "https://swiftfi.com",
  note: "Related site in the same ownership group.",
}

export const johnPastre = {
  name: "John Pastre",
  nmls: "1827883",
}

export const unbeatableLoans = {
  name: "Unbeatable Loans",
  url: "https://unbeatableloans.com",
  note: "Related site in the same ownership group. It publishes mortgage rates and arranges loans with other lenders.",
}

export const ollaCart = {
  name: "OllaCart",
  url: "https://ollacart.com",
  note: "Related site in the same ownership group.",
}

export function pageMetadata(title: string, description: string, path: string): Metadata {
  const canonical = path.startsWith("/") ? path : `/${path}`
  const url = `${SITE_URL}${canonical === "/" ? "" : canonical}`

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      type: "article",
      locale: "en_US",
    },
  }
}
