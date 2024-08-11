import mongoose from "mongoose";
import {Schema} from "mongoose";

const PaiementSchema = new Schema({
    commande_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Commande' },
    montant: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Paiement', PaiementSchema);