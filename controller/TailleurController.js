import Status from '/home/aissata/Nodejs_Project/Tailor_Project/projet-tailleur-backend/model/Status.js';
import mongoose from 'mongoose';

class TailleurController {
    // Liste tous les statuts d'un tailleur spécifique
    async listMyAllPosts(req, res) {
        try {
            const { tailleurId } = req.params; // Suppose que l'ID du tailleur est passé en paramètre

            // Assurez-vous que l'ID est valide
            if (!mongoose.Types.ObjectId.isValid(tailleurId)) {
                return res.status(400).json({ message: 'ID de tailleur invalide', status: 'KO' });
            }

            // Rechercher les statuts associés à ce tailleur
            const statuses = await Status.find({ tailleur_id: tailleurId });

            if (statuses.length === 0) {
                return res.status(404).json({ message: 'Aucun statut trouvé', status: 'KO' });
            }

            res.status(200).json({ statuses, status: 'OK' });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 'KO' });
        }
    }

    // Créer un nouveau statut
    async createStatus(req, res) {
        try {
            const tailleurId = req.id;

            const { files, description, duration, viewsNB, categories } = req.body;

            // Vérifiez si l'ID est valide
            if (!mongoose.Types.ObjectId.isValid(tailleurId)) {
                
                return res.status(400).json({ message: 'ID de tailleur invalide', status: 'KO' });
            }
            // return res.json(files);
            const newStatus = new Status({
                files: files || 'example.mp4',
                description: description || 'Model du jour',
                duration: duration || 120,
                viewsNB: viewsNB || 1000,
                categories: categories || 'video',
                tailleur_id: tailleurId
            });

            // Sauvegarder le nouveau statut dans la base de données
            const savedStatus = await newStatus.save();
            res.status(201).json({ message: 'Statut créé', status: savedStatus });
        } catch (error) {
            console.error('Erreur lors de la création du statut:', error);
            res.status(500).json({ message: error.message, status: 'KO' });
        }
    }
}

export default new TailleurController();
