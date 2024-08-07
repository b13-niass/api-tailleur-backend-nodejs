import mongoose from "mongoose";
import { Schema } from "mongoose";

// Comment Schema
const CommentSchema = new Schema({
    content: String,
    createdAt: Date,
    updatedAt: Date,
    post_id: { type: Schema.Types.ObjectId, ref: 'Post' },
    commentResponse_ids: [{ type: Schema.Types.ObjectId, ref: 'CommentResponse' }]
});

export default mongoose.model('Comment', CommentSchema)