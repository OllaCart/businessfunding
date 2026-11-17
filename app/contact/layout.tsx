import type { ReactNode } from "react"
import { pageMetadata } from "@/lib/site"

export const metadata = pageMetadata(
  "Contact",
  "Ask which business funding path fits. Sure Thing Lending replies with a guide or a related site. The form is not a loan application and it does not quote a rate.",
  "/contact",
)

export default function ContactLayout({ children }: { children: ReactNode }) {
  return children
}
