import Compte from "../model/Compte.js";
import User from "../model/User.js";
import Post from "../model/Post.js";
import Comment from "../model/Comment.js";
import CommentResponse from "../model/CommentResponse.js";

class ClientController{
    async userProfile(req, res) {
        // const user = await this.getLoginUser(req,res);
        const id = req.id;
        // return res.json(id);
        // Trouver le client par ID
        const compte = await Compte.findById(id);
        // return res.json(!compte);
        if (!compte) {
            return res.status(404).json({message: 'User non trouvé', status: 'KO'});
        }
        // return res.json(!compte);
        return res.json({compte, message: 'Le profile de l\'utilisateur' , status: 'OK'});
    }

    async accueilSearch(req, res) {
        const {searchText} = req.body
        /**
         * Faire la validation
         */
        const regex = new RegExp(searchText, 'i');

        // Search in users collection
        const usersResult = await User.find({
            $or: [
                { lastname: { $regex: regex } },
                { firstname: { $regex: regex } }
            ]
        });


        // Extract user IDs
        const userIds = await usersResult.map(user => user._id);

        // Search in comptes collection using the user IDs
        const comptes = await Compte.find({
            $or: [
                { user_id: { $in: userIds } },
                { identifiant: { $regex: regex } }
            ]
        });

        if(!comptes){
            return res.status(500).json({message: 'pas de compte retrouver', status: 'KO'});
        }

        const posts = await Post.find({
            $or: [
                { content: { $regex: regex } },
                { title: { $regex: regex } }
            ]
        })
        if(!posts){
            return res.status(500).json({message: 'pas de post retrouver', status: 'KO'});
        }
        return res.json({comptes, posts, message: 'Résultats de la recherche', status: 'OK'});
    }

    async ajoutComment(req, res) {
        const {content, idPost} = req.body;
        const idCompte = req.id;

        /**
         * valider le content ici
         */

        const newComment = new Comment({
            content,
            compte_id: idCompte,
            post_id: idPost,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        await newComment.save();

        const post = await Post.findByIdAndUpdate(idPost, {
            $push: { comment_ids: newComment._id },
            updatedAt: new Date()
        }, { new: true });

        if (!post) {
            return res.status(404).json({message: 'Post non trouvé', status: 'KO'});
        }

        return res.json({comment: newComment, message: 'Commentaire ajouté', status: 'OK'});

    }

    async reponseComment(req, res) {
        const {content, idComment, idCompte} = req.body;

        /**
         * valider le content ici
         */

        const newCommentResponse = new CommentResponse({
            texte: content,
            compte_id: idCompte,
            comment_id: idComment,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        await newCommentResponse.save();

        const comment = await Comment.findByIdAndUpdate(idComment, {
            $push: { commentResponse_ids: newCommentResponse._id },
            updatedAt: new Date()
        }, { new: true });

        if (!comment) {
            return res.status(404).json({message: 'Commentaire non trouvé', status: 'KO'});
        }

        return res.json({commentResponse: newCommentResponse, message: 'Réponse ajoutée', status: 'OK'});
    }

    async deleteComment(req, res) {
        const {idComment} = req.body;
        const idCompte = req.id;

        const compte = await Compte.findById(idCompte);

        if (compte.role === "tailleur"){

        }

        const comment = await Comment.findByIdAndDelete(idComment);

        if (!comment) {
            return res.status(404).json({message: 'Commentaire non trouvé', status: 'KO'});
        }

        return res.json({message: 'Commentaire supprimé', status: 'OK'});
    }

    async deleteResponseComment(req, res) {
        const {idCommentResponse} = req.body;

        const commentResponse = await CommentResponse.findByIdAndDelete(idCommentResponse);

        if (!commentResponse) {
            return res.status(404).json({message: 'Réponse de commentaire non trouvée', status: 'KO'});
        }

        return res.json({message: 'Réponse de commentaire supprimée', status: 'OK'});
    }
}

export default new ClientController();