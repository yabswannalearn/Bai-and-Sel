"use client";

import { useState } from "react";
import axios from "axios"

export default function AddItemPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/items`,
      { name, description },
      { withCredentials: true}
    );
    console.log(res.data)

    // reset form
    setName("");
    setDescription("");
    } catch (err: any) {
      console.error("Error adding item: ", err);
    }
  };

  return (
    <div>
      <h1>Add New Item</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
        />
        <button type="submit">Add Item</button>
      </form>
    </div>
  );
}
