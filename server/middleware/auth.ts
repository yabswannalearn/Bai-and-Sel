import { error } from "console";
import { NextFunction, Request, Response } from "express";
import { request } from "http";
import  jwt from "jsonwebtoken";
import { verify } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret"

export interface AuthRequest extends Request {
    user? : {id: number, email: string}
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.cookies?.token

    if (!token) return res.status(401).json({ error: "No token, Unauthorized "})

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number, email: string};
    
        req.user = { id: Number(decoded.id), email: decoded.email };
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid Token"})
    }
}