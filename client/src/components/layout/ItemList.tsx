"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import ItemFilter from "./Filter"

type Item = {
  id: number
  name: string
  description: string
  image?: string
  userName?: string
  userEmail?: string
  price: number
}

export default function ItemList() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const router = useRouter()

  const fetchItems = async (params: Record<string, any> = {}) => {
    try {
      setLoading(true)
      console.log("📡 Fetching items with params:", params) // 👈 debug log

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/items/filter`,
        {
          withCredentials: true,
          params, // 👈 send filters/search as query params
        }
      )
      setItems(res.data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // 🔍 auto-search with debounce
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search.trim()) {
        fetchItems({ search })
      } else {
        fetchItems()
      }
    }, 400)
    return () => clearTimeout(delayDebounce)
  }, [search])

  // first load
  useEffect(() => {
    fetchItems()
  }, [])

  if (loading) return <p className="p-4">Loading items...</p>
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>

  return (
    <section className="p-6 mt-20 flex gap-6">
      {/* Left Sidebar Filter */}
      <ItemFilter onFilter={(filters) => fetchItems(filters)} />

      {/* Right Content */}
      <div className="flex-1 space-y-6">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <h2 className="text-2xl font-bold">Browse Items</h2>
          <Input
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                  <p className="font-bold text-base text-foreground">
                    PHP {Number(item.price).toLocaleString()}
                  </p>
                  <p className="font-semibold text-base text-foreground">
                    {item.name}
                  </p>
                  <p>
                    Posted by: <b>{item.userName || "Unknown"}</b>
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
