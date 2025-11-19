import { Request, Response, NextFunction } from 'express';

export default function logger(req: Request, _res:Response, next: NextFunction) {
    console.log(`[LOG] ${req.method} ${req.url}`);
    next();
}