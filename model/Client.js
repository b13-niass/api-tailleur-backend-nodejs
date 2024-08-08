import mongoose from "mongoose";
import { Schema } from "mongoose";

// Client Schema
const ClientSchema = new Schema({
    compte_id: { type: Schema.Types.ObjectId, ref: 'Compte' },
    measure_ids: [{ type: Schema.Types.ObjectId, ref: 'Measure' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Client', ClientSchema)