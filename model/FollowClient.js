import mongoose from "mongoose";
import { Schema } from "mongoose";

const StatusEnum = ['follow', 'unfollow'];

// FollowClient Schema
const FollowClientSchema = new Schema({
    createdAt: Date,
    updatedAt: Date,
    client_id: { type: Schema.Types.ObjectId, ref: 'Client' },
    compte_id: { type: Schema.Types.ObjectId, ref: 'Compte' },
    status: { type: String, enum: StatusEnum }
});

export default mongoose.model('FollowClient', FollowClientSchema)