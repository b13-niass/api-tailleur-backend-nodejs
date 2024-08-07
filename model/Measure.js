import mongoose from "mongoose";
import { Schema } from "mongoose";

// Measure Schema
const MeasureSchema = new Schema({
    texte: String,
    createdAt: Date,
    updatedAt: Date,
    compte_id: { type: Schema.Types.ObjectId, ref: 'Compte' }
});

export default mongoose.model('Measure', MeasureSchema)