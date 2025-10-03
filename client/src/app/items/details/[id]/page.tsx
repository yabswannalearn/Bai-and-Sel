"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import Navbar from "@/components/layout/Navbar"
import EditItemModal from "@/components/modal/EditItemModal"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

type Item = {
  id: number
  name: string
  description: string
  category?: string
  image?: string
  userId: number
  userName?: string
  userEmail?: string
  createdAt?: string
  price: number
  itemLocation: string
}

type CurrentUser = {
  id: number
  email: string
  name: string
} | null

export default function ItemDetail() {
  const { id } = useParams()
  const router = useRouter()
  const [item, setItem] = useState<Item | null>(null)
  const [currentUser, setCurrentUser] = useState<CurrentUser>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFavorited, setIsFavorited] = useState(false)

  useEffect(() => {
    if (!id) return
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/items/${id}`,
          { withCredentials: true }
        )
        setItem({
          ...res.data,
          id: Number(res.data.id),
          userId: Number(res.data.userId),
        })
        try {
          const favRes = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/favorites/status/${id}`,
            { withCredentials: true }
          )
          setIsFavorited(favRes.data.favorited)
        } catch (err: any) {
          if (err.response?.status === 401) {
            setIsFavorited(false)
          }
        }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_AUTH_API}/me`, {
          withCredentials: true,
        })

        if (res.data?.id) {
          setCurrentUser({
            ...res.data,
            id: Number(res.data.id),
          })
        } else {
          setCurrentUser(null)
        }
      } catch {
        setCurrentUser(null)
      }
    }
    fetchUser()
  }, [])

  const toggleFavorite = async () => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/favorites/toggle`,
        { itemId: id },
        { withCredentials: true }
      )
      setIsFavorited(res.data.favorited)
      toast.success(
        res.data.favorited ? "Added to favorites!" : "Removed from favorites!"
      )
    } catch (err: any) {
      if (err.response?.status === 401) {
        router.push("/login")
      }
    }
  }

  const isOwner = Boolean(
    currentUser && item && Number(currentUser.id) === Number(item.userId)
  )

  const isLoggedIn = Boolean(currentUser)

  const handleContactSeller = () => {
    if (isOwner) return
    if (!item?.userEmail) return

    const subject = `I am interested in ${item.name}`
    const gmailUrl = `https://mail.google.com/mail/u/0/?view=cm&fs=1&to=${encodeURIComponent(
      item.userEmail
    )}&su=${encodeURIComponent(subject)}`

    window.open(gmailUrl, "_blank")
    console.log("Contacting seller via Gmail:", item?.userEmail)
  }

  if (loading) return <p className="p-4">Loading...</p>
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>
  if (!item) return <p className="p-4">Item not found</p>

  return (
    <>
      <Navbar />
      <section className="p-6 mt-20">
        <Card className="max-w-5xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left column - Image */}
          <div className="flex justify-center items-start">
            {item.image ? (
              <img
                src={
                  typeof item.image === "string"
                    ? `${process.env.NEXT_PUBLIC_UPLOAD_URL}${item.image}`
                    : item.image
                    ? URL.createObjectURL(item.image)
                    : undefined
                }
                alt={item.name}
                className="w-full max-w-md object-contain rounded-md border"
              />
            ) : (
              <div className="w-full max-w-md h-64 bg-gray-100 flex items-center justify-center rounded-md">
                <span className="text-gray-500">No Image</span>
              </div>
            )}
          </div>

          {/* Right column - Details */}
          <div className="flex flex-col justify-between space-y-6">
            <CardHeader className="p-0 flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl font-bold">
                  {item.name}
                </CardTitle>

                {/* ✅ Price */}
                <p className="text-2xl font-semibold text-white-600 mt-2">
                  PHP{Number(item.price).toLocaleString()}
                </p>

                <CardDescription className="text-base mt-1">
                  Posted by <b>{item.userName || "Unknown"}</b>
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFavorite}
                className="ml-4"
              >
                <Heart
                  className={`w-6 h-6 ${
                    isFavorited ? "fill-red-500 text-red-500" : "text-gray-500"
                  }`}
                />
              </Button>
            </CardHeader>

            <CardContent className="p-0 space-y-4">
              <p className="text-lg">{item.description}</p>
              {item.category && (
                <p>
                  Category: <b>{item.category}</b>
                </p>
              )}
              <p>
                Contact: <b>{item.userEmail || "Unknown"}</b>
              </p>
              <p>
                Location: <b>{item.itemLocation || "Unknown"}</b>
              </p>
              <p className="text-sm text-muted-foreground">
                Posted at:{" "}
                <b>
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      })
                    : "Unknown"}
                </b>
              </p>

              <div className="flex flex-col gap-4 mt-6">
                {!isLoggedIn ? (
                  <Button size="lg" className="w-full" disabled>
                    Login to Contact Seller
                  </Button>
                ) : isOwner ? (
                  <Button size="lg" className="w-full" disabled>
                    You are the seller
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={handleContactSeller}
                  >
                    Contact Seller
                  </Button>
                )}
                {currentUser?.id === item.userId && (
                  <EditItemModal
                    item={item}
                    onUpdated={(updated) =>
                      setItem((prev) => ({
                        ...(prev ?? ({} as Item)),
                        ...updated,
                      }))
                    }
                  />
                )}
              </div>
            </CardContent>
          </div>
        </Card>
      </section>
      <ToastContainer />
    </>
  )
}
