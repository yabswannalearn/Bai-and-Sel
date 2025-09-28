"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import axios from "axios"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { LandingNavBar } from "@/components/layout/LandingNavBar"
import ClientOnly from "@/components/common/ClientOnly"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

axios.defaults.withCredentials = true

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [isAuth, setIsAuth] = useState<boolean | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_AUTH_API}/me`,
          { withCredentials: true }
        )
        if (res.data) {
          setIsAuth(true)
          router.push("/")
        } else {
          setIsAuth(false)
        }
      } catch {
        setIsAuth(false)
      }
    }
    checkAuth()
  }, [router])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_AUTH_API}/register`, {
        name,
        email,
        password,
      })
      setLoading(false)
      toast("✅ Registered successfully!", {
        description: "Redirecting to login...",
      })
      setTimeout(() => router.push("/login"), 1500)
    } catch (err: any) {
      setLoading(false)
      toast("Registration Failed", {
        description:
          err.response?.data?.message || "Something went wrong. Please try again.",
      })
    }
  }

  if (isAuth === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin" />
      </div>
    )
  }

  if (isAuth === true) return null

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
            <Card className="w-[90%] md:w-1/2 lg:w-1/4 p-6 space-y-4">
              <h2 className="text-2xl font-semibold text-center">Register</h2>
              <form onSubmit={handleRegister} className="flex flex-col gap-y-4 w-full">
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
                <Button type="submit" className="cursor-pointer w-full" disabled={loading}>
                  {loading ? <Loader2 className="animate-spin mx-auto" /> : "Register"}
                </Button>
              </form>
              <p className="text-center text-sm">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-blue-500 underline hover:text-blue-800 transition-all duration-300"
                >
                  Login
                </Link>
              </p>
            </Card>
          </div>
        </motion.div>
      </ClientOnly>
    </div>
  )
}
