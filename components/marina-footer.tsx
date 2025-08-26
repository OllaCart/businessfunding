import Link from "next/link"
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from "lucide-react"

export function MarinaFooter() {
  return (
    <footer className="bg-sidebar text-sidebar-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <img src="/images/marina-logo.svg" alt="MarinaBy-The-Sea" className="h-8 w-auto" />
              <span className="font-serif font-bold text-xl">MarinaBy-The-Sea</span>
            </Link>
            <p className="text-sidebar-foreground/80 mb-4 max-w-md">
              Experience luxury on the water with our premium dock slips, full-service marina amenities, and exceptional
              customer service. Your vessel deserves the finest waterfront experience.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-sidebar-foreground/60 hover:text-sidebar-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-sidebar-foreground/60 hover:text-sidebar-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-sidebar-foreground/60 hover:text-sidebar-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/slips" className="text-sidebar-foreground/80 hover:text-sidebar-primary transition-colors">
                  Dock Slips
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sidebar-foreground/80 hover:text-sidebar-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/posts" className="text-sidebar-foreground/80 hover:text-sidebar-primary transition-colors">
                  Marina Updates
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sidebar-foreground/80 hover:text-sidebar-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/waitlist"
                  className="text-sidebar-foreground/80 hover:text-sidebar-primary transition-colors"
                >
                  Join Waitlist
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/login"
                  className="text-sidebar-foreground/60 hover:text-sidebar-primary transition-colors text-sm"
                >
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-serif font-semibold text-lg mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-sidebar-primary" />
                <span className="text-sidebar-foreground/80 text-sm">
                  123 Harbor Drive
                  <br />
                  Bay Town, FL 33101
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-sidebar-primary" />
                <span className="text-sidebar-foreground/80 text-sm">(555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-sidebar-primary" />
                <span className="text-sidebar-foreground/80 text-sm">info@marinabythesea.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-sidebar-border mt-8 pt-8 text-center">
          <p className="text-sidebar-foreground/60 text-sm">© 2024 MarinaBy-The-Sea. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
