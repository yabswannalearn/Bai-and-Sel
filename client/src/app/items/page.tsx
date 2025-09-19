"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function ItemsPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/items`);
        setItems(res.data);
      } catch (err) {
        console.error("Error fetching items: ", err);
      }
    };

    fetchItems();
  }, []);

  return (
    <div>
      <h1>Items List</h1>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <strong>{item.name}</strong>: {item.description}
          </li>
        ))}
      </ul>
    </div>
  );
}
