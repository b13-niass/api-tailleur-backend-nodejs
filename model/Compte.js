import mongoose from 'mongoose';
import { Schema } from 'mongoose';

// Compte Schema
const CompteSchema = new Schema({
    email: String,
    password: String,
    etat: String,
    role: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    identifiant: String,
    bio: String,
    credit: Number,
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    comment_ids: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    favorite_ids: [{ type: Schema.Types.ObjectId, ref: 'Favorite' }],
    follower_ids: [{ type: Schema.Types.ObjectId, ref: 'Follow' }],
    report_ids: [{ type: Schema.Types.ObjectId, ref: 'Report' }],
    note_ids: [{ type: Schema.Types.ObjectId, ref: 'Note' }]
});

CompteSchema.statics.signalerCompte = async function(compte_id) {
    try {
        const compte = await this.findByIdAndUpdate(compte_id, { $set: { etat: 'inactive' } }, { new: true });
        return compte;
    } catch (error) {
        console.error(error);
        throw new Error('Erreur lors de la signalation du compte');
    }
};

export default mongoose.model('Compte', CompteSchema);