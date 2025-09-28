"use client"
import { useEffect, useState } from "react"
import { Button } from "../ui/button"
import { Sun, Moon, ChevronDown } from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import LogoutModal from "../modal/LogoutModal"
import AddItemModal from "../modal/AddItemModal"
import axios from "axios"

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // ✅ Check login state
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_AUTH_API}/me`,
          { withCredentials: true }
        )
        if (res.data) setIsLoggedIn(true)
      } catch {
        setIsLoggedIn(false)
      }
    }
    checkAuth()
  }, [])

  // ✅ Dark mode persistence
  useEffect(() => {
    const saved = localStorage.getItem("darkMode")
    if (saved) setDarkMode(JSON.parse(saved))
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode))
  }, [darkMode, mounted])

  const modeButton = (e: React.FormEvent) => {
    e.preventDefault()
    setDarkMode(!darkMode)
  }

  return (
    <nav className="w-full flex fixed top-0 p-4 border-b bg-background z-50">
      <div className="flex justify-between w-full items-center">
        <Link href="/">
          <h1 className="font-bold text-xl cursor-pointer transition active:scale-95">
            My App
          </h1>
        </Link>

        {/* Desktop Links */}
        <div className="flex gap-x-4 hidden md:flex items-center">
          {/* ✅ Show only if logged in */}
          {isLoggedIn && (
            <>
              <Button asChild variant="ghost" className="cursor-pointer transition active:scale-95">
                <Link href="/items/favorites">Favorites</Link>
              </Button>
              <AddItemModal />
            </>
          )}

          {/* Dark mode toggle */}
          <Button
            variant="ghost"
            className="flex items-center justify-center cursor-pointer transition active:scale-95"
            onClick={modeButton}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>

          {/* ✅ Show Logout or Login */}
          {isLoggedIn ? (
            <Button
              variant="destructive"
              className="cursor-pointer transition active:scale-95"
              onClick={() => setShowModal(true)}
            >
              Logout
            </Button>
          ) : (
            <Button asChild variant="default" className="cursor-pointer transition active:scale-95">
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="cursor-pointer transition active:scale-95">
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40">
              <DropdownMenuItem>
                <Link href="/about" className="cursor-pointer transition active:scale-95">
                  About us
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/contact" className="cursor-pointer transition active:scale-95">
                  Contact
                </Link>
              </DropdownMenuItem>

              {/* ✅ Show only if logged in */}
              {isLoggedIn && (
                <>
                  <DropdownMenuItem>
                    <Link href="/items/favorites" className="cursor-pointer transition active:scale-95">
                      Favorites
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <AddItemModal />
                  </DropdownMenuItem>
                </>
              )}

              <DropdownMenuItem asChild>
                <Button
                  variant="ghost"
                  onClick={modeButton}
                  className="cursor-pointer transition active:scale-95 w-full"
                >
                  {darkMode ? <Sun /> : <Moon />}
                </Button>
              </DropdownMenuItem>

              {/* ✅ Mobile Login/Logout */}
              <DropdownMenuItem asChild>
                {isLoggedIn ? (
                  <Button
                    variant="destructive"
                    onClick={() => setShowModal(true)}
                    className="cursor-pointer transition active:scale-95 w-full"
                  >
                    Logout
                  </Button>
                ) : (
                  <Button asChild variant="default" className="cursor-pointer transition active:scale-95 w-full">
                    <Link href="/login">Login</Link>
                  </Button>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {showModal && <LogoutModal onClose={() => setShowModal(false)} />}
    </nav>
  )
}
