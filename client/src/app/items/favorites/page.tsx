"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { jwtDecode } from "jwt-decode"
import { Loader2 } from "lucide-react"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/layout/Navbar"

type FavoriteItem = {
  id: number
  name: string
  description: string
  image?: string
  createdAt?: string
  userName?: string
  price: number
  itemLocation: string
}

type TokenPayload = {
  id: number
  email: string
  exp?: number
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAuth, setIsAuth] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_AUTH_API}/me`, {
          withCredentials: true,
        })
        if (res.data) {
          setIsAuth(true)
        }
      } catch {
        setIsAuth(false)
        router.push("/login")
      }
    }
    checkAuth()
  }, [router])

  useEffect(() => {
    if (!isAuth) return
    const fetchFavorites = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/favorites`,
          { withCredentials: true }
        )
        setFavorites(res.data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchFavorites()
  }, [isAuth])

  const removeFavorite = async (itemId: number) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/favorites/toggle`,
        { itemId },
        { withCredentials: true }
      )
      setFavorites((prev) => prev.filter((item) => item.id !== itemId))
      toast.success("Removed Favorites!")
    } catch (err: any) {
      console.error("❌ Remove favorite error:", err.message)
    }
  }

  if (loading) {
    return (
      <>
        <div className="flex items-center justify-center h-[80vh]">
          <Loader2 className="w-10 h-10 animate-spin text-gray-600" />
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Navbar />
        <p className="p-4 text-red-500">Error: {error}</p>
      </>
    )
  }

  if (favorites.length === 0) {
    return (
      <>
        <Navbar />
        <p className="p-4">No favorites yet.</p>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <section className="p-6 max-w-6xl mx-auto mt-20">
        <h1 className="text-3xl font-bold mb-6">My Favorites</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {favorites.map((item) => (
            <Card
              key={item.id}
              className="hover:shadow-lg transition flex flex-col"
            >
              <Link href={`/items/details/${item.id}`} className="flex-grow">
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden rounded-t-md">
                  {item.image ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}${item.image}`}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-500">No Image</span>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="text-lg truncate">
                    {item.name}
                  </CardTitle>
                  <CardDescription className="truncate">
                    {item.userName
                      ? `Posted by ${item.userName}`
                      : "Unknown user"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="font-bold text-base text-foreground">
                    {item.price
                      ? `₱${Number(item.price).toLocaleString()}`
                      : "No price"}
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>
                  {item.itemLocation && (
                    <p>
                      Location: <b>{item.itemLocation || "Wala e"}</b>
                    </p>
                  )}
                </CardContent>
              </Link>
              <div className="p-4">
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => removeFavorite(item.id)}
                >
                  Remove
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </>
  )
}
