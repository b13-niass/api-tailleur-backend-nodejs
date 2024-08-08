import mongoose from "mongoose";
import Favorite from '../model/Favorite.js';
import User from "../model/User.js"; // Ensure the User model is imported
import Compte from "../model/Compte.js";


class ClientController {
    async getAllFavorites(req, res) {
        try {
            const id = req.id;
            console.log("ok");
            // const id = "66b38c03f583892b04f8e6a8";
            console.log('ID utilisateur:', id);

            // Validate ID'
            if (!id || !mongoose.Types.ObjectId.isValid(id)) {

                return res.status(400).json({ message: 'ID utilisateur invalide' });
            }
            // return res.json(id);            

            // Find the user by ID
            const user = await Compte.findById(id);
            if (!user) {
                return res.status(404).json({ message: 'Utilisateur non trouvé' });
            }

            // Find all favorites of the user
            const favorites = await Favorite.find({ compte_id: user._id });;
            return res.json(favorites);
        } catch (error) {
            return res.status(500).json({ message: 'Erreur lors de la récupération des favoris', status: 'KO', error: error.message });
        }
    }

    async addFavorite(req, res) {
        try {
            const userId = req.id; // Utiliser req.id défini par le middleware
            const { post_id } = req.body;

            // Valider userId et post_id
            if (!userId || !mongoose.Types.ObjectId.isValid(userId) || !post_id || !mongoose.Types.ObjectId.isValid(post_id)) {
                return res.status(400).json({ message: 'ID utilisateur ou ID du post invalide' });
            }

            // Trouver l'utilisateur par ID
            const user = await Compte.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'Utilisateur non trouvé' });
            }

            // Ajouter le favori
            const favorite = await Favorite.addFavorite(user._id, post_id);
            return res.status(201).json(favorite);
        } catch (error) {
            return res.status(500).json({ message: 'Erreur lors de l\'ajout du favori', status: 'KO', error: error.message });
        }
    }

    async deleteFavorite(req, res) {
        try {
            const { compte_id, favorite_id } = req.body;

            // Valider compte_id et favorite_id
            if (!compte_id || !mongoose.Types.ObjectId.isValid(compte_id) || !favorite_id || !mongoose.Types.ObjectId.isValid(favorite_id)) {
                return res.status(400).json({ message: 'ID du compte ou ID du favori invalide' });
            }

            // Trouver le favori par ID et le compte associé
            const result = await Favorite.deleteFavorite(compte_id, favorite_id);
            if (result.deletedCount === 0) {
                return res.status(404).json({ message: 'Favori non trouvé ou déjà supprimé' });
            }

            return res.status(200).json({ message: 'Favori supprimé avec succès' });
        } catch (error) {
            return res.status(500).json({ message: 'Erreur lors de la suppression du favori', status: 'KO', error: error.message });
        }
    }




    // Fonction pour signaler un compte
    async signaler(req, res) {
        try {
            const { id } = req.body; // Utiliser req.body pour récupérer l'ID

            // Valider l'ID
            if (!id || !mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: 'ID utilisateur invalide' });
            }

            // Signaler le compte
            const compte = await Compte.signalerCompte(id);

            if (!compte) {
                return res.status(404).json({ message: 'Compte non trouvé' });
            }

            return res.status(200).json({ message: 'Compte signalé avec succès' });
        } catch (error) {
            return res.status(500).json({ message: 'Erreur lors du signalage du compte', status: 'KO', error: error.message });
        }
    }

}

export default new ClientController();
