"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

type Item = {
  id: number
  name: string
  description: string
  image?: string
  userName?: string
  userEmail?: string
}

export default function ItemList() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const router = useRouter()

  const fetchItems = async (searchTerm = "") => {
    try {
      setLoading(true)
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/items`, {
        withCredentials: true,
        params: searchTerm ? { search: searchTerm } : {},
      })
      setItems(res.data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchItems(search)
    }, 400)
    return () => clearTimeout(delayDebounce)
  }, [search])

  useEffect(() => {
    fetchItems()
  }, [])

  if (loading) return <p className="p-4">Loading items...</p>
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>

  return (
    <section className="p-4 space-y-6 mt-20">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <h2 className="text-2xl font-bold">Browse Items</h2>
        <Input
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {items.length === 0 && <p>No items found.</p>}
        {items.map((item) => (
          <Card
            key={item.id}
            className="overflow-hidden transition-transform duration-300 hover:scale-[1.03] cursor-pointer"
            onClick={() => router.push(`/items/details/${item.id}`)}
          >
            <CardContent>
              {item.image && (
                <div className="w-full aspect-square overflow-hidden rounded-md">
                  <img
                    src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}${item.image}`}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
              )}
              <div className="mt-4 text-sm text-muted-foreground space-y-1">
                <p className="font-semibold text-base text-foreground">
                  {item.name}
                </p>
                <p>Posted by: <b>{item.userName || "Unknown"}</b></p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
