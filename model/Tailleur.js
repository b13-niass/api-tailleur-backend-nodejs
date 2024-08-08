import mongoose from "mongoose";
import { Schema } from "mongoose";

// Tailleur Schema
const TailleurSchema = new Schema({
    compte_id: { type: Schema.Types.ObjectId, ref: 'Compte' },
    status_ids: [{ type: Schema.Types.ObjectId, ref: 'Status' }],
    post_ids: [{ type: Schema.Types.ObjectId, ref: 'Post' }]
});

export default mongoose.model('Tailleur', TailleurSchema)



