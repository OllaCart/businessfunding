import type { ReactNode } from "react"
import Link from "next/link"
import { BusinessHeader } from "@/components/business-header"
import { BusinessFooter } from "@/components/business-footer"

export function EditorialPage({
  eyebrow,
  title,
  lede,
  breadcrumb,
  image,
  children,
}: {
  eyebrow?: string
  title: string
  lede: string
  breadcrumb?: { href: string; label: string }
  image?: { src: string; alt: string }
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <BusinessHeader />
      <article className="pt-24 pb-16">
        <header className="bg-gradient-to-br from-primary/5 to-secondary/5 pb-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              {breadcrumb && (
                <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-4">
                  <Link href={breadcrumb.href} className="hover:text-primary transition-colors">
                    {breadcrumb.label}
                  </Link>
                  <span aria-hidden="true"> / </span>
                  <span className="text-foreground">{title}</span>
                </nav>
              )}
              {eyebrow && <p className="text-sm font-semibold uppercase tracking-wide text-primary mb-3">{eyebrow}</p>}
              <h1 className="font-serif font-bold text-4xl sm:text-5xl text-foreground mb-6 leading-tight">{title}</h1>
              <p className="text-xl text-muted-foreground leading-relaxed">{lede}</p>
              {image && (
                <figure className="mt-8">
                  <img src={image.src} alt={image.alt} className="w-full h-64 sm:h-80 object-cover rounded-xl" />
                </figure>
              )}
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          <div className="max-w-3xl mx-auto space-y-10 text-base leading-relaxed">{children}</div>
        </div>
      </article>
      <BusinessFooter />
    </div>
  )
}
