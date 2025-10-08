"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import axios from "axios"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { LandingNavBar } from "@/components/layout/LandingNavBar"
import Footer from "@/components/layout/Footer"
import ClientOnly from "@/components/common/ClientOnly"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { NEXT_PUBLIC_AUTH_API } from "@/constants/paths"

axios.defaults.withCredentials = true

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      await axios.post(`${NEXT_PUBLIC_AUTH_API}/register`, {
        name,
        email,
        password,
      })

      toast.success("Registered successfully! Redirecting...", {
        position: "top-right",
        autoClose: 1500,
      })

      setTimeout(() => router.push("/login"), 1600)
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration Failed")
      toast.error(err.response?.data?.message || "Registration Failed", {
        position: "top-right",
      })
    }
  }

  return (
    <div className="transition-all duration-700">
      <LandingNavBar />
      <ClientOnly>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-center items-center w-full min-h-screen">
            <Card className="w-[90%] md:w-1/2 lg:w-1/4 p-4 flex justify-center items-center">
              <h2>Register</h2>
              <form
                onSubmit={handleRegister}
                className="flex flex-col gap-y-4 w-full"
              >
                <Input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <Button type="submit" className="cursor-pointer">
                  Register
                </Button>
              </form>

              <div className="flex items-center justify-center mt-2">
                <p>
                  Already have an account?{" "}
                  <Link href="/login" className="underline text-blue-400">
                    Login
                  </Link>
                </p>
              </div>
            </Card>
          </div>
        </motion.div>
      </ClientOnly>
    </div>
  )
}
