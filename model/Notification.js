import mongoose from "mongoose";
import { Schema } from "mongoose";

// Notification Schema
const NotificationSchema = new Schema({
    content: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    post_id: { type: Schema.Types.ObjectId, ref: 'Post' },
    compte_id: { type: Schema.Types.ObjectId, ref: 'Compte'}
});

export default mongoose.model('Notification', NotificationSchema)