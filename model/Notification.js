import mongoose from "mongoose";
import { Schema } from "mongoose";

// Notification Schema
const NotificationSchema = new Schema({
    content: String,
    createdAt: Date,
    updatedAt: Date,
    post_id: { type: Schema.Types.ObjectId, ref: 'Post' }
});

export default mongoose.model('Notification', NotificationSchema)