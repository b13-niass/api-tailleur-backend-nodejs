import Compte from '../model/Compte.js';
import Client from '../model/Client.js';
import Tailleur from '../model/Tailleur.js';
import User from '../model/User.js';
import Post from '../model/Post.js';
import FollowClient from '../model/FollowClient.js';

class ClientController {
    async showClientProfile(req, res) {
        try {
            const idUser = req.id;
            console.log("User ID: ", idUser);

            // Trouver le compte par ID
            const compte = await Compte.findById(idUser).exec();
            if (!compte) {
                return res.status(404).json({ message: 'Compte not found', status: 'KO' });
            }
            console.log("Compte trouvé: ", compte);

            // Récupérer le user_id depuis le compte
            const userId = compte.user_id;
            if (!userId) {
                return res.status(404).json({ message: 'User ID not found in compte', status: 'KO' });
            }

            // Trouver les informations de l'utilisateur en utilisant user_id
            const user = await User.findById(userId).exec();
            if (!user) {
                return res.status(404).json({ message: 'User not found', status: 'KO' });
            }
            console.log("Utilisateur trouvé: ", user);

            let posts = [];

            if (compte.role === 'tailleur') {
                const tailleur = await Tailleur.findOne({ compte_id: compte._id }).exec();
                if (tailleur) {
                    posts = await Post.find({ _id: { $in: tailleur.post_ids } }).exec();
                } else {
                    throw new Error('Tailleur not found');
                }
            } else if (compte.role === 'client') {
                const client = await Client.findOne({ compte_id: compte._id }).exec();
                if (client && client.followClient_ids.length > 0) {
                    const followClients = await FollowClient.find({ client_id: client._id }).exec();
                    const followedClientIds = followClients.map(follow => follow.followed_client_id);
            
                    const tailleurs = await Tailleur.find({ compte_id: { $in: followedClientIds } }).exec();
                    const tailleurIds = tailleurs.map(tailleur => tailleur._id);
            
                    posts = await Post.find({ author_id: { $in: tailleurIds } }).exec();
                }
            } else {
                throw new Error('Unknown role');
            }
            
            // Répondre avec les données trouvées
            res.status(200).json({
                compte,
                user,
                posts,
                role: compte.role
            });
        } catch (error) {
            console.error('Error fetching client profile:', error);
            res.status(500).json({ message: 'Internal server error', status: 'KO' });
        }
    }
}

export default new ClientController();
