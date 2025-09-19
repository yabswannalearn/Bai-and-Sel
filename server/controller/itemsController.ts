// routes/items.ts (Express example)
import express, { Request, Response } from "express";
import { db } from "../db"
import { items } from "../db/schema"
import { eq } from "drizzle-orm"

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

export const postItems = async (req: Request, res: Response) => {
  try {
    const { name, description} = req.body
    await db.insert(items).values({ name, description});
    res.status(201).json({ message: "Item created successfully"})
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
}
