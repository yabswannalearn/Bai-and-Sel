"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import axios from "axios"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import Navbar from "@/components/layout/Navbar"

type Item = {
  id: number
  name: string
  description: string
  image?: string
  userName?: string
  userEmail?: string
  createdAt?: string
}

export default function ItemDetail() {
  const { id } = useParams()
  const [item, setItem] = useState<Item | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFavorited, setIsFavorited] = useState(false) // default false

  useEffect(() => {
    if (!id) return
    const fetchItem = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/items/${id}`,
          { withCredentials: true }
        )
        setItem(res.data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchItem()
  }, [id])

  const toggleFavorite = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/favorites/toggle`,
        { itemId: id },
        { withCredentials: true }
      )
      setIsFavorited((prev) => !prev) // just flip locally
    } catch (err: any) {
      console.error("Favorite toggle failed:", err.message)
    }
  }

  if (loading) return <p className="p-4">Loading...</p>
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>
  if (!item) return <p className="p-4">Item not found</p>

  return (
    <>
    < Navbar />

    <section className="p-6 mt-20">
      <Card className="max-w-5xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Image */}
        <div className="flex justify-center items-start">
          {item.image ? (
            <img
              src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}${item.image}`}
              alt={item.name}
              className="w-full max-w-md object-contain rounded-md border"
            />
          ) : (
            <div className="w-full max-w-md h-64 bg-gray-100 flex items-center justify-center rounded-md">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
        </div>

        {/* Right: Details */}
        <div className="flex flex-col justify-between space-y-6">
          <CardHeader className="p-0 flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl font-bold">{item.name}</CardTitle>
              <CardDescription className="text-base">
                Posted by <b>{item.userName || "Unknown"}</b>
              </CardDescription>
            </div>

            {/* Heart Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFavorite}
              className="ml-4"
            >
              <Heart
                className={`w-6 h-6 ${
                  isFavorited ? "fill-red-500 text-red-500" : "text-gray-500"
                }`}
              />
            </Button>
          </CardHeader>

          <CardContent className="p-0 space-y-4">
            <p className="text-lg">{item.description}</p>
            <p>
              Contact: <b>{item.userEmail || "Unknown"}</b>
            </p>
            <p className="text-sm text-muted-foreground">
              Posted at: <b>{item.createdAt || "Unknown"}</b>
            </p>

            {/* Example action buttons */}
            <div className="flex gap-4 mt-6">
              <Button size="lg" className="w-1/2">
                Contact Seller
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>
    </section>
    </>
  )
}
