"use client"
import { LandingNavBar } from "@/components/layout/LandingNavBar"
import { motion } from "framer-motion"
export default function AboutUs() {
    return (
        <div>
            <LandingNavBar />

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <div className="flex flex-col items-center justify-center min-h-screen p-6">
                    <h1 className="text-3xl font-bold mb-4">About Us</h1>
                    <p className="max-w-2xl text-center text-lg text-muted-foreground">
                        <span className="font-semibold">Bai & Sel</span> is a simple buy and sell website where
                        anyone can buy and sell their things. The name was inspired by our good friend{" "}
                        <span className="font-semibold">Russel</span>.
                    </p>
                </div>

            </motion.div>
        </div>
    )
}
