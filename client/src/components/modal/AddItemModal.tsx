"use client";

import { useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddItemModal() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [price, setPrice] = useState("");
  const [itemLocation, setLocation] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("price", price);
      formData.append("itemLocation", itemLocation);
      if (image) formData.append("image", image);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/items`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("✅ Item created:", res.data);

      // ✅ Toast success
      toast.success("Item added successfully!", {
        position: "top-right",
        autoClose: 2000,
      });

      window.dispatchEvent(new Event("ItemsUpdated"))

      // reset form
      setName("");
      setDescription("");
      setCategory("");
      setImage(null);
      setPrice("");
      setLocation("");
    } catch (err: any) {
      console.error("❌ Error adding items", err);

      // ❌ Toast error
      toast.error("Failed to add item. Please try again.", {
        position: "top-right",
      });
    }
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">➕ Add Item</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Item</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              required
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              required
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Category"
              required
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price"
              required
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              value={itemLocation}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
              required
              className="w-full border p-2 rounded"
            />

            <div
              className="space-y-2"
              onPaste={(e: React.ClipboardEvent<HTMLDivElement>) => {
                const items = e.clipboardData.items;
                for (let i = 0; i < items.length; i++) {
                  if (items[i].type.indexOf("image") !== -1) {
                    const file = items[i].getAsFile();
                    if (file) setImage(file);
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }
              }}
            >
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Upload Image
              </label>
              <label className="flex items-center justify-center w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-dashed rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {image ? image.name : "Choose or paste an image..."}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
            </div>

            <Button type="submit" className="w-full">
              Add Item
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
