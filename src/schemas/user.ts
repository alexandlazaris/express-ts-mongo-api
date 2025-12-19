import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    role: { type: String, enum: ["admin", "user"], default: "user" }
})

