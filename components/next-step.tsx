import type { ReactNode } from "react"
import { ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function NextStep({
  siteName,
  href,
  title,
  children,
  linkLabel,
  note,
}: {
  siteName: string
  href: string
  title: string
  children: ReactNode
  linkLabel: string
  note: string
}) {
  return (
    <Card className="glass-card border-primary/20">
      <CardContent className="p-6 sm:p-8">
        <p className="text-sm font-semibold text-primary mb-2">Next step · {siteName}</p>
        <h2 className="font-serif font-bold text-2xl text-foreground mb-3">{title}</h2>
        <div className="text-muted-foreground space-y-3 mb-6">{children}</div>
        <Button asChild>
          <a href={href} target="_blank" rel="noopener">
            {linkLabel}
            <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </Button>
        <p className="text-xs text-muted-foreground mt-4">{note}</p>
      </CardContent>
    </Card>
  )
}
