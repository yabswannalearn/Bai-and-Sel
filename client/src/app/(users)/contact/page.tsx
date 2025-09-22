"use client"
import { LandingNavBar } from "@/components/layout/LandingNavBar"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {motion} from "framer-motion"
export default function ContactUs() {
  return (
    <div>
      <LandingNavBar />

      <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>

        <div className="flex w-full min-h-screen justify-center items-center p-4">
        <Card className="w-full max-w-lg shadow-xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Contact Us</CardTitle>
          </CardHeader>

          <CardContent>
            <form className="flex flex-col gap-4">
              <Input type="text" placeholder="Your Name" required />
              <Input type="email" placeholder="Your Email" required />
              <Textarea placeholder="Your Message..." className="min-h-[120px]" required />
            </form>
          </CardContent>

          <CardFooter className="flex justify-end">
            <Button type="submit">Send Message</Button>
          </CardFooter>
        </Card>
      </div>

      </motion.div>
    
      
    </div>
  )
}
