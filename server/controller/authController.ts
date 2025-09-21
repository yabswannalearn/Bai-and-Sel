import { Request, Response } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { db } from "../db"
import { users } from "../db/schema"
import { eq } from "drizzle-orm"
import { hash } from "crypto"
import { error } from "console"
import { json } from "stream/consumers"

const JWT_SECRET = process.env.JWT_SECRET || "supersecret"

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validate inputs
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please input all fields." });
    }

    // 2. Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Email already exists." });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Insert user
    await db.insert(users).values({
      name,
      email,
      password_hash: hashedPassword,
    });

    // 5. Respond success
    return res.status(201).json({ message: "User registered successfully" });

  } catch (err: any) {
    console.error("Register error:", err);
    return res.status(500).json({ error: err.message });
  }
};


export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    const [user] = await db.select().from(users).where(eq(users.email, email))

    if (!user) return res.status(400).json({ error: "User not found" })

    const isMatch = await bcrypt.compare(password, user.password_hash)
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" })

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1d",
    })

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    })

    res.json({ message: "Login successful", token })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
}

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("token")
  res.json({ message: "Logged Out" })
}
