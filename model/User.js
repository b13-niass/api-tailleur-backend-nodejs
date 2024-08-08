import mongoose from "mongoose";
import { Schema } from "mongoose";

// User Schema
const UserSchema = new Schema({
    lastname: String,
    firstname: String,
    phone: String,
    city: String,
    picture: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('users', UserSchema);