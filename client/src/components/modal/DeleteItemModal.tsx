"use client"

import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

type DeleteItemModalProps = {
  itemId: number
  itemName: string
}

export default function DeleteItemModal({ itemId, itemName }: DeleteItemModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    try {
      setLoading(true)
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/items/${itemId}`, {
        withCredentials: true,
      })
      toast.success("Item deleted successfully!")
      setOpen(false)
      router.push("/") // redirect to home or list
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete item")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button variant="destructive" size="lg" className="w-full" onClick={() => setOpen(true)}>
        Delete Item
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <b>{itemName}</b>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={loading}>
              {loading ? "Deleting..." : "Yes, Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
