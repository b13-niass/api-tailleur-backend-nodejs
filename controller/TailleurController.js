import mongoose from 'mongoose';
import Status from '../model/Status.js';
import Post from "../model/Post.js";
import Tailleur from "../model/Tailleur.js";
import Compte from "../model/Compte.js";
import follow from "../model/Follow.js";

class TailleurController {
 
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
                duration: duration ,
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
    async listStatus(req, res) {
/*         return res.json(1);
 */        try {
            const userId = req.id;  // ID de l'utilisateur connecté passé en paramètre
            const now = new Date();
           
            // Récupérer le compte de l'utilisateur connecté
            const account = await Compte.findById(userId).populate('follower_ids').lean();
          
            
            if (!account) {
                return res.status(404).json({ message: 'Compte introuvable', status: 'KO' });
            }
            
/*             console.log(account)
 */
            const userType = account.role;  
            
            // Type d'utilisateur ('client' ou 'tailleur')
            let statuses = [];
/*             console.log(userType);
 */            
/*             console.log('ID extrait de la requête:', req.id || req.body.tailleurId);
 */
            if (userType === 'client') {
                // Si c'est un client, récupérer les statuts des tailleurs qu'il suit
                const tailleursSuivis = account.follower_ids.map(follower => follower._id); // Liste des ID des tailleurs suivis
                statuses = await Status.find({ tailleur_id: { $in: tailleursSuivis } }).populate('tailleur_id').lean();
            } else if (userType === 'tailleur') {
                // Si c'est un tailleur, récupérer les statuts des tailleurs qu'il suit et ses propres statuts
                const tailleursSuivis = account.follower_ids.map(follower => follower._id); // Liste des ID des tailleurs suivis
                statuses = await Status.find({ 
                    $or: [
                        { tailleur_id: { $in: tailleursSuivis } }, // Statuts des tailleurs suivis
                        { tailleur_id: userId } // Ses propres statuts
                    ] 
                }).populate('tailleur_id').lean();
            }

    
            // Filtrer les statuts non expirés
        const activeStatuses = statuses.filter(status => {
            const createdAt = new Date(status.createdAt);
            const durationInSeconds = status.duration * 60; // Durée du statut en secondes
            const differenceInSeconds = (now - createdAt) / 1000; // Conversion des millisecondes en secondes

            // Garder les statuts qui ne sont pas expirés
            return (differenceInSeconds <= durationInSeconds && differenceInSeconds <= 86400); // Moins de 24 heures
        });

        console.log('Statuts actifs:', activeStatuses);

        // Supprimer les statuts expirés
        const statusesToDelete = statuses.filter(status => {
            const createdAt = new Date(status.createdAt);
            const durationInSeconds = status.duration * 60; // Durée du statut en secondes
            const differenceInSeconds = (now - createdAt) / 1000; // Conversion des millisecondes en secondes

            // Supprimer les statuts dont la durée est dépassée
            return (differenceInSeconds > durationInSeconds);
        });
            
            // Log les statuts à supprimer avant la suppression
            console.log('Statuts à supprimer:',statuses, statusesToDelete.map(status => status._id));
    
            if (statusesToDelete.length > 0) {
                const deleteResult = await Status.deleteMany({ _id: { $in: statusesToDelete.map(status => status._id) } });
                // Log le résultat de la suppression
                console.log('Résultat de la suppression:', deleteResult);
            }
    
            return res.status(200).json({ statuses: activeStatuses, status: 'OK' });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 'KO' });
        }
    }
    
    
async createPost(req, res) {
    try{
            const idTailleur = req.id;

            // Valider les champs
            const { content, title, image } = req.body;

            if (!content || typeof content !== 'string') {
                return res.status(400).json({ message: "Content must be a non-empty string", status: 'KO' });
            }

            if (!title || typeof title !== 'string') {
                return res.status(400).json({ message: "Title must be a non-empty string", status: 'KO' });
            }

            if (!image || !Array.isArray(image) || image.length === 0) {
                return res.status(400).json({ message: "Image must be a non-empty array", status: 'KO' });
            }

            const validCategories = ['video', 'image'];
            if (!image.every(item => validCategories.includes(item))) {
                return res.status(400).json({ message: "Image array must only contain 'video' or 'image'", status: 'KO' });
            }

            // Créer le post
            const newPost = new Post({
                content,
                title,
                image,
                createdAt: new Date(),
                updatedAt: new Date(),
                shareNb: 0,
                viewsNb: 0,
                author_id: idTailleur
            });

            await newPost.save();

            // Récupérer le tailleur et ajouter le post à sa liste de posts
            const tailleur = await Tailleur.findOne({ compte_id: idTailleur });
            if (!tailleur) {
                return res.status(404).json({ message: "Tailleur not found", status: 'KO' });
            }

            tailleur.post_ids.push(newPost._id);
            await tailleur.save();

            res.status(201).json({ message: "Post created successfully", status: 'OK', post: newPost });
        } catch (err) {
            return res.status(500).json({message: err.message, status: 'oooKO'});
        }
    }

  
    async updatePost(req, res) {
        try {
            const { postId } = req.params;
            const { content, title, image } = req.body;
            const idTailleur = req.id;

            // Vérifier si le post existe et appartient au tailleur
            const post = await Post.findOne({ _id: postId, author_id: idTailleur });
            if (!post) {
                return res.status(404).json({ message: "Post not found or you don't have permission to edit it", status: 'KO' });
            }

            // Mettre à jour les champs
            if (content) post.content = content;
            if (title) post.title = title;
            if (image) post.image = image;
            post.updatedAt = new Date();

            await post.save();

            res.status(200).json({ message: "Post updated successfully", status: 'OK', post });
        } catch (err) {
            return res.status(500).json({message: err.message, status: 'KO'});
        }
    }

    async deletePost(req, res) {
        try {
            const { postId } = req.params;
            const idTailleur = req.id;

            // Vérifier si le post existe et appartient au tailleur
            const post = await Post.findOne({ _id: postId, author_id: idTailleur });
            if (!post) {
                return res.status(404).json({ message: "Post not found or you don't have permission to delete it", status: 'KO' });
            }

            // Supprimer le post
            await Post.deleteOne({ _id: postId });

            // Retirer l'ID du post de la liste des posts du tailleur
            await Tailleur.updateOne(
                { compte_id: idTailleur },
                { $pull: { post_ids: postId } }
            );

            res.status(200).json({ message: "Post deleted successfully", status: 'OK' });
        } catch (err) {
            return res.status(500).json({message: err.message, status: 'KO'});
        }
    }
}

export default new TailleurController();
