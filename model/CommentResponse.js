import mongoose from "mongoose";
import { Schema } from "mongoose";

// CommentResponse Schema
const CommentResponseSchema = new Schema({
    texte: String,
    createdAt: Date,
    updatedAt: Date,
    comment_id: { type: Schema.Types.ObjectId, ref: 'Comment' },
    compte_id: { type: Schema.Types.ObjectId, ref: 'Compte'},
});

export default mongoose.model('CommentResponse', CommentResponseSchema)