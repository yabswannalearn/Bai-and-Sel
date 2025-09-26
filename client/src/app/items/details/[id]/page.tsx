"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import axios from "axios"

type Item = {
  id: number
  name: string
  description: string
  image?: string
  userName?: string
  userEmail?: string
  CreatedAt?: string
}

export default function ItemDetail() {
  const { id } = useParams()
  const [item, setItem] = useState<Item | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  if (loading) return <p className="p-4">Loading...</p>
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>
  if (!item) return <p className="p-4">Item not found</p>

  return (
    <section className="p-4 space-y-4">
      {item.image && (
        <img
          src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}${item.image}`}
          alt={item.name}
          className="w-64 h-64 object-cover rounded-md border"
        />
      )}
      <h1 className="text-2xl font-bold">{item.name}</h1>
      <p>{item.description}</p>
      <p>
        Posted by: <b>{item.userName || "Unknown"}</b>
      </p>
      <p>
        Contact: <b>{item.userEmail || "Unknown"}</b>
      </p>
      <p>
        Posted at: <b>{item.CreatedAt || "Unknown"}</b>
      </p>
    </section>
  )
}
