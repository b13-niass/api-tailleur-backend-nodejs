import mongoose from "mongoose";
import {Schema} from "mongoose";

const CommandeSchema = new Schema({
    tissupost_id:{ type: mongoose.Schema.Types.ObjectId, ref: 'TissuPost' },
    client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Compte' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Commande', CommandeSchema);