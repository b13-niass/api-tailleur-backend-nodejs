import mongoose from "mongoose";
import { Schema } from "mongoose";

// Measure Schema
const MeasureSchema = new Schema({
    Epaule: String,
    Manche: String,
    Longueur: String,
    Poitrine: String,
    Fesse: String,
    Taille: String,
    Cou: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    compte_id: { type: Schema.Types.ObjectId, ref: 'Compte' }
});

export default mongoose.model('Measure', MeasureSchema)