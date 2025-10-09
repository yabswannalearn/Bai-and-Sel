"use client"

import Link from "next/link"

export default function Footer() {
  return (
    <footer className="w-full bg-background fixed bottom-0 z-10">
      <div className="flex items-center justify-center text-sm text-muted-foreground py-2 relative">
        <div className="flex gap-4">
          <Link href="/about" className="hover:underline">
            About Us
          </Link>
          {/* <Link href="/contact" className="hover:underline">
            Contact
          </Link> */}
        </div>
        <div className="absolute right-4 text-xs">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
