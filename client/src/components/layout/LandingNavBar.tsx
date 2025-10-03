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

export const LandingNavBar = () => {
    const [darkMode, setDarkMode] = useState(false)
    const [mounted, setMounted] = useState(false)

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
        setDarkMode(darkMode ? false : true)
    }

    return (
        <nav className="w-full flex fixed top-0 p-4 border-1">
            <div className="flex justify-between w-full">
                <Link href="/">
                    <h1 className="font-bold text-xl cursor-pointer transition active:scale-95">BNS</h1>
                </Link>

                <div className="flex gap-x-4 hidden md:flex items-center">
                    <Button asChild variant="ghost" className="cursor-pointer transition active:scale-95">
                        <Link href="/">Shop</Link>
                    </Button>
                    <Button asChild variant="ghost" className="cursor-pointer transition active:scale-95">
                        <Link href="/about">About Us</Link>
                    </Button>
                    <Button asChild variant="ghost" className="cursor-pointer transition active:scale-95">
                        <Link href="/contact">Contact</Link>
                    </Button>
                    <Button
                        variant="ghost"
                        className="flex items-center justify-center cursor-pointer transition active:scale-95"
                        onClick={modeButton}
                    >
                        {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </Button>
                </div>

                <div className="md:hidden">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="cursor-pointer transition active:scale-95">
                                <ChevronDown />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-40">
                            <DropdownMenuItem>
                                <Link href="/" className="cursor-pointer transition active:scale-95">Shop</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link href="/about" className="cursor-pointer transition active:scale-95">About us</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link href="/contact" className="cursor-pointer transition active:scale-95">Contact</Link>
                            </DropdownMenuItem>
                            <Button
                                variant="ghost"
                                onClick={modeButton}
                                className="cursor-pointer transition active:scale-95"
                            >
                                {darkMode ? <Sun /> : <Moon />}
                            </Button>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </nav>
    )
}
