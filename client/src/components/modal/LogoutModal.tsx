"use client"

import axios from "axios"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { NEXT_PUBLIC_AUTH_API } from "@/constants/paths"

export default function LogoutModal({ onClose }: { onClose: () => void }) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await axios.post(
        `${NEXT_PUBLIC_AUTH_API}/logout`,
        {},
        { withCredentials: true }
      )
      router.push("/login") // redirect to login
    } catch (err) {
      console.error("Logout error:", err)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Logout</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Are you sure you want to log out?
        </p>

        <DialogFooter className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleLogout}>
            Yes, Logout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
