import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/Users';
import AppError from '../utils/appError';

export const registerUser = async (
    req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { name, email, password } = req.body;
        const existing = await User.find({ email: email });
        if (existing.length >= 1) return next(new AppError('User not found', 404));
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name: name, email: email, password: hashedPassword });
        res.status(201).json({ message: "User registered successfully", "id": newUser._id });
    } catch (err) {
        return next(new AppError('Error registering user', 500));
    }
};