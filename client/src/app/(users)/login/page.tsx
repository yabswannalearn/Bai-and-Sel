"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import axios from "axios"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { LandingNavBar } from "@/components/layout/LandingNavBar"
import ClientOnly from "@/components/common/ClientOnly"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

axios.defaults.withCredentials = true

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [isAuth, setIsAuth] = useState<boolean | null>(null)
  const phrases = ["Innovate", "Explore", "Discover", "Sell"]
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_AUTH_API}/me`)
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_AUTH_API}/login`, form)
      setLoading(false)
      toast("Login Successful 🎉", {
        description: "Welcome back to Bai & Sel.",
      })
      router.push("/")
    } catch (err: any) {
      setLoading(false)
      const message = err.response?.data?.error || "Login Failed"
      setError(message)
      toast("Error", { description: message })
    }
  }

  useEffect(() => {
    const interval = setInterval(
      () => setIndex((prev) => (prev + 1) % phrases.length),
      3000
    )
    return () => clearInterval(interval)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  if (isAuth === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    )
  }

  if (isAuth === true) return null

  return (
    <div className="min-h-screen flex flex-col transition-all duration-700">
      <LandingNavBar />
      <ClientOnly>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex-1 flex flex-col md:flex-row justify-center items-center gap-6 px-4 md:px-12 py-12"
        >
          <div className="md:w-1/2 flex flex-col gap-4 justify-center text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-thin">
              Welcome to Bai & Sel
            </h1>
            <div className="flex justify-center md:justify-start items-baseline gap-2 h-12">
              <span className="text-xl font-light text-black dark:text-white">
                With Bai & Sel
              </span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="inline-block text-xl md:text-2xl font-semibold text-black dark:text-white w-[30%] md:w-auto text-center"
                >
                  {phrases[index]}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
          <div className="w-full md:w-1/4">
            <Card className="w-full p-6 space-y-4">
              <h2 className="text-2xl font-semibold text-center">Login</h2>
              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                {["email", "password"].map((type) => (
                  <Input
                    key={type}
                    type={type}
                    name={type}
                    placeholder={type.charAt(0).toUpperCase() + type.slice(1)}
                    value={form[type as "email" | "password"]}
                    onChange={handleChange}
                    required
                  />
                ))}
                <Button type="submit" className="w-full cursor-pointer">
                  {loading ? (
                    <Loader2 className="animate-spin mx-auto" />
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>
              {error && <p className="text-red-500 text-center">{error}</p>}
              <p className="text-center text-sm">
                No account yet?{" "}
                <Link
                  href="/register"
                  className="text-blue-500 underline hover:text-blue-800 transition-all duration-300 dark:text-white dark:hover:text-neutral-400"
                >
                  Register
                </Link>
              </p>
            </Card>
          </div>
        </motion.div>
      </ClientOnly>
    </div>
  )
}
