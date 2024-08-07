import mongoose from "mongoose";
import { Schema } from "mongoose";

// CommentResponse Schema
const CommentResponseSchema = new Schema({
    texte: String,
    createdAt: Date,
    updatedAt: Date,
    comment_id: { type: Schema.Types.ObjectId, ref: 'Comment' }
});

export default mongoose.model('CommentResponse', CommentResponseSchema)