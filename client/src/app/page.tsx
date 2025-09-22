"use client"

import React, { useEffect, useState } from "react"
import axios from "axios"
import Navbar from "@/components/layout/Navbar" // adjust the path

axios.defaults.withCredentials = true // ✅ include cookies automatically

export default function Page() {
  const [message, setMessage] = useState("Loading")
  const [items, setItems] = useState<string[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:3001")
        console.log(res.data)
        setMessage(res.data.message)
        setItems(res.data.items)
      } catch (err) {
        console.error("Error fetching data:", err)
      }
    }

    fetchData()
  }, [])

  return (
    <div>
      {/* ✅ Navbar at the top */}
      <Navbar />

      <h2>{message}</h2>
    </div>
  )
}
