import mongoose from 'mongoose';
import Message from '/home/aissata/Nodejs_Project/Tailor_Project/projet-tailleur-backend/model/Message.js';
import Like from '/home/aissata/Nodejs_Project/Tailor_Project/projet-tailleur-backend/model/Like.js';

class ClientController {
    // Récupérer tous les messages d'un client (utilisateur)
    async getAllMessages(req, res) {
        try {
            const clientId = req.params.clientId || req.body.clientId || req.id;


            if (!mongoose.Types.ObjectId.isValid(clientId)) {
                return res.status(400).json({ message: 'ID du client invalide', status: 'KO' });
            }

            const messages = await Message.find({
                $or: [
                    { sender_id: clientId },
                    { receiver_id: clientId }
                ]
            }).populate('sender_id receiver_id', 'nom email');

            if (messages.length === 0) {
                return res.status(404).json({ message: 'Aucun message trouvé', status: 'KO' });
            }

            res.status(200).json({ messages, status: 'OK' });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 'KO' });
        }
    }

    // Envoyer un nouveau message
    async sendMessage(req, res) {
        try {
            const senderId = req.params.senderId || req.body.senderId || req.id;
            const receiverId = req.params.receiverId || req.body.receiverId || req.id;
            const texte = req.params.texte || req.body.texte || req.id;

           
            // Utilisez ces valeurs pour tester la fonction


            // Vérifiez si les IDs sont valides
            if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
                return res.status(400).json({ message: 'ID de l’expéditeur ou du destinataire invalide', status: 'KO' });
            }

            // Créer un nouveau message
            const newMessage = new Message({
                texte,
                sender_id: senderId,
                receiver_id: receiverId
            });

            // Sauvegarder le message dans la base de données
            const savedMessage = await newMessage.save();

            res.status(201).json({ message: 'Message envoyé avec succès', data: savedMessage, status: 'OK' });
        } catch (err) {
            console.error('Erreur lors de l\'envoi du message:', err); // Ajoutez un log d'erreur pour plus de détails
            return res.status(500).json({ message: err.message, status: 'KO' });
        }
    }

    // Ajouter un like
    async addLike(req, res) {
        try {
            const { postId, compteId } = req.body;

            // Vérifier si un like existe déjà pour le même post et compte
            const existingLike = await Like.findOne({ post_id: postId, compte_id: compteId });
            if (existingLike) {
                if (existingLike.etat === 'like') {
                    return res.status(400).json({ message: 'Le like est déjà enregistré', status: 'KO' });
                } else {
                    // Changer de dislike à like
                    existingLike.etat = 'like';
                    existingLike.updatedAt = new Date();
                    await existingLike.save();

                    // Décrémenter le compteur de dislikes et incrémenter celui de likes
                    await Post.findByIdAndUpdate(postId, { $inc: { likeCount: 1, dislikeCount: -1 } });

                    return res.status(200).json({ message: 'État changé de dislike à like', data: existingLike, status: 'OK' });
                }
            }

            // Créer un nouveau like
            const newLike = new Like({
                post_id: postId,
                compte_id: compteId,
                etat: 'like',
                createdAt: new Date(),
                updatedAt: new Date()
            });

            const savedLike = await newLike.save();

            // Incrémenter le compteur de likes
            await Post.findByIdAndUpdate(postId, { $inc: { likeCount: 1 } });

            res.status(201).json({ message: 'Like ajouté avec succès', data: savedLike, status: 'OK' });

        } catch (err) {
            return res.status(500).json({ message: err.message, status: 'KO' });
        }
    }

    // Ajouter un dislike
    async addDislike(req, res) {
        try {
            const { postId, compteId } = req.body;

            // Vérifier si un dislike existe déjà pour le même post et compte
            const existingLike = await Like.findOne({ post_id: postId, compte_id: compteId });
            if (existingLike) {
                if (existingLike.etat === 'dislike') {
                    return res.status(400).json({ message: 'Le dislike est déjà enregistré', status: 'KO' });
                } else {
                    // Changer de like à dislike
                    existingLike.etat = 'dislike';
                    existingLike.updatedAt = new Date();
                    await existingLike.save();

                    // Décrémenter le compteur de likes et incrémenter celui de dislikes
                    await Post.findByIdAndUpdate(postId, { $inc: { dislikeCount: 1, likeCount: -1 } });

                    return res.status(200).json({ message: 'État changé de like à dislike', data: existingLike, status: 'OK' });
                }
            }

            // Créer un nouveau dislike
            const newDislike = new Like({
                post_id: postId,
                compte_id: compteId,
                etat: 'dislike',
                createdAt: new Date(),
                updatedAt: new Date()
            });

            const savedDislike = await newDislike.save();

            // Incrémenter le compteur de dislikes
            await Post.findByIdAndUpdate(postId, { $inc: { dislikeCount: 1 } });

            res.status(201).json({ message: 'Dislike ajouté avec succès', data: savedDislike, status: 'OK' });

        } catch (err) {
            return res.status(500).json({ message: err.message, status: 'KO' });
        }
    }

    // Supprimer un like ou dislike (unlike)
    async removeLikeOrDislike(req, res) {
        try {
            const { postId, compteId, etat } = req.body;

            // Vérifier que l'état est valide
            if (!['like', 'dislike'].includes(etat)) {
                return res.status(400).json({ message: 'État invalide', status: 'KO' });
            }

            // Supprimer l'interaction pour le post, le compte, et l'état spécifiés
            const result = await Like.deleteOne({ post_id: postId, compte_id: compteId, etat });

            if (result.deletedCount === 0) {
                return res.status(404).json({ message: `${etat.charAt(0).toUpperCase() + etat.slice(1)} non trouvé`, status: 'KO' });
            }

            // Décrémenter le compteur de l'état supprimé
            const stateUpdate = {};
            stateUpdate[`${etat}Count`] = -1;
            await Post.findByIdAndUpdate(postId, { $inc: stateUpdate });

            res.status(200).json({ message: `${etat.charAt(0).toUpperCase() + etat.slice(1)} supprimé avec succès`, status: 'OK' });

        } catch (err) {
            return res.status(500).json({ message: err.message, status: 'KO' });
        }
    }

































































}

export default new ClientController();