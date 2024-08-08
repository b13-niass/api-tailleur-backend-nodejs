import express from "express"
import clientController from "../controller/ClientController.js";
import {isAuthenticatedGlobal} from "../middleware/auth.js";

const router = express.Router();

router.use(isAuthenticatedGlobal);

router.route('/profile').get(clientController.userProfile);

router.route('/accueil/search').post(clientController.accueilSearch);
router.route('/posts/comment').post(clientController.ajoutComment).delete(clientController.deleteComment);
router.route('/posts/comment/reponse').post(clientController.reponseComment).delete(clientController.deleteResponseComment);

export {router};