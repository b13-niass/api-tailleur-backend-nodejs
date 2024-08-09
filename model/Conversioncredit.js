import mongoose from "mongoose";
import {Schema} from "mongoose";

const ConversioncreditSchema = new Schema({
    credit: String,
    prix: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Conversioncredit', ConversioncreditSchema);