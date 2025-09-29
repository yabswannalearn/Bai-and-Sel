// routes/items.ts (Express example)
import express, { Request, Response } from "express"
import { db } from "../db"
import { items } from "../db/schema"
import { eq, and, or, ilike, sql, desc} from "drizzle-orm"
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
        category: items.category,
        price: items.price
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
        category: items.category,
        price: items.price
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
    const { name, description, category, price } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const [newItem] = await db
      .insert(items)
      .values({
        name,
        description,
        category,
        userId: Number(req.user.id),
        image: imagePath,
        price,
      })
      .returning({
        id: items.id,
        name: items.name,
        description: items.description,
        image: items.image,
        userId: items.userId,
        createdAt: items.createdAt,
        category: items.category,
      });

    return res.status(201).json({
      message: "Item created successfully",
      item: newItem,
    });
  } catch (err: any) {
    console.error("❌ Post item error:", err);
    res.status(500).json({ error: err.message });
  }
};


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

    console.log("req.body:", req.body)
    console.log("req.file:", req.file)

    const { id } = req.params
    const { name, description, category, price} = req.body
    const image = req.file ? `/uploads/${req.file.filename}` : undefined

    if (!req.user) return res.status(401).json({ message: "Unauthorized" })

    const updated = await db
      .update(items)
      .set({
        ...(name && { name }),
        ...(description && { description }),
        ...(category && { category }),
        ...(image && { image }),
        ...(price && { price }),
      })
      .where(and(eq(items.id, Number(id)), eq(items.userId, Number(req.user.id))))
      .returning()

    if (updated.length === 0) return res.status(404).json({ message: "Item not found" })

    const refreshed = await db
      .select({
        id: items.id,
        name: items.name,
        description: items.description,
        category: items.category,
        price: items.price,
        image: items.image,
        userId: items.userId,
        createdAt: items.createdAt,
        userName: users.name,
        userEmail: users.email,
      })
      .from(items)
      .innerJoin(users, eq(users.id, items.userId))
      .where(eq(items.id, Number(id)))
      .limit(1)

    res.json({ message: "Item updated successfully", item: refreshed[0] })
    
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
}

export const filterItems = async (req: Request, res: Response) => {
  try {
    const { search, category, minPrice, maxPrice } = req.query;

    let conditions = [];

    if (search) {
      conditions.push(
        or(
          ilike(items.name, `%${search}%`),
          ilike(items.description, `%${search}%`)
        )
      );
    }

    if (category) {
      conditions.push(eq(items.category, category as string));
    }

    if (minPrice) {
      conditions.push(sql`${items.price} >= ${Number(minPrice)}`);
    }

    if (maxPrice) {
      conditions.push(sql`${items.price} <= ${Number(maxPrice)}`);
    }

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
        category: items.category,
        price: items.price,
      })
      .from(items)
      .leftJoin(users, eq(items.userId, users.id))
      .where(
        conditions.length > 0 ? and(...conditions) : undefined
      );

    const results = await query;
    res.json(results);
  } catch (err: any) {
    console.error("❌ Filter error:", err);
    res.status(500).json({ error: err.message });
  }
};
