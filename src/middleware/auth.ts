import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import AppError from "../utils/appError";
import mongoose from "mongoose";
import { userSchema } from "../schemas/user";

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev_secret';
let token: string = "";

export default function requireAuth(req: Request, _res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new AppError('Authorization required', 401));
    }

    token = authHeader.split(' ')[1]!;

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        (req as any).user = payload;
        next();
    }
    catch {
        next(new AppError('Invalid or expired token', 401));
    }
}


export interface AuthRequest extends Request {
    user?: any;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json({ message: "missing auth token" });
    
    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "invalid token format" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as {role: string, email: string};
        (req as any).user = decoded;
        next();
    } catch (err) {
        res.status(403).json({ message: "invalid or expired token" });
    }
}

// TODO: create a roles table, and have each user assign a role id, upon user registration
// const User = mongoose.model("RBACUser", userSchema);

export function requireRole(role: string) {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;
        if (user?.role !== role) {
            return res.status(403).json({ error: "route is forbidden" });
        }
        next();
    }
}