import mongoose from "mongoose";
import {Schema} from "mongoose";

const TissuPostSchema = new Schema({
    prixMetre: Number,
    nombreMetre: Number,
    post_id:{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    tissu_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Tissu' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('tissuPosts', TissuPostSchema);