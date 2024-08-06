import {userInToken} from "../utils/utils.js";
import Controller from "../core/controller/Controller.js";

class TailleurController extends Controller{

    listMyAllPosts(req, res) {
        try {

        } catch (err) {
            return res.status(500).json({message: err.message,status: 'KO'});
        }
    }

    async createPost(req, res) {
        try {
            const user = userInToken(req,res);

        } catch (err) {
            return res.status(500).json({message: err.message, status: 'KO'});
        }
    }
}

export default new TailleurController();
