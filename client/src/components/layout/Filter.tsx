"use client"

import { useState } from "react"

type Props = {
  onFilter: (filters: Record<string, any>) => void
}

export default function ItemFilter({ onFilter }: Props) {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")

  const handleApply = () => {
    const filters = {
      ...(search && { search }),
      ...(category && { category }),
      ...(minPrice && { minPrice }),
      ...(maxPrice && { maxPrice }),
    }
    console.log("📦 Sending filters:", filters) // 👈 debug
    onFilter(filters) // 👈 send to ItemList
  }

  return (
    <div className="space-y-2">
      <input
        type="text"
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-1"
      />
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border p-1"
      />
      <input
        type="number"
        placeholder="Min Price"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
        className="border p-1"
      />
      <input
        type="number"
        placeholder="Max Price"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
        className="border p-1"
      />
      <button onClick={handleApply} className="border px-2 py-1">
        Apply Filters
      </button>
    </div>
  )
}
