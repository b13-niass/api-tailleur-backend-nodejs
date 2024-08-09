import mongoose from "mongoose";
import {Schema} from "mongoose";

const BloquerSchema = new Schema({
    blocked_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Compte' },
    blocker_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Compte' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Bloquer', BloquerSchema);