import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import AppError from "../utils/appError";

const SECRET = process.env.JWT_SECRET ?? 'dev_secret';
let token: string = "";

export default function requireAuth(req: Request, _res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new AppError('Authorization required', 401));
    }

    token = authHeader.split(' ')[1]!;

    try {
        const payload = jwt.verify(token, SECRET);
        (req as any).user = payload;
        next();
    }
    catch {
        next(new AppError('Invalid or expired token', 401));
    }
}