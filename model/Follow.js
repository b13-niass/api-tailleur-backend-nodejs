import mongoose from "mongoose";
import { Schema } from "mongoose";

const StatusEnum = ['follow', 'unfollow'];

// FollowClient Schema
const FollowSchema = new Schema({
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    followed_id: { type: Schema.Types.ObjectId, ref: 'Compte' },
    follower_id: { type: Schema.Types.ObjectId, ref: 'Compte' },
    status: { type: String, enum: StatusEnum }
});

export default mongoose.model('Follow', FollowSchema)