"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NEXT_PUBLIC_API_URL } from "@/constants/paths"


type Item = {
  id: number
  name: string
  description: string
  category?: string
  image?: string
  itemLocation?: string
  price: number
}

type EditItemModalProps = {
  item: Item
  onUpdated: (updatedItem: Item) => void
}

export default function EditItemModal({ item, onUpdated }: EditItemModalProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(item.name)
  const [description, setDescription] = useState(item.description)
  const [category, setCategory] = useState(item.category || "")
  const [image, setImage] = useState<File | null>(null)
  const [itemLocation, setLocation] = useState(item.itemLocation || "")
  const [price, setPrice] = useState(item.price)
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const handleUpdate = async () => {
    try {
      setLoading(true)

      const formData = new FormData()
      if (name) formData.append("name", name)
      if (description) formData.append("description", description)
      if (category) formData.append("category", category)
      if (itemLocation) formData.append("itemLocation", itemLocation)
      if (price) formData.append("price", price.toString())
      if (image) formData.append("image", image)

      const res = await axios.patch(
        `${NEXT_PUBLIC_API_URL}/items/${item.id}`,
        formData,
        {
          withCredentials: true, // let Axios handle Content-Type automatically
        }
      )

      if (res.data?.item) {
        onUpdated(res.data.item)
      }

      setOpen(false)
      router.refresh()
    } catch (err: any) {
      console.error("❌ Error updating item", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">Edit Item</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
        </DialogHeader>
        <div
          className="space-y-4"
          onPaste={(e: React.ClipboardEvent<HTMLDivElement>) => {
            const items = e.clipboardData.items
            for (let i = 0; i < items.length; i++) {
              if (items[i].type.indexOf("image") !== -1) {
                const file = items[i].getAsFile()
                if (file) setImage(file)
                e.preventDefault()
                e.stopPropagation()
              }
            }
          }}
        >
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>Description</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <Label>Category</Label>
            <Input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <div>
            <Label>Price</Label>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </div>
          <div>
            <Label>Location</Label>
            <Input
              value={itemLocation}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Upload Image
            </Label>
            <label className="flex items-center justify-center w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-dashed rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {image
                  ? image.name
                  : item.image
                  ? item.image.split("/").pop()
                  : "Choose or paste an image..."}
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
          <Button onClick={handleUpdate} disabled={loading}>
            {loading ? "Updating..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
