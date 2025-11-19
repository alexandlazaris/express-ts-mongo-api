import { Request, Response, NextFunction } from 'express';

export default function requireAdmin(req: Request, res:Response, next: NextFunction) {
    if (req.headers['x-admin'] === '1') {
        next();
    }
    else{
        res.status(403).json({error: 'Admin access required'});
    }
}