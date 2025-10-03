"use client"

import Link from "next/link"

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        {/* Empty spacer (to balance layout) */}
        <div className="w-1/3" />

        {/* Centered Links */}
        <div className="flex gap-6 text-sm text-muted-foreground justify-center w-1/3">
          <Link href="/about" className="hover:text-primary transition-colors">
            About Us
          </Link>
          <Link href="/contact" className="hover:text-primary transition-colors">
            Contact
          </Link>
        </div>

        {/* Right: Copyright */}
        <div className="w-1/3 flex justify-end">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
