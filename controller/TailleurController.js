import Post from "../model/Post.js";
import Tailleur from "../model/Tailleur.js";

class TailleurController {
    listMyAllPosts(req, res) {
        try {

        } catch (err) {
            return res.status(500).json({message: err.message,status: 'KO'});
        }
    }

    async createPost(req, res) {
        try {
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

    // methode pour modifier un post.
    // async updatePost(req, res) {
    //     try {
    //         const idPost = req.params.id;

    //         // Valider les champs
    //         const { content, title, image } = req.body;

    //         if (!content || typeof content !== 'string') {
    //             return res.status(400).json({ message: "Content must be a non-empty string", status: 'KO' });
    //         }

    //         if (!title || typeof title !== 'string') {
    //             return res.status(400).json({ message: "Title must be a non-empty string", status: 'KO' });
    //         }

    //         if (!image || !Array.isArray(image) || image.length === 0) {
    //             return res.status(400).json({ message: "Image must be a non-empty array", status: 'KO' });
    //         }

    //         const validCategories = ['video', 'image'];
    //         if (!image.every(item => validCategories.includes(item))) {
    //             return res.status(400).json({ message: "Image array must only contain 'video' or 'image'", status: 'KO' });
    //         }

    //         // Modifier le post
    //         const post = await Post.findOne({ _id: idPost });
    //         if (!post) {
    //             return res.status(404).json({ message: "Post not found", status: 'KO' });
    //         }

    //         post.content = content;
    //         post.title = title;
    //         post.image = image;
    //         post.updatedAt = new Date();

    //         await post.save();

    //         res.status(200).json({ message: "Post updated successfully", status: 'OK', post: post });
            
    //     } catch (err) {
    //         return res.status(500).json({message: err.message, status: 'oooKO'});
    //     }
    // }

    // async deletePost(req, res) {
    //     try {
    //         const idPost = req.params.id;

    //         // Supprimer le post
    //         const post = await Post.findOne({ _id: idPost });
    //         if (!post) {
    //             return res.status(404).json({ message: "Post not found", status: 'KO' });
    //         }

    //         const tailleur = await Tailleur.findOne({ compte_id: post.author_id });
    //         if (!tailleur) {
    //             return res.status(404).json({ message: "Tailleur not found", status: 'KO' });
    //         }

    //         tailleur.post_ids = tailleur.post_ids.filter(id => id.toString() !== idPost);
    //         await tailleur.save();

    //         await Post.deleteOne({ _id: idPost });

    //         res.status(200).json({ message: "Post deleted successfully", status: 'OK' });

    //     } catch (err) {
    //         return res.status(500).json({message: err.message, status: 'oooKO'});
    //     }
    // }


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