"use client"

import React, { useEffect, useState } from "react"
import axios from "axios"
import Navbar from "@/components/layout/Navbar"
import ItemList from "@/components/layout/ItemList"
import Footer from "@/components/layout/Footer"
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;


axios.defaults.withCredentials = true

export default function Page() {
  const [message, setMessage] = useState("Loading")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}`)
        setMessage(res.data.message)
      } catch (err) {
        console.error("Error fetching data:", err)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">{message}</h2>
        <ItemList />
      </div>
    </div>
    
  )
  
}
