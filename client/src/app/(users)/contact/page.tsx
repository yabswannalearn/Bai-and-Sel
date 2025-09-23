"use client"
import { LandingNavBar } from "@/components/layout/LandingNavBar"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useState } from "react"
import axios from "axios"
import { toast } from "sonner"
import { Loader } from "lucide-react"

export default function ContactUs() {
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [text, setText] = useState("")
  const [loading, setLoad] = useState(false)

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
        }
      )
      }
    } catch (err: any) {
      setLoad(false)
      toast("Error", {
        description: err.response?.data?.error || "Something went wrong. Please try again.",
      })
    }
  }

  return (
    <div className="transition-all duration-700">
      <LandingNavBar />
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
                  {loading ? <Loader className="animate-spin"/>: "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  )
}
