"use client"
import { LandingNavBar } from "@/components/layout/LandingNavBar"
import Navbar from "@/components/layout/Navbar"
import { motion } from "framer-motion"
import Image from "next/image"
import Footer from "@/components/layout/Footer"
import ClientOnly from "@/components/common/ClientOnly"

export default function AboutUs() {
  return (
    <div>
      <LandingNavBar />
      <ClientOnly>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 md:px-12 pt-24 overflow-hidden">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-center md:text-left">
              About Us
            </h1>
            <p className="max-w-2xl text-center text-base sm:text-lg md:text-xl text-muted-foreground mb-10">
              We are <span className="font-semibold">Incognare</span>, a thesis
              group of three passionate students striving to succeed in tech.
              Right now, we are upscaling our skills and building projects
              together.
            </p>

            <div
              className="flex flex-col md:flex-row items-center md:items-stretch max-w-5xl w-full rounded-2xl overflow-hidden shadow-lg bg-card border border-border
                            hover:scale-[101%] transition-all duration-700"
            >
              {/* IMAGE SWAP */}
              <div className="w-full md:w-1/2 flex justify-center bg-background group relative">
                <Image
                  src="/walang_smile.png"
                  alt="Russel walang smile"
                  width={500}
                  height={700}
                  className="w-full h-auto max-h-[450px] object-contain md:object-cover transition-opacity duration-500 group-hover:opacity-0"
                />
                <Image
                  src="/may_smile.png"
                  alt="Russel may smile"
                  width={500}
                  height={700}
                  className="w-full h-auto max-h-[450px] object-contain md:object-cover absolute top-0 left-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                />
              </div>

              {/* TEXT BOX */}
              <div className="w-full md:w-1/2 p-6 flex flex-col justify-between text-center md:text-left">
                {/* Top Section - Our Journey */}
                <div>
                  <h2 className="text-2xl font-bold tracking-tight mb-3">
                    Our Journey
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-base mb-5">
                    As <span className="font-semibold">Incognare</span>, we
                    believe in learning by building. Every project we create
                    brings us closer to mastering technology and shaping our
                    future careers. Our teamwork, dedication, and passion for
                    tech are what drive us forward.
                  </p>

                  {/* Members Section */}
                  {/* Members Section - moved just below */}
                  <div className="flex flex-col ">
                    <h3 className="text-2xl font-bold mb-4">Our Members</h3>
                    <ul className="space-y-3 -center">
                      <li>
                        <a
                          href="https://github.com/juicemark"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary font-medium hover:text-primary/70 hover:underline transition-colors duration-300"
                        >
                          <strong>Josh Mark Escaño</strong>
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://github.com/yabswannalearn"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary font-medium hover:text-primary/70 hover:underline transition-colors duration-300"
                        >
                          <strong>Reinael Yabut</strong>
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://github.com/nashmglq"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary font-medium hover:text-primary/70 hover:underline transition-colors duration-300"
                        >
                          <strong>Steven Nash Maglaqui</strong>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </ClientOnly>
    </div>
  )
}
