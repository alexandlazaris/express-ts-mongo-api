import { Schema, model } from 'mongoose';

export interface IUser {
    name: string;
    email: string;
    age?: number;
    password: string;
    role?: 'user' | 'admin';
    createdAt?: Date;
}

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: [true, 'Name is required'],
        minLength: [2, 'Name must be at least 2 characters'],
        maxLength: [50, 'Name must not be > 50 characters'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, 'Email is invalid']
    },
    password: {
        type: String,
        required: [true, 'A password is required'],
        unique: true
    }
}, { timestamps: true });

export const User = model<IUser>('User', userSchema);