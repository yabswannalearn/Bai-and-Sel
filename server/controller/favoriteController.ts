import express, { Request, Response } from "express"
import { db } from "../db"
import { favorites, items } from "../db/schema"
import { eq, and, or, ilike, desc } from "drizzle-orm"
import { AuthRequest } from "../middleware/auth"
import { users } from "../db/schema"
import { error } from "console"

const router = express.Router()

export const postFavorites = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id
    const { itemId } = req.body

    if (!userId) return res.status(401).json({ error: "Unauthorized" })
    if (!itemId) return res.status(400).json({ error: "Item ID required" })

    await db.insert(favorites).values({
      userId: Number(userId),
      itemId: Number(itemId),
    })

    res.json({ message: "Item added to favorites" })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
}

export const deleteFavorites = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id
    const { itemId } = req.body

    if (!userId) return res.status(401).json({ error: "Unauthorized" })

    await db
      .delete(favorites)
      .where(
        and(eq(favorites.userId, userId), eq(favorites.itemId, Number(itemId)))
      )

    res.json({ message: "Item removed from favorites " })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
}

export const getFavorites = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ error: "Unauthorized" })

    const favitems = await db
      .select({
        id: items.id,
        name: items.name,
        description: items.description,
        image: items.image,
        createdAt: items.createdAt,
        userName: users.name,
      })
      .from(favorites)
      .leftJoin(items, eq(favorites.itemId, items.id))
      .leftJoin(users, eq(items.userId, users.id))
      .where(eq(favorites.userId, userId))

    res.json(favitems)
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
}
