import mongoose from "mongoose";
import {Schema} from "mongoose";

const UniteType = ['m', 'yard'];
const TissuSchema = new Schema({
    libelle: String,
    unite: { type: String, enum: UniteType },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Tissu', TissuSchema);