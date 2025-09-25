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
          params: searchTerm ? { search: searchTerm } : {}, // 👈 attach search if not empty
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

  // ⏳ re-fetch whenever search changes
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchItems(search)
    }, 400) // debounce: wait 400ms after typing stops
    return () => clearTimeout(delayDebounce)
  }, [search])

  // load all on first render
  useEffect(() => {
    fetchItems()
  }, [])

  if (loading) return <p>Loading items...</p>
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>

  return (
    <div style={{ padding: "20px" }}>
      <h1>📦 Items List</h1>

      {/* 🔍 Search input (auto fetch on change) */}
      <input
        type="text"
        placeholder="Search items..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: "20px" }}
      />

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
