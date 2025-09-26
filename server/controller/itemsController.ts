// routes/items.ts (Express example)
import express, { Request, Response } from "express"
import { db } from "../db"
import { items } from "../db/schema"
import { eq, and, or, ilike} from "drizzle-orm"
import { AuthRequest } from "../middleware/auth"
import { users } from "../db/schema"
import { error } from "console"

const router = express.Router()

interface MulterRequest extends Request {
  file?: Express.Multer.File
}


export const getItems = async (req: Request, res: Response) => {
  try {
    const search = req.query.search as string | undefined;

    const query = db
      .select({
        id: items.id,
        name: items.name,
        description: items.description,
        image: items.image,
        userId: items.userId,
        createdAt: items.createdAt,
        userName: users.name,
        userEmail: users.email,
      })
      .from(items)
      .leftJoin(users, eq(items.userId, users.id))
      .where(
        search
          ? or(
              ilike(items.name, `%${search}%`),
              ilike(items.description, `%${search}%`)
            )
          : undefined // 👈 if no search, return all
      );

    const results = await query;
    res.json(results);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getItemById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const query = db
      .select({
        id: items.id,
        name: items.name,
        description: items.description,
        image: items.image,
        userId: items.userId,
        createdAt: items.createdAt,
        userName: users.name,
        userEmail: users.email,
      })
      .from(items)
      .leftJoin(users, eq(items.userId, users.id))
      .where(eq(items.id, Number(id)));

    const result = await query;

    if (result.length === 0) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json(result[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const postItems = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const [newItem] = await db
      .insert(items)
      .values({
        name,
        description,
        userId: Number(req.user.id),
        image: imagePath,
      })
      .returning({
        id: items.id,
        name: items.name,
        description: items.description,
        image: items.image,
        userId: items.userId,
        createdAt: items.createdAt,
      })

    return res.status(201).json({
      message: "Item created successfully",
      item: newItem,
    })
  } catch (err: any) {
    console.error("❌ Post item error:", err)
    res.status(500).json({ error: err.message })
  }
}

export const deleteItems = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const deleted = await db
      .delete(items)
      .where(
        and(eq(items.id, Number(id)), eq(items.userId, Number(req.user.id)))
      )
      .returning()
    if (deleted.length === 0) {
      return res.status(404).json({ message: "Item not found" })
    }

    res.json({ message: "Item deleted succesfully" })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
}

export const updateItems = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const { name, description } = req.body

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized " })
    }

    const updated = await db
      .update(items)
      .set({
        ...(name && { name }),
        ...(description && { description }),
      })
      .where(
        and(eq(items.id, Number(id)), eq(items.userId, Number(req.user.id)))
      )
      .returning()

    if (updated.length === 0) {
      return res.status(404).json({ message: "Item not found" })
    }

    res.json({ message: "Item updated successfully", item: updated[0] })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
}
