"use client"

import React, { useEffect, useState } from "react"
import axios from "axios"
import Navbar from "@/components/layout/Navbar"
import ItemList from "@/components/layout/ItemList"

axios.defaults.withCredentials = true

export default function Page() {
  const [message, setMessage] = useState("Loading")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:3001")
        setMessage(res.data.message)
      } catch (err) {
        console.error("Error fetching data:", err)
      }
    }

    fetchData()
  }, [])

  return (
    <div>
      <Navbar />
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">{message}</h2>
        <ItemList />
      </div>
    </div>
  )
}
