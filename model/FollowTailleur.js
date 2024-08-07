import mongoose from "mongoose";
import { Schema } from "mongoose";

// FollowTailleur Schema
const FollowTailleurSchema = new Schema({
    createdAt: Date,
    updatedAt: Date,
    tailleur_id: { type: Schema.Types.ObjectId, ref: 'Tailleur' },
    compte_id: { type: Schema.Types.ObjectId, ref: 'Compte' },
});

export default mongoose.model('FollowTailleur', FollowTailleurSchema)