import { Router, Request, Response, NextFunction } from 'express';
import requireAdmin from '../middleware/requireAdmin';
import asyncHandler from '../utils/asyncHandler';
import AppError from '../utils/appError';
import { body } from 'express-validator';
import validate from '../middleware/validate';
import requireAuth from '../middleware/auth';
import jwt from 'jsonwebtoken';
import { User } from '../models/Users';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const router = Router();
const SECRET = process.env.JWT_SECRET ?? 'dev_secret';

router.use((req, _res, next) => {
    console.log(`[USERS] ${req.method} ${req.url}`);
    next();
})

router.get('/', asyncHandler(async (_req: Request, res: Response) => {
    const users = await User.find();
    res.json(users);
}))

router.post('/', [body('name').isString().notEmpty(), body('email').isEmail()],
    validate, asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { name, email } = req.body;
        const existing = await User.findOne({ email });
        if (existing) return next(new AppError('User already exists', 409));

        const newUser = await User.create({ name, email });
        res.status(201).json(newUser);
    })
);


router.put('/:id', requireAdmin, asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedUser) return next(new AppError('User not found', 404));
        res.json(updatedUser);

    } catch (err: any) {
        if (err instanceof mongoose.Error.ValidationError) {
            const details = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({ error: 'validation failed', details });
        }
        next(err);
    }
})
);

router.post('/register', [body('email').isEmail(), body('password').isStrongPassword()], validate, asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body;
        const existing = await User.find({ email: email });
        if (existing.length >= 1) return next(new AppError('User not found', 404));
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name: name, email: email, password: hashedPassword });
        res.status(201).json({ message: "User registered successfully,", "id": newUser._id });
    } catch (err) {
        // res.status(500).json({ message: "Error registering user" });
        return next(new AppError('Error registering user', 500));
    }

}));

router.post(
    '/login',
    [body('email').isEmail()],
    validate,
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) return next(new AppError('Username and password are required', 400));

            const user = await User.findOne({ email });
            if (!user) return next(new AppError('User not found', 404));
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return next(new AppError('Invalid credentials', 401));
            const token = jwt.sign({ id: user._id, name: user.name, email: user.email }, SECRET, { expiresIn: '1h' });
            res.json({ token });
        }
        catch (err) {
            // res.status(500).json({ message: "Error during login" });
            return next(new AppError('Error during login', 500));
        }

    }));


router.get('/me', requireAuth, (req: Request, res: Response) => {
    res.json({ user: (req as any).user });
})

router.get('/async-error', asyncHandler(async () => {
    throw new AppError(`Simulated async failure`, 502);
}))

export default router;