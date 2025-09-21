// routes/items.ts (Express example)
import express, { Request, Response } from "express";
import { db } from "../db"
import { items } from "../db/schema"
import { eq } from "drizzle-orm"
import { AuthRequest } from "../middleware/auth";

const router = express.Router()

export const getItems = async (req: Request, res: Response) => {
  try {
    const allItems = await db.select().from(items)
    res.json(allItems)
  } catch (err: any) {
    console.error("error", err)
    res.status(500).json({ error: err.message })
  }
}

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
