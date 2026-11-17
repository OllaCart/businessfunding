"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

const links = [
  { href: "/loans", label: "Funding options" },
  { href: "/guides", label: "Guides" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

export function BusinessHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="absolute top-0 left-0 right-0 z-50 glass-nav">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-lg">ST</span>
            </div>
            <span className="font-serif font-bold text-xl text-foreground">Sure Thing Lending</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8" aria-label="Primary">
            {links.map((item) => (
              <Link key={item.href} href={item.href} className="text-foreground hover:text-primary transition-colors">
                {item.label}
              </Link>
            ))}
            <Button asChild className="glass-button text-primary-foreground hover:text-primary-foreground">
              <Link href="/contact">Ask which path fits</Link>
            </Button>
          </nav>

          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20">
            <nav className="flex flex-col space-y-4" aria-label="Mobile">
              {links.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Button asChild className="glass-button text-primary-foreground hover:text-primary-foreground w-fit">
                <Link href="/contact" onClick={() => setIsMenuOpen(false)}>
                  Ask which path fits
                </Link>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
