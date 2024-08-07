import Compte from "../model/Compte.js";
import User from "../model/User.js";
import Post from "../model/Post.js";

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

}

export default new ClientController();