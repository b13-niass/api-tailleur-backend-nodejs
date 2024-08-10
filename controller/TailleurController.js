import mongoose from 'mongoose';
import Status from '../model/Status.js';
import Post from "../model/Post.js";
import Tailleur from "../model/Tailleur.js";
import Compte from "../model/Compte.js";
import follow from "../model/Follow.js";

class TailleurController {
 
/*     async listMyAllPosts(req, res) {
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
    } */
    
    async listMyAllPosts(req, res) {
        try {
            const { tailleurId } = req.params; // ID de l'utilisateur connecté (qu'il soit tailleur ou client)
            // Assurez-vous que l'ID est valide
            if (!mongoose.Types.ObjectId.isValid(tailleurId)) {
                return res.status(400).json({ message: 'ID invalide', status: 'KO' });
            }
    
            // Récupérer le compte de l'utilisateur connecté
            const account = await Compte.findById(tailleurId).populate('user_id').lean();
            if (!account) {
                return res.status(404).json({ message: 'Compte introuvable', status: 'KO' });
            }
    
            const userType = account.user_id.type; // Type d'utilisateur ('client' ou 'tailleur')
    
            let statuses = [];
    
            if (userType === 'client') {
                // Récupérer les posts des tailleurs auxquels ce client est abonné (si leur compte est activé)
                const tailleursSuivis = account.follower_ids.map(follower => follower._id);
                statuses = await Status.find({
                    tailleur_id: { $in: tailleursSuivis },
                    'tailleur_id.compte_id': { isActive: true }  // Vérifier que le compte du tailleur est activé
                }).populate('tailleur_id').lean();
            } else if (userType === 'tailleur') {
                // Récupérer ses propres posts et ceux des tailleurs auxquels il est abonné (si leur compte est activé)
                const tailleursSuivis = account.follower_ids.map(follower => follower._id);
                statuses = await Status.find({
                    $or: [
                        { tailleur_id: { $in: tailleursSuivis }, 'tailleur_id.compte_id': { isActive: true } }, // Posts des tailleurs suivis
                        { tailleur_id: tailleurId } // Ses propres posts
                    ]
                }).populate('tailleur_id').lean();
            }
    
            if (statuses.length === 0) {
                return res.status(404).json({ message: 'Aucun post trouvé', status: 'KO' });
            }
    
            res.status(200).json({ statuses, status: 'OK' });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 'KO' });
        }
    }

    //le tailleur pourra bloquer  un autre tailleur abonné

/* ainsi qu’un client abonnée aussi
     */

    // Créer un nouveau statut
  async createStatus(req, res) {
    try {
        const tailleurId = req.id;

        const { files, description, viewsNB, categories } = req.body;

        // Vérifiez si l'ID est valide
        if (!mongoose.Types.ObjectId.isValid(tailleurId)) {
            return res.status(400).json({ message: 'ID de tailleur invalide', status: 'KO' });
        }

        // Définir la durée automatiquement, par exemple, 1 minute (60 secondes)
        const autoDuration = 1 ; // le statu sera supprimer apres 24h durée en minutes

        const newStatus = new Status({
            files: files || 'example.mp4',
            description: description || 'Model du jour',
            duration: autoDuration, // durée automatiquement définie
            viewsNB: viewsNB || 1000,
            categories: categories || 'video',
            tailleur_id: tailleurId
        });

        // Sauvegarder le nouveau statut dans la base de données
        const savedStatus = await newStatus.save();

        // Planifier la suppression du statut après la durée définie (1 minute)
        setTimeout(async () => {
            await Status.deleteOne({ _id: savedStatus._id });
            console.log(`Statut avec l'ID ${savedStatus._id} supprimé après ${autoDuration} minute(s).`);
        }, autoDuration * 60 * 1000); // Conversion en millisecondes

        res.status(201).json({ message: 'Statut créé', status: savedStatus });
    } catch (error) {
        console.error('Erreur lors de la création du statut:', error);
        res.status(500).json({ message: error.message, status: 'KO' });
    }
}

    async listStatus(req, res) {
        try {
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
