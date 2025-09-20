import { error } from "console";
import { NextFunction, Request, Response } from "express";
import  jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret"

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.token
    if (!token) return res.status(401).json({ error: "Unauthorized "})

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number, email: string};
        (req as any).user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid Token"})
    }
}