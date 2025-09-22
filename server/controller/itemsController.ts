// routes/items.ts (Express example)
import express, { Request, Response } from "express";
import { db } from "../db"
import { items } from "../db/schema"
import { eq, and } from "drizzle-orm"
import { AuthRequest } from "../middleware/auth";
import { users } from "../db/schema";

const router = express.Router()

export const getItems = async (req: Request, res: Response) => {
  try {
    const allItems = await db
      .select({
        id: items.id,
        name: items.name,
        description: items.description,
        userId: items.userId,
        createdAt: items.createdAt,
        userName: users.name, // 👈 include username
      })
      .from(items)
      .leftJoin(users, eq(items.userId, users.id));

    console.log("✅ Items with users:", allItems); // debug log
    res.json(allItems);
  } catch (err: any) {
    console.error("error", err);
    res.status(500).json({ error: err.message });
  }
};

export const postItems = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description} = req.body
    
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized "})
    }

    console.log("req.user in postItems:", req.user); 

    await db.insert(items).values({ name, description, userId: Number(req.user.id)});

    res.status(201).json({ message: "Item created successfully"})

  } catch (err: any) {
    console.error("❌ Post item error:", err);
    res.status(500).json({ error: err.message })
  }
}

export const deleteItems = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized"})
    }

    const deleted = await db
      .delete(items)
      .where(
        and(
          eq(items.id, Number(id)),
          eq(items.userId, Number(req.user.id))
        )
      )
      .returning();
    if (deleted.length === 0) {
      return res.status(404).json({ message: "Item not found"})
    }

    res.json({ message: "Item deleted succesfully"})
  } catch (err: any) {
    res.status(500).json({ error: err.message})
  }
}

export const updateItems = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const { name, description } = req.body

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized "})
    }

    const updated = await db
      .update(items)
      .set({
        ...(name && { name }),
        ...(description && { description }),
      })
      .where(
        and(
          eq(items.id, Number(id)),
          eq(items.userId, Number(req.user.id))
        )
      )
      .returning()

      if ( updated.length === 0) {
        return res.status(404).json({ message: "Item not found"})
      }

      res.json({ message: "Item updated successfully", item: updated[0]})
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
}