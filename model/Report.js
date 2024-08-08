import mongoose from 'mongoose';
const { Schema } = mongoose;

// Définir le schéma Report
const ReportSchema = new Schema({
    motif: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    compte_id: { type: Schema.Types.ObjectId, ref: 'Compte', required: true },
    reporter_id: { type: Schema.Types.ObjectId, ref: 'Compte', required: true }
});

// Méthode statique pour créer un rapport
ReportSchema.statics.ReportCompte = async function(compteId, motif, reporterId) {
    try {
        // Valider les identifiants
        if (!mongoose.Types.ObjectId.isValid(compteId) || !mongoose.Types.ObjectId.isValid(reporterId)) {
            throw new Error('Identifiant invalide');
        }

        // Créer un nouveau rapport
        const nouveauRapport = new this({
            compte_id: compteId,
            reporter_id: reporterId,
            motif: motif
        });

        // Sauvegarder le rapport
        await nouveauRapport.save();

        return nouveauRapport;
    } catch (error) {
        throw new Error(error.message);
    }
};

export default mongoose.model('Report', ReportSchema);
