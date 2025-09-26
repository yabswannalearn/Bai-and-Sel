"use client"

import Link from "next/link"

export default function Footer() {
  return (
    <footer className="w-full bg-background px-4 py-0.5 mt-6">
      <div className="relative flex items-center justify-center text-sm text-muted-foreground h-6">
        {/* Centered links */}
        <div className="flex gap-4">
          <Link href="/about" className="hover:underline">
            About Us
          </Link>
          <Link href="/contact" className="hover:underline">
            Contact
          </Link>
        </div>

        {/* Right-side copyright */}
        <div className="absolute right-4 text-xs">
          © 2025 All rights reserved.
        </div>
      </div>
    </footer>
  )
}
