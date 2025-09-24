"use client"

import axios from "axios"
import { useEffect, useState } from "react"

export default function ItemsPage() {
  const [items, setItems] = useState<any[]>([])
  const [currentUserId, setCurrentUserId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  const fetchItems = async (searchTerm = "") => {
    try {
      setLoading(true)

      const [itemsRes, userRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/items`, {
          withCredentials: true,
          params: searchTerm ? { search: searchTerm } : {}, // 👈 only send if not empty
        }),
        axios.get(`${process.env.NEXT_PUBLIC_AUTH_API}/me`, {
          withCredentials: true,
        }),
      ])

      setItems(itemsRes.data)
      setCurrentUserId(userRes.data?.id || null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/items/${id}`, {
        withCredentials: true,
      })
      setItems((prev) => prev.filter((item) => item.id !== id))
    } catch (err) {
      console.error("❌ Error deleting item:", err)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchItems(search) // 👈 only fetch with keyword
  }

  useEffect(() => {
    fetchItems() // load all items at first
  }, [])

  if (loading) return <p>Loading items...</p>
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>

  return (
    <div style={{ padding: "20px" }}>
      <h1>📦 Items List</h1>

      {/* 🔍 Simple search input */}
      <form onSubmit={handleSearch} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <ul>
        {items.length === 0 && <p>No items found.</p>}
        {items.map((item) => (
          <li key={item.id} style={{ marginBottom: "10px" }}>
            {item.image && (
              <img
                src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}${item.image}`}
                alt={item.name}
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "cover",
                  marginTop: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
              />
            )}
            <strong>{item.name}</strong>: {item.description}
            <br />
            <small>
              Posted by: <b>{item.userName || "Unknown"}</b>
            </small>
            <br />
            <small>
              Contact at: <b>{item.userEmail || "Unknown"}</b>
            </small>
            {item.userId === currentUserId && (
              <button
                onClick={() => handleDelete(item.id)}
                style={{ marginLeft: "10px", color: "red" }}
              >
                Delete
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
