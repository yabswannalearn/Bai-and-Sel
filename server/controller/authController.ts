import { Request, Response } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { db } from "../db"
import { users } from "../db/schema"
import { eq } from "drizzle-orm"
import { hash } from "crypto"
import { error } from "console"
import { json } from "stream/consumers"
import { sendEmail } from "../middleware/mailer"
import validator from "validator"

// import 

const JWT_SECRET = process.env.JWT_SECRET || "supersecret"

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please input all fields." });
    }

    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long, include uppercase, lowercase, number, and special character",
      });
    }

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.insert(users).values({
      name,
      email,
      password_hash: hashedPassword,
    });


  } catch (err: any) {
    console.error("Register error:", err);
    return res.status(500).json({ error: err.message });
  }
};


export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    if ( !email || !password) {
      return res.status(400).json({ error: "Please input all fields."})
    }

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


export const contactUs = async (req: Request, res: Response) => {
  try {
    const { email, subject, text } = req.body;

    if (!email || !subject || !text) {
      return res.status(400).json({ error: "Input all fields" });
    }

    await sendEmail(
      process.env.EMAIL!,
      process.env.EMAIL!,
      `Email from ${email}: ${subject}`,
      text
    );

    await sendEmail(
      process.env.EMAIL!,
      email,
      "Thank you for contacting Bai & Sel",
      `We received your message:\n\nSubject: ${subject}\n\n${text}`
    );

    return res.status(200).json({ success: true, message: "Email sent!" });
  } catch (err: any) {
    
    return res.status(500).json({ error: "Something went wrong." });
  }
};

export const authChecker = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(200).json({ loggedIn: false, user: null });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      email: string;
    };

    if (!decoded) {
      return res.status(200).json({ loggedIn: false, user: null });
    }

    return res.status(200).json({
      loggedIn: true,
      user: {
        id: decoded.id,
        email: decoded.email,
      },
    });
  } catch (err: any) {
    return res.status(200).json({ loggedIn: false, user: null });
  }
};