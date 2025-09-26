"use client"
import { LandingNavBar } from "@/components/layout/LandingNavBar"
import Navbar from "@/components/layout/Navbar"
import { motion } from "framer-motion"
import Image from "next/image"
import Footer from "@/components/layout/Footer"

export default function AboutUs() {
    return (
        <div>
            <Navbar />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 md:px-12 pt-24">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-center md:text-left">
                        About Us
                    </h1>
                    <p className="max-w-2xl text-center text-base sm:text-lg md:text-xl text-muted-foreground mb-10">
                        <span className="font-semibold">Bai & Sel</span> is a simple buy and sell
                        website where anyone can buy and sell their things. The name was inspired by
                        our good friend <span className="font-semibold">Russel</span>.
                    </p>
                    <div
                        className="flex flex-col md:flex-row items-center md:items-stretch max-w-5xl w-full rounded-2xl overflow-hidden shadow-lg bg-card border border-border
                        hover:scale-[101%] transition-all duration-700"
                    >
                        <div className="w-full md:w-1/2 flex justify-center bg-background">
                            <Image
                                src="/about.png"
                                alt="Russel in the early 1990s"
                                width={500}
                                height={700}
                                className="w-full h-auto max-h-[450px] object-contain md:object-cover"
                            />
                        </div>

                        <div className="w-full md:w-1/2 p-6 flex flex-col justify-center text-center md:text-left">
                            <h2 className="text-2xl font-bold tracking-tight mb-3 font-serif">
                                Russel — Our Great Friend
                            </h2>
                            <p className="text-muted-foreground leading-relaxed font-light text-base">
                                Back in the early 1990s, Russel was more than just a friend — he was
                                the heart of every gathering. Always buying and selling with unmatched
                                energy, he carried a loyalty and spirit that inspired{" "}
                                <span className="font-semibold">Bai & Sel</span>. His legacy of
                                connection and trust is what continues to guide us today.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
            <Footer />
        </div>
    )
}
