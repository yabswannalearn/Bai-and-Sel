"use client"
import { useEffect, useState } from "react"
import { LandingNavBar } from "@/components/layout/LandingNavBar"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import axios from "axios"
import { toast } from "sonner"
import { Loader, Loader2 } from "lucide-react"
import ClientOnly from "@/components/common/ClientOnly"
import { useRouter } from "next/navigation"

export default function ContactUs() {
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [text, setText] = useState("")
  const [loading, setLoad] = useState(false)
  const [isAuth, setIsAuth] = useState<boolean | null>(null)
  const router = useRouter()

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

  const submitButton = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoad(true)
      const formData = { email, subject, text }
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_AUTH_API}/contact`,
        formData
      )
      if (response.data && response.data.success) {
        setLoad(false)
        setEmail("")
        setSubject("")
        setText("")
        toast("Message Sent 🎉", {
          description: "Thanks for reaching out. We’ll get back to you soon.",
        })
      }
    } catch (err: any) {
      setLoad(false)
      toast("Error", {
        description: err.response?.data?.error || "Something went wrong. Please try again.",
      })
    }
  }

  if (isAuth === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
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
          <div className="flex w-full min-h-screen justify-center items-center p-4">
            <Card className="w-full max-w-lg shadow-xl">
              <CardHeader>
                <CardTitle className="text-center text-2xl">Contact Us</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="flex flex-col gap-4" onSubmit={submitButton}>
                  <Input
                    type="email"
                    placeholder="Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Input
                    type="text"
                    placeholder="Your Subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                  <Textarea
                    placeholder="Your Message..."
                    className="min-h-[120px]"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    required
                  />
                  <Button type="submit" className="cursor-pointer">
                    {loading ? <Loader className="animate-spin" /> : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </ClientOnly>
    </div>
  )
}
