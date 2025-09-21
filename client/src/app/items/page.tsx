"use client";

import axios from "axios";
import { error } from "console";
import { useEffect, useState } from "react";

export default function ItemsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null)

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/items`,
        { withCredentials: true } // ✅ ensures cookies (JWT) are sent
      );
      setItems(res.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

    const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/items/${id}`, {
        withCredentials: true,
      });
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("❌ Error deleting item:", err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);


  if (loading) return <p>Loading items...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>📦 Items List</h1>
      <ul>
        {items.length === 0 && <p>No items found.</p>}
        {items.map((item) => (
          <li key={item.id}>
            <strong>{item.name}</strong>: {item.description}
            <button
              onClick={() => handleDelete(item.id)}
              style={{ marginLeft: "10px", color: "red" }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}