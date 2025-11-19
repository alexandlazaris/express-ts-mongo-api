import { Router, Request, Response, NextFunction } from 'express';
import requireAdmin from '../middleware/requireAdmin';
import asyncHandler from '../utils/asyncHandler';
import AppError from '../utils/appError';
import { body } from 'express-validator';
import validate from '../middleware/validate';
import requireAuth from '../middleware/auth';
import jwt from 'jsonwebtoken';

const router = Router();
const SECRET = process.env.JWT_SECRET ?? 'dev_secret';

let users = [
    {
        id: 1, name: 'Tom'
    },
    {
        id: 2, name: 'Blake'
    },
    {
        id: 3, name: 'Admin'
    }
];

router.use((req, _res, next) => {
    console.log(`[USERS] ${req.method} ${req.url}`);
    next();
})

router.get('/', (_req: Request, res: Response) => {
    res.json(users);
})

router.post('/', (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body;
    if (!name) return next(new AppError('name is required', 400));
    const newUser = { id: users.length + 1, name };
    users.push(newUser);
    res.status(201).json(newUser);
})

router.put('/:id', requireAdmin, (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    const user = users.find(u => u.id === id);
    if (!user) return next(new AppError('id is not found', 404));
    user.name = req.body.name;
    res.json(user)
})


router.post('/login', [body('name').isString().notEmpty()], validate, asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body;
    const user = users.find(u => u.name === name);
    if (!user) return next(new AppError('User not found', 404));
    const token = jwt.sign({ id: user.id, name: user.name }, SECRET, { expiresIn: '1h' });
    res.json({ token })
}));


router.get('/me', requireAuth, (req: Request, res: Response) => {
    res.json({ user: (req as any).user });
})

router.get('/async-error', asyncHandler(async () => {
    throw new AppError(`Simulated async failure`, 502);
}))

export default router;