import mongoose from "mongoose";
import { Schema } from "mongoose";

// Favorite Schema
const FavoriteSchema = new Schema({
    createdAt: Date,
    updatedAt: Date,
    compte_id: { type: Schema.Types.ObjectId, ref: 'Compte' },
    post_id: { type: Schema.Types.ObjectId, ref: 'Post' }
});

export default mongoose.model('Favorite', FavoriteSchema)