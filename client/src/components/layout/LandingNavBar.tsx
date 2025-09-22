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
    const [darkMode, setDarkMode] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("darkMode");
        if (saved) setDarkMode(JSON.parse(saved));
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("darkMode", JSON.stringify(darkMode));
    }, [darkMode, mounted]);



    return (
        <nav className="w-full flex fixed top-0 p-4 border-1">
            <div className="flex justify-between w-full">
                <Link href="/login">  <h1 className="font-bold text-xl">Logo.</h1></Link>

                <div className="flex gap-x-4 hidden md:flex items-center">
                    <Link href="/about"><Button variant="ghost">About Us</Button></Link>
                    <Link href="/contact"><Button variant="ghost">Contact</Button></Link>
                    <Button
                        variant="ghost"
                        className="flex items-center justify-center"
                        onClick={() => setDarkMode(!darkMode)}
                    >
                        {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </Button>
                </div>


                <div className="md:hidden">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost"><ChevronDown /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-40">

                            <DropdownMenuItem>  <Link href="/about">About us</Link> </DropdownMenuItem>
                            <DropdownMenuItem>  <Link href="/contact">Contact</Link></DropdownMenuItem>

                            <Button variant="ghost" onClick={() => setDarkMode(darkMode ? false : true)}> {darkMode ? <Sun /> : <Moon />}</Button>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

            </div>
        </nav>
    )
}
