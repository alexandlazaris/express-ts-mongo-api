import { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError";

export default function errorHandler(
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
) {
    console.error('[ERROR]', (err as any)?.stack ?? err);
    if (err instanceof AppError) {
        return res.status(err.status).json({ error: err.message });
    }

    res.status(500).json({ error: 'Internal server error.' });
}
